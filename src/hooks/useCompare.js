// src/hooks/useCompare.js

import { useContext } from 'react';
import { CompareContext } from '../context/CompareContext';

/**
 * Wrapper do CompareContext com compareCount.
 * @returns {{ compareList, addToCompare, removeFromCompare, clearCompare, canAdd, isFull, isInCompare, compareCount }}
 */
export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return {
    ...ctx,
    compareCount: ctx.compareList.length,
  };
}