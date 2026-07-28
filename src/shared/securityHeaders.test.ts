import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

type VercelHeader = {
  key: string;
  value: string;
};

type VercelConfig = {
  headers: Array<{
    headers: VercelHeader[];
  }>;
};

const getContentSecurityPolicy = () => {
  const config = JSON.parse(
    readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'),
  ) as VercelConfig;

  const cspHeader = config.headers
    .flatMap((entry) => entry.headers)
    .find((header) => header.key === 'Content-Security-Policy');

  if (!cspHeader) {
    throw new Error('Content-Security-Policy header not found in vercel.json');
  }

  return cspHeader.value;
};

const parseCspDirectives = (csp: string) =>
  new Map(
    csp.split(';').map((directive) => {
      const [name, ...sources] = directive.trim().split(/\s+/);

      return [name, sources];
    }),
  );

describe('Vercel Content Security Policy', () => {
  it('allows Deck API hosts required for card images and API fetches', () => {
    const directives = parseCspDirectives(getContentSecurityPolicy());

    expect(directives.get('img-src')).toEqual(
      expect.arrayContaining([
        'https://deckofcardsapi.com',
        'https://www.deckofcardsapi.com',
        'https://*.deckofcardsapi.com',
      ]),
    );
    expect(directives.get('connect-src')).toEqual(
      expect.arrayContaining(['https://www.deckofcardsapi.com']),
    );
  });
});
