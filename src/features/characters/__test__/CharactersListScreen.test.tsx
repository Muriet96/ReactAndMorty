jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n/config';
import { useCharacters } from '../hooks/useCharacters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CharactersListScreen from '../screens/CharactersListScreen';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { CharactersStackParamList } from '../../../navigation/types';
import * as usePageStateModule from '../hooks/usePageState';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('../hooks/useCharacters', () => ({
  useCharacters: jest.fn(),
}));

const mockedUseCharacters = useCharacters as jest.Mock;

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
      </QueryClientProvider>
    </Provider>
  );

type NavigationType = StackNavigationProp<CharactersStackParamList, 'CharactersList'>;
type RouteType = RouteProp<CharactersStackParamList, 'CharactersList'>;

const mockNavigation = {
  navigate: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn().mockReturnValue(true),
  canGoBack: jest.fn().mockReturnValue(true),
  getParent: jest.fn(),
  getState: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
} as unknown as NavigationType;

const mockRoute: RouteType = {
  key: 'mock-key',
  name: 'CharactersList',
  params: {
    showFavorites: false,
  },
};

const mockFavoritesRoute: RouteType = {
  key: 'mock-key-fav',
  name: 'CharactersList',
  params: {
    showFavorites: true,
  },
};

describe('CharactersListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      data: {
        info: { count: 2, pages: 1, next: null, prev: null },
        results: [
          {
            id: 1,
            name: 'Rick Sanchez',
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            status: 'Alive',
            species: 'Human',
          },
          {
            id: 2,
            name: 'Morty Smith',
            image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
            status: 'Alive',
            species: 'Human',
          },
        ],
      },
    });

    const { useSelector } = require('react-redux');
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        characters: {
          favorites: [],
          characters: [
            {
              id: 1,
              name: 'Rick Sanchez',
              image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            },
            {
              id: 2,
              name: 'Morty Smith',
              image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
            },
          ],
        },
      })
    );
  });

  it('renders the characters list and search bar', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByPlaceholderText(/search/i)).toBeTruthy();
    expect(getByText('Rick Sanchez')).toBeTruthy();
    expect(getByText('Morty Smith')).toBeTruthy();
  });

  it('shows only favorites when showFavorites is true', () => {
    const { useSelector } = require('react-redux');
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        characters: {
          favorites: [2],
          characters: [
            {
              id: 1,
              name: 'Rick Sanchez',
              image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            },
            {
              id: 2,
              name: 'Morty Smith',
              image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
            },
          ],
        },
      })
    );

    const { getByText } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockFavoritesRoute} />
    );

    expect(getByText('Morty Smith')).toBeTruthy();
  });

  it('shows empty message if showFavorites is true and there are no favorites', () => {
    const { useSelector } = require('react-redux');
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        characters: {
          favorites: [],
          characters: [
            {
              id: 1,
              name: 'Rick Sanchez',
              image: '',
            },
            {
              id: 2,
              name: 'Morty Smith',
              image: '',
            },
          ],
        },
      })
    );

    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockFavoritesRoute} />
    );

    expect(getByTestId('empty-list-message')).toBeTruthy();
  });

  it('filters characters by search query', () => {
    const { getByPlaceholderText, queryByText } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );
    
    fireEvent.changeText(getByPlaceholderText(/search/i), 'Morty');
    expect(queryByText('Rick Sanchez')).toBeNull();
    expect(queryByText('Morty Smith')).toBeTruthy();
  });

  it('shows loading indicator when isLoading is true', () => {
    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      data: undefined,
    });

    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows error message and retry button when there is an error', () => {
    const mockRefetch = jest.fn();
    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: false,
      error: new Error('Test error'),
      refetch: mockRefetch,
      data: undefined,
    });

    const { getByTestId, getByText } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText(/common.retry/i)).toBeTruthy();
    fireEvent.press(getByTestId('retry-button'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('shows empty list message when there are no characters', () => {
    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      data: { info: { count: 0, pages: 0, next: null, prev: null }, results: [] },
    });
    const { useSelector } = require('react-redux');
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        characters: {
          favorites: [],
          characters: [],
        },
      })
    );

    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByTestId('empty-list-message')).toBeTruthy();
  });

  it('filteredCharacters returns [] if characters is undefined', () => {
    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      data: { info: { count: 0, pages: 0, next: null, prev: null }, results: [] },
    });
    const { useSelector } = require('react-redux');
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        characters: {
          favorites: [],
          characters: undefined,
        },
      })
    );
    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(getByTestId('empty-list-message')).toBeTruthy();
  });

  it('loads favorites from AsyncStorage on mount', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    const mockFavorites = [1, 2];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockFavorites));

    renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('favorites');
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('navigates to character detail when a character is pressed', () => {
    const { getByText } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Rick Sanchez'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('CharactersDetail', {
      id: 1,
      title: 'Rick Sanchez',
    });
  });

  it('shows loading more indicator when loading additional pages', () => {
    const setPageMock = jest.fn();
    jest.spyOn(usePageStateModule, 'usePageState').mockReturnValue([2, setPageMock]);

    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      data: {
        info: { count: 2, pages: 2, next: 'next', prev: null },
        results: [
          { id: 1, name: 'Rick Sanchez', image: '', status: 'Alive', species: 'Human' }
        ]
      }
    });

    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByTestId('loading-more-indicator')).toBeTruthy();
  });

  it('adds or removes character from favorites on icon press', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    const { getAllByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getAllByTestId('favorites-toggle')[0]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('calls setPage when onEndReached is triggered', () => {
    const setPageMock = jest.fn();
    jest.spyOn(usePageStateModule, 'usePageState').mockReturnValue([1, setPageMock]);

    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      data: {
        info: { count: 2, pages: 2, next: 'next', prev: null },
        results: [
          { id: 1, name: 'Rick Sanchez', image: '', status: 'Alive', species: 'Human' }
        ]
      }
    });

    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockRoute} />
    );

    const flatList = getByTestId('characters-flatlist');
    fireEvent(flatList, 'onEndReached');

    expect(setPageMock).toHaveBeenCalledWith(expect.any(Function));
  });

  it('uses showFavorites as false if route.params is undefined', () => {
    const routeSinParams = { key: 'key', name: 'CharactersList' } as any;
    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={routeSinParams} />
    );
    expect(getByTestId('characters-flatlist')).toBeTruthy();
  });

  it('uses showFavorites as true if route.params.showFavorites is true', () => {
    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockFavoritesRoute} />
    );
    expect(getByTestId('characters-flatlist')).toBeTruthy();
  });

  it('does not call setPage when onEndReached and there is next page and showFavorites is true', () => {
    const setPageMock = jest.fn();
    jest.spyOn(usePageStateModule, 'usePageState').mockReturnValue([1, setPageMock]);

    (useCharacters as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      data: {
        info: { count: 2, pages: 2, next: 'next', prev: null },
        results: [
          { id: 1, name: 'Rick Sanchez', image: '', status: 'Alive', species: 'Human' }
        ]
      }
    });

    const { getByTestId } = renderWithProviders(
      <CharactersListScreen navigation={mockNavigation} route={mockFavoritesRoute} />
    );

    const flatList = getByTestId('characters-flatlist');
    fireEvent(flatList, 'onEndReached');

    expect(setPageMock).not.toHaveBeenCalled();
  });
});