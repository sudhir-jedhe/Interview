import { useRef, useCallback } from 'react';

export function useTimeoutManager() {
  const timeoutIds = useRef<number[]>([]);

  const setCustomTimeout = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      callback();
      // Remove the timeout ID from the array once it's executed
      timeoutIds.current = timeoutIds.current.filter(timeoutId => timeoutId !== id);
    }, delay);
    timeoutIds.current.push(id);
    return id;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];
  }, []);

  return { setCustomTimeout, clearAllTimeouts };
}

