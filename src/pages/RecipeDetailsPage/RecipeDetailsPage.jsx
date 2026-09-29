import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetailsPage.css';
import { useRecipeDetail } from '../../hooks/useRecipes';
import { useFavorites } from '../../hooks/useFavorites';
import { useCompare } from '../../hooks/useCompare';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { getYoutubeEmbedUrl, getIngredientEmoji, formatIngredient } from '../../utils/recipeUtils';
import { getErrorMessage } from '../../services/api/httpClient';
import { ROUTES } from '../../utils/constants';
import { Star, StarOff } from 'lucide-react';

export function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: recipe, loading, error } = useRecipeDetail(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  function toggleIngredient(name) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="recipe-details">
        <div className="container recipe-details__inner">
          <div className="recipe-details__skeleton-img skeleton" />
          <div className="recipe-details__skeleton-title skeleton" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="recipe-details__skeleton-line skeleton" style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-details">
        <div className="container recipe-details__inner">
          <div className="recipe-details__error">
            <p className="recipe-details__error-message">{getErrorMessage(error)}</p>
            <Button variant="primary" onClick={() => navigate(0)}>Tentar de novo</Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Voltar</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && recipe === null) {
    return (
      <div className="recipe-details">
        <div className="container">
          <EmptyState
            emoji="🥴"
            title="Receita não encontrada"
            message="Essa receita saiu do cardápio! Mas temos muitas outras esperando por você."
            actionLabel="Explorar receitas"
            onAction={() => navigate(ROUTES.HOME)}
          />
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const embedUrl = recipe.youtubeUrl ? getYoutubeEmbedUrl(recipe.youtubeUrl) : null;
  const favorited = isFavorite(recipe.id);
  const inCompare = isInCompare(recipe.id);

  function handleFavorite() {
    toggleFavorite({
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      category: recipe.category,
      area: recipe.area,
      tags: recipe.tags,
      ingredientCount: recipe.ingredients?.length ?? null,
    });
  }

  function handleCompare() {
    if (inCompare) removeFromCompare(recipe.id);
    else addToCompare({
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      category: recipe.category,
      area: recipe.area,
      tags: recipe.tags,
      ingredientCount: recipe.ingredients?.length ?? null,
    });
  }

  return (
    <div className="recipe-details">
      <div className="container recipe-details__inner">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={`Foto de ${recipe.name}`}
            className="recipe-details__hero-image"
            loading="lazy"
          />
        ) : (
          <div className="recipe-details__hero-placeholder" aria-hidden="true">🍽️</div>
        )}

        <h1 className="recipe-details__title">{recipe.name}</h1>

        <div className="recipe-details__badges">
          {recipe.category && <Badge emoji="🏷️" label={recipe.category} />}
          {recipe.area && <Badge emoji="🌎" label={recipe.area} />}
          {recipe.tags?.map((tag) => (
            <Badge key={tag} label={`#${tag}`} />
          ))}
        </div>

        <div className="recipe-details__actions">
          <Button
            variant={favorited ? 'ghost' : 'primary'}
            onClick={handleFavorite}
            aria-pressed={favorited}
          >
            {favorited ? (
              <>
                <StarOff size={18} strokeWidth={3} color='gold' />
                Remover dos favoritos
              </>
            ) : (
              <>
                <Star size={18} strokeWidth={3} color='gold' />
                Favoritar
              </>
            )}
          </Button>
          <Button
            variant={inCompare ? 'secondary' : 'ghost'}
            onClick={handleCompare}
            aria-pressed={inCompare}
          >
            {inCompare ? '✓ Na comparação' : '⚖️ Comparar'}
          </Button>
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="recipe-details__section">
            <h2 className="recipe-details__section-title">
              🧺 Ingredientes ({recipe.ingredients.length})
            </h2>
            <div className="recipe-details__ingredients-grid">
              {recipe.ingredients.map((ing, i) => {
                const checked = checkedIngredients.has(ing.name);
                return (
                  <div
                    key={`${ing.name}-${i}`}
                    className={`recipe-details__ingredient-item${checked ? ' recipe-details__ingredient-item--checked' : ''}`}
                    onClick={() => toggleIngredient(ing.name)}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleIngredient(ing.name)}
                  >
                    <span className="recipe-details__ingredient-emoji" aria-hidden="true">
                      {getIngredientEmoji(ing.nameEn ?? ing.name)}
                    </span>
                    <span className="recipe-details__ingredient-text">
                      {formatIngredient(ing)}
                    </span>
                    {checked && <span className="recipe-details__check-icon" aria-hidden="true">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modo de preparo */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="recipe-details__section">
            <h2 className="recipe-details__section-title">
              📖 Modo de preparo
            </h2>
            <ol className="recipe-details__steps-list">
              {recipe.steps.map((step, i) => (
                <li key={i} className="recipe-details__step">
                  <span className="recipe-details__step-number">{i + 1}</span>
                  <span className="recipe-details__step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Vídeo */}
        {embedUrl && (
          <div className="recipe-details__section">
            <h2 className="recipe-details__section-title">🎬 Vídeo da receita</h2>
            <div className="recipe-details__video-wrapper">
              <iframe
                src={embedUrl}
                className="recipe-details__video-iframe"
                title={`Vídeo de preparo de ${recipe.name}`}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Fonte */}
        {recipe.sourceUrl && (
          <p className="recipe-details__source">
            🔗{' '}
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
              Receita original
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
