import { renderHook, act } from '@testing-library/react-hooks';
import { usePageState } from '../usePageState';

describe('usePageState', () => {
  it('uses 1 as the default initial value', () => {
    const { result } = renderHook(() => usePageState());
    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](2);
    });
    expect(result.current[0]).toBe(2);
  });

  it('uses the initial value passed as argument', () => {
    const { result } = renderHook(() => usePageState(5));
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1](10);
    });
    expect(result.current[0]).toBe(10);
  });
});