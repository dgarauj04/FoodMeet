// src/components/Layout/CompareTray.jsx

import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import './CompareTray.css';
import { useCompare } from '../../../hooks/useCompare';
import { ROUTES } from '../../../utils/constants';

export function CompareTray() {
  const { compareList, removeFromCompare, clearCompare, isFull } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  const handleCompare = () => {
    if (isFull) navigate(ROUTES.COMPARE);
  };

  return (
    <div className="compare-tray" role="region" aria-label="Bandeja de comparação">
      <div className="compare-tray__items">
        {compareList.map((recipe) => (
          <div key={recipe.id} className="compare-tray__item">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="compare-tray__thumb"
                loading="lazy"
              />
            ) : (
              <div className="compare-tray__thumb-placeholder" aria-hidden="true">🍽️</div>
            )}
            <button
              type="button"
              className="compare-tray__remove"
              onClick={() => removeFromCompare(recipe.id)}
              aria-label={`Remover ${recipe.name} da comparação`}
            >
              <FiX size={10} />
            </button>
          </div>
        ))}
      </div>

      <div className="compare-tray__actions">
        <button
          type="button"
          className="compare-tray__compare-btn"
          onClick={handleCompare}
          disabled={!isFull}
          aria-disabled={!isFull}
        >
          ⚖️ Comparar ({compareList.length})
        </button>
        <button
          type="button"
          className="compare-tray__clear-btn"
          onClick={clearCompare}
          aria-label="Limpar comparação"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
