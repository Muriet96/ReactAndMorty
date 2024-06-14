import { useQuery } from '@tanstack/react-query';
import { fetchCharacters, FetchCharactersResponse } from '../../../services/characters';
import { useDispatch } from 'react-redux';
import { setCharacters } from '../charactersSlice';
import { useEffect } from 'react';


/**
 * Custom React hook to fetch and manage a paginated list of characters.
 *
 * @param page - The page number to fetch. Defaults to 1.
 * @param disabled - If true, disables fetching and state updates. Defaults to false.
 * @returns The result of the `useQuery` hook, including loading, error, and data states.
 *
 * @remarks
 * - Fetches character data using the provided `fetchCharacters` function.
 * - Dispatches the `setCharacters` action to update the Redux store with fetched results.
 * - If `page` is 1, replaces the existing characters in the store; otherwise, appends.
 * - Fetching and dispatching are skipped if `disabled` is true.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCharacters(2);
 * ```
 */
export const useCharacters = (page: number = 1, disabled: boolean = false) => {
  const dispatch = useDispatch();
  const query = useQuery<FetchCharactersResponse, Error>({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    enabled: !disabled,
  });

  useEffect(() => {
    if (!disabled && query.data?.results) {
      dispatch(setCharacters({ 
        characters: query.data.results,
        replaceCharacters: page === 1 
      }));
    }
  }, [query.data, dispatch, page, disabled]);

  return query;
};