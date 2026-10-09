import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);

  const isFavorite = useCallback(
    (id) => favorites.some((r) => r.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (recipeSummary) => {
      setFavorites((prev) => {
        const exists = prev.some((r) => r.id === recipeSummary.id);
        return exists
          ? prev.filter((r) => r.id !== recipeSummary.id)
          : [...prev, recipeSummary];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (id) => {
      setFavorites((prev) => prev.filter((r) => r.id !== id));
    },
    [setFavorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
