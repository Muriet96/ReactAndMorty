import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '@features/characters/charactersSlice';
import { favoritesMiddleware } from './middlewares/favoritesMiddleware';

export const store = configureStore({
  reducer: {
    characters: charactersReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(favoritesMiddleware)
});

export type AppDispatch = typeof store.dispatch;