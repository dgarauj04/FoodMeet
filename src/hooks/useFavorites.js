import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

/**
 * Wrapper do FavoritesContext com favoritesCount.
 * @returns {{ favorites, isFavorite, toggleFavorite, removeFavorite, favoritesCount }}
 */
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return {
    ...ctx,
    favoritesCount: ctx.favorites.length,
  };
}