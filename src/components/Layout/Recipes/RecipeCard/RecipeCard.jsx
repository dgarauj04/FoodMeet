// src/components/Layout/Recipes/RecipeCard/RecipeCard.jsx

import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaScaleBalanced } from 'react-icons/fa6';
import './RecipeCard.css';
import { Badge } from '../../../ui/Badge/Badge';
import { recipePath } from '../../../../utils/constants';

export function RecipeCard({ recipe, isFavorite, onToggleFavorite, onAddToCompare, inCompare }) {
  const detailPath = recipePath(recipe.id);

  return (
    <article className="recipe-card">
      {/* Imagem */}
      <div className="recipe-card__image-wrapper">
        <Link to={detailPath} className="recipe-card__image-link" tabIndex={-1}>
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={`Foto de ${recipe.name}`}
              className="recipe-card__image"
              loading="lazy"
            />
          ) : (
            <div className="recipe-card__placeholder" aria-hidden="true">🍽️</div>
          )}
        </Link>

        {/* Favoritar */}
        <button
          type="button"
          className={`recipe-card__favorite-btn${isFavorite ? ' recipe-card__favorite-btn--active' : ''}`}
          onClick={() => onToggleFavorite(recipe)}
          aria-label={isFavorite ? `Remover ${recipe.name} dos favoritos` : `Favoritar ${recipe.name}`}
        >
          <FiHeart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Comparar */}
        <button
          type="button"
          className={`recipe-card__compare-btn${inCompare ? ' recipe-card__compare-btn--active' : ''}`}
          onClick={() => onAddToCompare(recipe)}
          aria-label={inCompare ? `Remover ${recipe.name} da comparação` : `Adicionar ${recipe.name} à comparação`}
          title={inCompare ? 'Na comparação — clique para remover' : 'Adicionar à comparação'}
        >
          <FaScaleBalanced size={14} />
        </button>
      </div>

      {/* Corpo */}
      <div className="recipe-card__body">
        <Link to={detailPath} className="recipe-card__title-link">
          <h3 className="recipe-card__title">{recipe.name}</h3>
        </Link>

        <div className="recipe-card__badges">
          {recipe.category && <Badge emoji="🏷️" label={recipe.category} />}
          {recipe.area && <Badge emoji="🌎" label={recipe.area} />}
        </div>

        {recipe.ingredientCount !== null && recipe.ingredientCount !== undefined && (
          <span className="recipe-card__ingredient-count">
            {recipe.ingredientCount} ingredientes
          </span>
        )}
      </div>
    </article>
  );
}
