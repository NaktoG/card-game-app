const basePath = import.meta.env.BASE_URL === '/' ? './' : import.meta.env.BASE_URL;

export const APP_CONFIG = {
  name: 'Card Game App',
  brandLabel: 'NaktoG Studio Demo',
  repositoryUrl: 'https://github.com/NaktoG/card-game-app',
  repositoryLabel: 'github.com/NaktoG/card-game-app',
  basePath,
  serviceWorkerPath: `${basePath}sw.js`,
} as const;
