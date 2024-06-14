import axios from 'axios';
import { fetchCharacters } from '../characters';
import { API_CHARACTERS_ENDPOINT } from '../../constants/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchCharacters', () => {
  it('should fetch characters from API and return data with pagination info', async () => {
    const mockCharacters = [
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
    ];
    const mockResponse = {
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: mockCharacters,
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchCharacters();
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_CHARACTERS_ENDPOINT}?page=1`);
    expect(result.results[0].name).toBe('Rick Sanchez');
    expect(result.results[0].status).toBe('Alive');
    expect(result.info.count).toBe(1);
  });

  it('should return empty results if API returns no data', async () => {
    const mockResponse = {
      info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      results: [],
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchCharacters();
    expect(result.results).toEqual([]);
    expect(result.info.count).toBe(0);
  });
});