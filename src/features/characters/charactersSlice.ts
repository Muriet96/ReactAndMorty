/**
 * Redux slice for managing characters state.
 *
 * @module charactersSlice
 * @remarks
 * - Stores the list of characters articles fetched from the API.
 * - Manages favorite characters IDs and search queries.
 * - Provides actions and reducer for updating characters, favorites, and search state.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character } from './types';

interface CharactersState {
  characters: Character[];
  favorites: number[];
}

const initialState: CharactersState = {
  characters: [],
  favorites: []
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    /**
     * Sets the list of characters in the state.
     *
     * @param {CharactersState} state - The current state.
     * @param {PayloadAction<{ characters: Character[]; replaceCharacters?: boolean }>} action - The action containing the characters array and replace flag.
     */
    setCharacters: (
      state,
      action: PayloadAction<{ characters: Character[]; replaceCharacters?: boolean }>
    ) => {
      const { characters, replaceCharacters = true } = action.payload;
      state.characters = replaceCharacters
        ? characters
        : [...state.characters, ...characters];
    },
    /**
     * Toggles the favorite status of a characters article by its ID.
     *
     * @param {CharactersState} state - The current state.
     * @param {PayloadAction<number>} action - The action containing the characters ID.
     */
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const exists = state.favorites.includes(id);
      state.favorites = exists
        ? state.favorites.filter(favId => favId !== id)
        : [...state.favorites, id];
    },
    /**
     * Loads the list of favorite characters IDs from storage.
     *
     * @param {CharactersState} state - The current state.
     * @param {PayloadAction<number[]>} action - The action containing the favorite IDs.
     */
    loadFavorites: (state, action: PayloadAction<number[]>) => {
      state.favorites = action.payload;
    },
  },
});

export default charactersSlice.reducer;
export const { setCharacters, toggleFavorite, loadFavorites } = charactersSlice.actions;