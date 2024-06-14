import AsyncStorage from '@react-native-async-storage/async-storage';
import { favoritesMiddleware } from '../favoritesMiddleware';
import { toggleFavorite } from '@features/characters/charactersSlice';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('favoritesMiddleware', () => {
  const next = jest.fn();
  const getState = jest.fn(() => ({
    characters: { favorites: [1, 2, 3] }
  }));
  const store = { getState } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    next.mockImplementation(action => action);
  });

  it('calls next(action) and saves favorites in AsyncStorage if the action is toggleFavorite', () => {
    const action = toggleFavorite(1);

    const result = favoritesMiddleware(store)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([1, 2, 3]));
    expect(result).toBe(action);
  });

  it('calls next(action) and does NOT save favorites if the action is not toggleFavorite', () => {
    const action = { type: 'other/action' };

    const result = favoritesMiddleware(store)(next)(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(result).toBe(action);
  });
});