import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { APP_CONFIG } from './config/appConfig';

const root = process.cwd();

async function readProjectFile(relativePath: string) {
  return readFile(path.join(root, relativePath), 'utf8');
}

describe('PWA metadata and offline fallback', () => {
  it('keeps Vite and runtime PWA paths relative for static subpath deployment', () => {
    expect(APP_CONFIG.basePath).toBe('./');
    expect(APP_CONFIG.serviceWorkerPath).toBe('./sw.js');
  });

  it('builds with a relative Vite base so emitted assets are subpath-safe', async () => {
    const viteConfig = await readProjectFile('vite.config.ts');

    expect(viteConfig).toMatch(/base:\s*['"]\.\/['"]/);
    expect(viteConfig).not.toMatch(/base:\s*['"]\/['"]/);
  });

  it('keeps manifest navigation and icon paths safe for static subpaths', async () => {
    const manifest = JSON.parse(await readProjectFile('public/manifest.webmanifest')) as {
      start_url: string;
      scope: string;
      description: string;
      icons: Array<{ src: string }>;
    };

    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    expect(manifest.icons).toHaveLength(1);
    expect(manifest.icons[0]?.src).toBe('./pwa-icon.svg');
    expect(manifest.description).toMatch(/gameplay can require network card access/i);
  });

  it('states offline limits without promising full offline gameplay', async () => {
    const offlinePage = await readProjectFile('public/offline.html');

    expect(offlinePage).toMatch(/some screens may stay available offline/i);
    expect(offlinePage).toMatch(/gameplay can require network access to card and deck data/i);
    expect(offlinePage).not.toMatch(/full offline gameplay/i);
  });

  it('aligns app metadata with local ranking and runtime card access limits', async () => {
    const indexHtml = await readProjectFile('index.html');

    expect(indexHtml).toMatch(/local ranking/i);
    expect(indexHtml).toMatch(/runtime card access/i);
    expect(indexHtml).toContain('href="./manifest.webmanifest"');
    expect(indexHtml).toContain('href="./pwa-icon.svg"');
    expect(indexHtml).toContain('href="./favicon.svg"');
    expect(indexHtml).toContain('content="./og-card.svg"');
    expect(indexHtml).not.toMatch(/%BASE_URL%(manifest\.webmanifest|pwa-icon\.svg|favicon\.svg|og-card\.svg)/);
    expect(indexHtml).not.toMatch(/(?:href|content)="\/(?:manifest\.webmanifest|pwa-icon\.svg|favicon\.svg|og-card\.svg)"/);
  });
});
