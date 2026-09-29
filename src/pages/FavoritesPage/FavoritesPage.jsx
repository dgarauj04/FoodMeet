import { useNavigate } from 'react-router-dom';
import './FavoritesPage.css';
import { useFavorites } from '../../hooks/useFavorites';
import { useCompare } from '../../hooks/useCompare';
import { RecipeCard } from '../../components/Layout/RecipeCard/RecipeCard';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { Button } from '../../components/ui/Button/Button';
import { ROUTES } from '../../utils/constants';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, isFavorite, toggleFavorite, favoritesCount } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare, clearCompare } = useCompare();

  function handleToggleFavorite(recipe) {
    toggleFavorite(recipe);
  }

  function handleCompare(recipe) {
    if (isInCompare(recipe.id)) removeFromCompare(recipe.id);
    else addToCompare(recipe);
  }

  function handleCompareTwo() {
    clearCompare();
    addToCompare(favorites[0]);
    addToCompare(favorites[1]);
    navigate(ROUTES.COMPARE);
  }

  if (favoritesCount === 0) {
    return (
      <div className="favorites">
        <div className="container">
          <EmptyState
            emoji="🤍"
            title="Seu coração está vazio..."
            message="Ainda não há favoritos! Explore receitas deliciosas e clique no coraçãozinho para guardar as suas preferidas. 💛"
            actionLabel="Explorar receitas"
            onAction={() => navigate(ROUTES.HOME)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="favorites">
      <div className="container">
        <div className="favorites__header">
          <h1 className="favorites__title">Meus favoritos ❤️ ({favoritesCount})</h1>
          {favoritesCount >= 2 && (
            <Button variant="primary" onClick={handleCompareTwo}>
              ⚖️ Comparar 2 favoritos
            </Button>
          )}
        </div>

        <div className="favorites__grid">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={handleToggleFavorite}
              onAddToCompare={handleCompare}
              inCompare={isInCompare(recipe.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
