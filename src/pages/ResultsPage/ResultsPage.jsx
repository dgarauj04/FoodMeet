import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ResultsPage.css';
import { useRecipeSearch, useNameLists, useFilteredRecipes } from '../../hooks/useRecipes';
import { useFavorites } from '../../hooks/useFavorites';
import { useCompare } from '../../hooks/useCompare';
import { SearchBar } from '../../components/ui/SearchBar/SearchBar';
import { FilterChips } from '../../components/ui/FilterChips/FilterChips';
import { RecipeCard } from '../../components/Layout/Recipes/RecipeCard/RecipeCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard/SkeletonCard';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { Button } from '../../components/ui/Button/Button';
import { SEARCH_MODES, API_LIMITS } from '../../utils/constants';
import { getErrorMessage } from '../../services/api/httpClient';

const POPULAR_SUGGESTIONS = ['chicken', 'pasta', 'beef', 'salmon', 'egg'];

export function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(API_LIMITS.MAX_GRID_ITEMS);

  const q = searchParams.get('q') ?? '';
  const mode = searchParams.get('mode') ?? SEARCH_MODES.NAME;
  const selectedCategories = searchParams.get('category') ? [searchParams.get('category')] : [];
  const selectedAreas = searchParams.get('area') ? [searchParams.get('area')] : [];

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const { categories: catNames, areas: areaNames, ingredients: ingredientNames } = useNameLists();

  const { data: searchResults, loading: searchLoading, error: searchError } = useRecipeSearch(q, mode);

  const filterQuery = !q ? { category: selectedCategories[0], area: selectedAreas[0] } : {};
  const { data: filteredResults, loading: filteredLoading, error: filteredError } = useFilteredRecipes(filterQuery);

  let results = [];
  if (q) {
    results = searchResults;
    if (selectedCategories.length > 0) {
      results = results.filter((r) => selectedCategories.includes(r.category));
    }
    if (selectedAreas.length > 0) {
      results = results.filter((r) => selectedAreas.includes(r.area));
    }
  } else {
    results = filteredResults;
  }

  const isLoading = q ? searchLoading : filteredLoading;
  const error = q ? searchError : filteredError;

  function updateParam(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
    setVisibleCount(API_LIMITS.MAX_GRID_ITEMS);
  }

  function handleToggleCategory(cat) {
    const current = selectedCategories[0];
    updateParam('category', current === cat ? '' : cat);
  }

  function handleToggleArea(area) {
    const current = selectedAreas[0];
    updateParam('area', current === area ? '' : area);
  }

  function handleToggleFavorite(recipe) {
    toggleFavorite(recipe);
  }

  function handleCompare(recipe) {
    if (isInCompare(recipe.id)) removeFromCompare(recipe.id);
    else addToCompare(recipe);
  }

  const hasNoQuery = !q;
  const hasNoFilters = selectedCategories.length === 0 && selectedAreas.length === 0;
  const showEmpty = hasNoQuery && hasNoFilters;

  const visible = results.slice(0, visibleCount);
  const hasMore = results.length > visibleCount;

  return (
    <div>
      <div className="results__header">
        <div className="container">
          <h1 className="results__title">Buscar receitas</h1>

          <div className="results__search-wrap">
            <SearchBar
              query={q}
              onQueryChange={(val) => updateParam('q', val)}
              mode={mode}
              onModeChange={(val) => updateParam('mode', val)}
              loading={isLoading}
              suggestions={mode === SEARCH_MODES.INGREDIENT ? ingredientNames : []}
            />
          </div>

          <div className="results__filters">
            {catNames.length > 0 && (
              <FilterChips
                label="Categoria"
                options={catNames}
                selected={selectedCategories}
                onToggle={handleToggleCategory}
              />
            )}
            {areaNames.length > 0 && (
              <FilterChips
                label="Origem"
                options={areaNames}
                selected={selectedAreas}
                onToggle={handleToggleArea}
              />
            )}
          </div>
        </div>
      </div>

      <div className="results__body">
        <div className="container">
          {showEmpty && (
            <EmptyState
              emoji="🥕"
              title="O que você quer cozinhar hoje?"
              message="Digite o nome de um prato ou ingrediente e descubra receitas incríveis!"
            >
              <div className="results__popular-chips">
                {POPULAR_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="results__popular-chip"
                    onClick={() => {
                      setSearchParams({ q: s, mode: SEARCH_MODES.INGREDIENT });
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </EmptyState>
          )}

          {!showEmpty && error && (
            <div className="results__error">
              <p className="results__error-message">{getErrorMessage(error)}</p>
              <Button variant="primary" onClick={() => updateParam('q', q)}>
                Tentar de novo
              </Button>
            </div>
          )}

          {!showEmpty && isLoading && (
            <div className="results__grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!showEmpty && !isLoading && !error && (
            <>
              {results.length > 0 && (
                <p className="results__count">
                  <strong>{results.length}</strong>{' '}
                  {results.length === 1 ? 'receita encontrada' : 'receitas encontradas'}
                </p>
              )}

              {results.length === 0 ? (
                <EmptyState
                  emoji="🍳"
                  title="Nada encontrado por aqui..."
                  message={`Não encontramos resultados para "${q || selectedCategories[0] || selectedAreas[0]}". Experimente: chicken, pasta, beef`}
                />
              ) : (
                <>
                  <div className="results__grid">
                    {visible.map((recipe) => (
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

                  {hasMore && (
                    <div className="results__load-more">
                      <Button
                        variant="ghost"
                        onClick={() => setVisibleCount((c) => c + API_LIMITS.MAX_GRID_ITEMS)}
                      >
                        Carregar mais ⬇️
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
