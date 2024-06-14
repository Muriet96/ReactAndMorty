import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { useCharacters } from '../useCharacters';
import { useDispatch } from 'react-redux';
import * as reactQuery from '@tanstack/react-query';
import { fetchCharacters } from '../../../../services/characters';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('../../../../services/characters', () => ({
  fetchCharacters: jest.fn(),
}));
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

describe('useCharacters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches setCharacters when there is data', async () => {
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    const mockData = {
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: { name: 'Earth (C-137)', url: '' },
          location: { name: 'Citadel of Ricks', url: '' },
          image: '',
          episode: [],
          url: '',
          created: '',
        }
      ],
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      }
    };
    (reactQuery.useQuery as jest.Mock).mockImplementation(() => ({
      data: mockData,
      isLoading: false,
      error: null,
    }));

    renderHook(() => useCharacters());

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String),
          payload: expect.objectContaining({
            characters: mockData.results,
            replaceCharacters: true,
          }),
        })
      );
    });
  });

  it('does not dispatch setCharacters if there is no data', async () => {
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (reactQuery.useQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: null,
    }));

    renderHook(() => useCharacters());

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('calls fetchCharacters with the correct page number', async () => {
    const mockData = { results: [], info: { count: 0, pages: 0, next: null, prev: null } };
    (fetchCharacters as jest.Mock).mockResolvedValue(mockData);

    const useQuery = jest.requireActual('@tanstack/react-query').useQuery;
    jest.spyOn(require('@tanstack/react-query'), 'useQuery').mockImplementation((opts: any) => {
      opts.queryFn();
      return { data: mockData, isLoading: false, error: null };
    });

    renderHook(() => useCharacters(5));

    expect(fetchCharacters).toHaveBeenCalledWith(5);
  });
});