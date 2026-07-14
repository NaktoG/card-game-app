export const APP_CONFIG = {
  name: 'Card Game App',
  brandLabel: 'NaktoG Studio Demo',
  repositoryUrl: 'https://github.com/NaktoG/card-game-app',
  repositoryLabel: 'github.com/NaktoG/card-game-app',
  basePath: import.meta.env.BASE_URL,
  serviceWorkerPath: `${import.meta.env.BASE_URL}sw.js`,
} as const;
