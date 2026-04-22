import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './en.json';
import urTranslation from './ur.json';

const resources = {
  en: {
    translation: enTranslation
  },
  ur: {
    translation: urTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    }
  });

// Handle RTL support globally
i18n.on('languageChanged', (lng) => {
  document.body.dir = i18n.dir(lng);
  document.documentElement.lang = lng;
});

// Initialize direction on load
document.body.dir = i18n.dir(i18n.language);
document.documentElement.lang = i18n.language;

export default i18n;
