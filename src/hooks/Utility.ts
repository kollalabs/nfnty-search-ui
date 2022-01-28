import { useCallback, useEffect, useState } from 'react';

const useDebounce = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useKeyPress = (keys: string[], fireMethod: (...args: any[]) => any): any => {
  const wrappedFireMethod = useCallback(fireMethod, []);

  const listenerFunc = useCallback(
    (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        wrappedFireMethod(event);
      }
    },
    [keys, fireMethod]
  );

  useEffect(() => {
    document.addEventListener('keyup', listenerFunc, false);
    return () => document.removeEventListener('keyup', listenerFunc, false);
  }, []);
};

export { useDebounce, useKeyPress };
