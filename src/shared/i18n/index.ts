import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

const storedLanguage = localStorage.getItem('card-game-language');
const browserLanguage = navigator.language.startsWith('en') ? 'en' : 'es';

void i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: storedLanguage ?? browserLanguage,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

export function persistLanguage(language: 'es' | 'en'): void {
  localStorage.setItem('card-game-language', language);
}

export default i18next;
