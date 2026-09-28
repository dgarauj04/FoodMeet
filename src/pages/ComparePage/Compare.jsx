// src/pages/ComparePage/Compare.jsx

import { useNavigate } from 'react-router-dom';
import './Compare.css';
import { useCompare } from '../../hooks/useCompare';
import { useRecipePair } from '../../hooks/useRecipes';
import { CompareColumn } from '../../components/ui/CompareColumn/CompareColumn';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { Button } from '../../components/ui/Button/Button';
import { compareRecipes } from '../../utils/compareUtils';
import { normalizeIngredientName } from '../../utils/recipeUtils';
import { getErrorMessage } from '../../services/api/httpClient';
import { ROUTES } from '../../utils/constants';

export function Compare() {
  const navigate = useNavigate();
  const { compareList, clearCompare, removeFromCompare } = useCompare();
  
  const ids = compareList.length >= 2 ? [compareList[0].id, compareList[1].id] : [];
  const { recipes, loading, error } = useRecipePair(ids);

  // ── Menos de 2 receitas ──
  if (compareList.length < 2) {
    return (
      <div className="compare">
        <div className="container">
          <EmptyState
            emoji="⚖️"
            title="Selecione 2 receitas para o duelo!"
            message="Adicione 2 receitas à comparação clicando no ícone de balança nos cards. Então prepare-se para o duelo! 🥊"
            actionLabel="Explorar receitas"
            onAction={() => navigate(ROUTES.HOME)}
          />
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="compare">
        <div className="container">
          <div className="compare__layout">
            {[0, 1].map((i) => (
              <div key={i} className="compare__skeleton-col">
                <div className="compare__skeleton-img skeleton" />
                <div className="compare__skeleton-body">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className="compare__skeleton-line skeleton"
                      style={{ width: `${90 - j * 10}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="compare">
        <div className="container">
          <div className="compare__error">
            <p className="compare__error-message">{getErrorMessage(error)}</p>
            <Button variant="primary" onClick={() => clearCompare()}>Limpar e tentar de novo</Button>
          </div>
        </div>
      </div>
    );
  }

  const [recipeA, recipeB] = recipes;
  if (!recipeA || !recipeB) return null;

  const { common, stats } = compareRecipes(recipeA, recipeB);
  const commonKeys = new Set(common.map((i) => normalizeIngredientName(i.name)));

  return (
    <div className="compare">
      <div className="container">
        <div className="compare__header">
          <h1 className="compare__title">⚖️ Duelo de Receitas</h1>
        </div>

        {/* Stats banner */}
        <div className="compare__stats-banner">
          <span>📊 <strong>{stats.commonCount}</strong> ingredientes em comum</span>
          <span>🅰️ <strong>{stats.totalA}</strong> ingredientes</span>
          <span>🅱️ <strong>{stats.totalB}</strong> ingredientes</span>
          <Button variant="ghost" size="md" onClick={clearCompare}>
            Limpar comparação
          </Button>
        </div>

        {/* Colunas */}
        <div className="compare__layout">
          <CompareColumn recipe={recipeA} commonKeys={commonKeys} badge="Receita A" />

          <div className="compare__vs-divider">
            <div className="compare__vs-badge" aria-hidden="true">VS</div>
          </div>

          <CompareColumn recipe={recipeB} commonKeys={commonKeys} badge="Receita B" />
        </div>
      </div>
    </div>
  );
}
