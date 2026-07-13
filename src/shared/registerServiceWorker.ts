import { APP_CONFIG } from './config/appConfig';

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(APP_CONFIG.serviceWorkerPath, {
      scope: APP_CONFIG.basePath,
    });
  });
}
