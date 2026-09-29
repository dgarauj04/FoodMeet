import './CompareColumn.css';
import { Badge } from '../Badge/Badge';
import { formatIngredient, getIngredientEmoji, normalizeIngredientName } from '../../../utils/recipeUtils';

export function CompareColumn({ recipe, commonKeys, badge }) {
  if (!recipe) return null;

  return (
    <div className="compare-column">
      <div className="compare-column__header">
        <div className="compare-column__image-wrapper">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={`Foto de ${recipe.name}`}
              className="compare-column__image"
              loading="lazy"
            />
          ) : (
            <div className="compare-column__image-placeholder" aria-hidden="true">🍽️</div>
          )}
        </div>

        <div className="compare-column__badge-row">
          {badge && <span className="compare-column__badge-label">{badge}</span>}
        </div>

        <h2 className="compare-column__title">{recipe.name}</h2>

        <div className="compare-column__meta">
          {recipe.category && <Badge emoji="🏷️" label={recipe.category} />}
          {recipe.area && <Badge emoji="🌎" label={recipe.area} />}
        </div>

        <p className="compare-column__ingredient-count">
          {recipe.ingredients?.length ?? 0} ingredientes
        </p>
      </div>

      <div className="compare-column__ingredients">
        <p className="compare-column__ingredients-title">Ingredientes</p>
        <ul className="compare-column__ingredient-list">
            {(recipe.ingredients ?? []).map((ing, i) => {
            const key = normalizeIngredientName(ing.nameEn ?? ing.name); // ← mesmo contrato
            const isCommon = commonKeys.has(key);
            return (
              <li
                key={`${ing.name}-${i}`}
                className={`compare-column__ingredient-item${isCommon ? ' compare-column__ingredient-item--common' : ''}`}
              >
                <span className="compare-column__ingredient-emoji" aria-hidden="true">
                  {getIngredientEmoji(ing.nameEn ?? ing.name)} {/* ← emoji em EN (mapa EN) */}
                </span>
                <span className="compare-column__ingredient-text">
                  {formatIngredient(ing)} {/* exibe pt + medida pt — correto, não mexa */}
                </span>
                {isCommon && (
                  <span className="compare-column__common-icon" aria-label="Em comum">✅</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {recipe.steps && recipe.steps.length > 0 && (
        <div className="compare-column__steps">
          <details>
            <summary className="compare-column__steps-summary">
              📖 Ver modo de preparo ({recipe.steps.length} passos)
            </summary>
            <ol className="compare-column__steps-list">
              {recipe.steps.map((step, i) => (
                <li key={i} className="compare-column__step">
                  <span className="compare-column__step-number">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </details>
        </div>
      )}
    </div>
  );
}
