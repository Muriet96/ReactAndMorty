import { useDispatch } from 'react-redux';
import { toggleFavorite } from '../charactersSlice';

/**
 * Custom React hook that provides actions related to characters characters.
 *
 * @returns An object containing the `toggleFavorite` function, which toggles the favorite status of a characters character by its ID.
 *
 * @example
 * const { toggleFavorite } = useCharactersActions();
 * toggleFavorite(123); // Toggles the favorite status for the character with ID 123
 */
export const useCharactersActions = () => {
  const dispatch = useDispatch();
  
  const handleToggleFavorite = (characterId: number) => {
    dispatch(toggleFavorite(characterId));
  };

  return { toggleFavorite: handleToggleFavorite };
};