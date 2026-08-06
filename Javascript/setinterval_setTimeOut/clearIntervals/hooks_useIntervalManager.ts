import { useRef, useCallback } from 'react';

export function useIntervalManager() {
  const intervalIds = useRef<number[]>([]);

  const setCustomInterval = useCallback((callback: () => void, delay: number) => {
    const id = window.setInterval(callback, delay);
    intervalIds.current.push(id);
    return id;
  }, []);

  const clearAllIntervals = useCallback(() => {
    intervalIds.current.forEach(id => clearInterval(id));
    intervalIds.current = [];
  }, []);

  return { setCustomInterval, clearAllIntervals };
}

