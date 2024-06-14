/**
 * i18n configuration for the app.
 *
 * @module i18n/config
 * @remarks
 * - Loads translations for all features.
 * - Detects device language and sets fallback.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import charactersTranslations from '@features/characters/i18n';
import commonEn from './common/en.json';
import commonEs from './common/es.json';

const resources = {
  en: {
    common: commonEn,
    ...charactersTranslations.en
  },
  es: {
    common: commonEs,
    ...charactersTranslations.es
  },
};

const locales = Localization.getLocales();
const deviceLang = locales[0]?.languageCode || 'en';
const supportedLangs = ['en', 'es'];
const lng = supportedLangs.includes(deviceLang) ? deviceLang : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common'
  });

export default i18n;