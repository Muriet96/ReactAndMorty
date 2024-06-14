import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CharactersCard from '../components/CharacterCard';
import { Provider, useSelector as useSelectorOriginal } from 'react-redux';
import { store } from '../../../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n/config';

jest.mock('../hooks/useCharactersActions', () => ({
  useCharactersActions: () => ({
    toggleFavorite: jest.fn(),
  }),
}));

jest.mock('react-redux', () => {
  const Actual = jest.requireActual('react-redux');
  return {
    ...Actual,
    useSelector: jest.fn(),
  };
});

const mockCharacter = {
  "id": 1,
  "name": "Rick Sanchez",
  "status": "Alive",
  "species": "Human",
  "type": "",
  "gender": "Male",
  "origin": {
    "name": "Earth (C-137)",
    "url": "https://rickandmortyapi.com/api/location/1"
  },
  "location": {
    "name": "Citadel of Ricks",
    "url": "https://rickandmortyapi.com/api/location/3"
  },
  "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  "episode": [
    "https://rickandmortyapi.com/api/episode/1",
  ],
  "url": "https://rickandmortyapi.com/api/character/1",
  "created": "2017-11-04T18:48:46.250Z"
};

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          {ui}
        </I18nextProvider>
      </QueryClientProvider>
    </Provider>
  );

describe('CharactersCard', () => {
  beforeEach(() => {
    // @ts-ignore
    require('react-redux').useSelector.mockImplementation((selector) => 
      selector({ 
        characters: { 
          favorites: [] 
        } 
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the character name and image correctly', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CharactersCard item={mockCharacter} onPress={jest.fn()} />
    );
    
    expect(getByText('Rick Sanchez')).toBeTruthy();
    expect(getByTestId('character-card')).toBeTruthy();
  });

  it('calls onPress when the card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProviders(
      <CharactersCard item={mockCharacter} onPress={onPress} />
    );
    
    fireEvent.press(getByTestId('character-card'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows filled heart icon when character is favorite', () => {
    // @ts-ignore
    require('react-redux').useSelector.mockImplementation((selector) => 
      selector({ 
        characters: { 
          favorites: [1] 
        } 
      })
    );
    
    const { getByTestId } = renderWithProviders(
      <CharactersCard item={mockCharacter} onPress={jest.fn()} />
    );
    
    const heartIcon = getByTestId('favorites-toggle');
    expect(heartIcon.props.accessibilityLabel).toBe('heart');
  });

  it('shows outline heart icon when character is not favorite', () => {
    // @ts-ignore
    require('react-redux').useSelector.mockImplementation((selector) => 
      selector({ 
        characters: { 
          favorites: [] 
        } 
      })
    );
    
    const { getByTestId } = renderWithProviders(
      <CharactersCard item={mockCharacter} onPress={jest.fn()} />
    );
    
    const heartIcon = getByTestId('favorites-toggle');
    expect(heartIcon.props.accessibilityLabel).toBe('heart-outline');
  });

  it('calls toggleFavorite when the favorite button is pressed', () => {
    const mockToggleFavorite = jest.fn();
    jest.spyOn(require('../hooks/useCharactersActions'), 'useCharactersActions').mockReturnValue({
      toggleFavorite: mockToggleFavorite,
    });
    
    const { getByTestId } = renderWithProviders(
      <CharactersCard item={mockCharacter} onPress={jest.fn()} />
    );
    
    fireEvent.press(getByTestId('favorites-toggle'));
    expect(mockToggleFavorite).toHaveBeenCalledWith(1);
  });

  it('renders the character image with correct source', () => {
    const { getByTestId } = renderWithProviders(
      <CharactersCard item={mockCharacter} onPress={jest.fn()} />
    );
    
    const image = getByTestId('character-card').findByType('Image');
    expect(image.props.source.uri).toBe(mockCharacter.image);
  });
});