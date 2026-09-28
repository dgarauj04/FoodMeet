// src/context/CompareContext.jsx

import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, API_LIMITS } from '../utils/constants';

export const CompareContext = createContext(null);

/**
 * Provedor de comparação de receitas.
 * Limite rígido: MAX_COMPARE_ITEMS (2).
 * API: { compareList, addToCompare, removeFromCompare, clearCompare, canAdd, isFull }
 */
export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useLocalStorage(STORAGE_KEYS.COMPARE, []);

  const isFull = compareList.length >= API_LIMITS.MAX_COMPARE_ITEMS;
  const canAdd = !isFull;

  const addToCompare = useCallback(
    (summary) => {
      setCompareList((prev) => {
        // Ignora duplicados e quando já está cheio
        if (prev.some((r) => r.id === summary.id)) return prev;
        if (prev.length >= API_LIMITS.MAX_COMPARE_ITEMS) return prev;
        return [...prev, summary];
      });
    },
    [setCompareList]
  );

  const removeFromCompare = useCallback(
    (id) => {
      setCompareList((prev) => prev.filter((r) => r.id !== id));
    },
    [setCompareList]
  );

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, [setCompareList]);

  const isFn = useCallback(
    (id) => compareList.some((r) => r.id === id),
    [compareList]
  );

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, canAdd, isFull, isInCompare: isFn }}
    >
      {children}
    </CompareContext.Provider>
  );
}
