import { renderHook, act } from '@testing-library/react-hooks';
import { useCharactersActions } from '../useCharactersActions';
import { useDispatch } from 'react-redux';
import { toggleFavorite } from '../../charactersSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useCharactersActions', () => {
  it('should dispatch toggleFavorite with the correct id', () => {
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    const { result } = renderHook(() => useCharactersActions());

    act(() => {
      result.current.toggleFavorite(42);
    });

    expect(mockDispatch).toHaveBeenCalledWith(toggleFavorite(42));
  });
});