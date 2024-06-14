import charactersReducer, { 
  setCharacters, 
  toggleFavorite, 
  loadFavorites 
} from '../charactersSlice';
import { Character } from '../types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'test.jpg',
  episode: [],
  url: 'https://test.com',
  created: '',
};

describe('charactersSlice reducer', () => {
  const initialState = {
    characters: [],
    favorites: [],
  };

  it('should handle initial state', () => {
    expect(charactersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCharacters (replace)', () => {
    const actual = charactersReducer(
      initialState,
      setCharacters({ characters: [mockCharacter], replaceCharacters: true })
    );
    expect(actual.characters).toEqual([mockCharacter]);
  });

  it('should handle setCharacters (append)', () => {
    const prevState = {
      characters: [mockCharacter],
      favorites: [],
    };
    const newCharacter = { ...mockCharacter, id: 2, name: 'Morty Smith' };
    const actual = charactersReducer(
      prevState,
      setCharacters({ characters: [newCharacter], replaceCharacters: false })
    );
    expect(actual.characters).toEqual([mockCharacter, newCharacter]);
  });

  it('should handle setCharacters (default replaceCharacters=true)', () => {
    const prevState = {
      characters: [mockCharacter],
      favorites: [],
    };
    const newCharacter = { ...mockCharacter, id: 2, name: 'Morty Smith' };
    const actual = charactersReducer(
      prevState,
      setCharacters({ characters: [newCharacter] })
    );
    expect(actual.characters).toEqual([newCharacter]);
  });

  it('should handle toggleFavorite (add)', () => {
    const state = charactersReducer(initialState, toggleFavorite(mockCharacter.id));
    expect(state.favorites).toEqual([mockCharacter.id]);
  });

  it('should handle toggleFavorite (remove)', () => {
    const stateWithFavorite = {
      ...initialState,
      favorites: [mockCharacter.id]
    };
    const state = charactersReducer(stateWithFavorite, toggleFavorite(mockCharacter.id));
    expect(state.favorites).toEqual([]);
  });

  it('should handle loadFavorites', () => {
    const actual = charactersReducer(initialState, loadFavorites([1, 2, 3]));
    expect(actual.favorites).toEqual([1, 2, 3]);
  });
});