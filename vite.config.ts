import react from '@vitejs/plugin-react';
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from 'vitest/config';

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/types.ts',
      ],
      include: [
        'src/features/game/domain/**/*.{ts,tsx}',
        'src/features/game/hooks/**/*.{ts,tsx}',
        'src/features/game/services/**/*.{ts,tsx}',
        'src/features/ranking/rankingStore.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        branches: 70,
        functions: 75,
        lines: 75,
        statements: 75,
      },
    },
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
