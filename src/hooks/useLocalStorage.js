import { useState, useCallback } from 'react';

/**
 * useState com persistência em localStorage.
 * @param {string} key - Chave do localStorage
 * @param {any} initialValue - Valor inicial (se não houver dado salvo)
 * @returns {[any, Function]} [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (valueOrUpdater) => {
      try {
        setStoredValue((prev) => {
          const next =
            typeof valueOrUpdater === 'function'
              ? valueOrUpdater(prev)
              : valueOrUpdater;
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch {
            // localStorage indisponível — ignora silenciosamente
          }
          return next;
        });
      } catch {
        // ignora erros de serialização
      }
    },
    [key]
  );

  return [storedValue, setValue];
}