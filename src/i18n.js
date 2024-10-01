// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "WELCOME TO LINE 3 WAYFINDER",
          // Add more translations here
        },
      },
      hn: {
        translation: {
          welcome: "लाइन 3 वेफ़ाइंडर में आपका स्वागत है",
          // Add more translations here
        },
      },
      // Add more languages here
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language if the selected language is not available
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
