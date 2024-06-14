import { Character } from '@features/characters/types';

export type RootState = {
  characters: CharactersState;
};

export type CharactersState = {
  characters: Character[];
  favorites: number[];
};