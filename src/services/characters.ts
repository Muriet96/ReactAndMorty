import axios from 'axios';
import { Character } from '@features/characters/types';
import { API_CHARACTERS_ENDPOINT } from '../constants/api';

export interface FetchCharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

/**
 * Fetches a list of characters from the API endpoint, supporting pagination.
 *
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<FetchCharactersResponse>} A promise that resolves to the paginated characters response.
 * @throws {AxiosError} Throws if the HTTP request fails.
 */
export const fetchCharacters = async (page: number = 1): Promise<FetchCharactersResponse> => {
  const response = await axios.get<FetchCharactersResponse>(`${API_CHARACTERS_ENDPOINT}?page=${page}`);
  return response.data;
};