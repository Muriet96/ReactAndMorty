import 'react-i18next';
import charactersEn from '@features/characters/i18n/en.json';
import charactersEs from '@features/characters/i18n/es.json';

type CharactersTranslations = typeof charactersEn;

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'characters';
    resources: {
      characters: CharactersTranslations;
    };
  }
}