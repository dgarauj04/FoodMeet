// src/components/Layout/Header.jsx

import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { FiHome, FiHeart, FiSun, FiMoon, FiGift } from 'react-icons/fi';
import { FaScaleBalanced } from 'react-icons/fa6';
import './Header.css';
import { ROUTES, SEARCH_MODES, THEMES, recipePath } from '../../../utils/constants';
import { useFavorites } from '../../../hooks/useFavorites';
import { useCompare } from '../../../hooks/useCompare';
import { useTheme } from '../../../context/ThemeContext';
import { useNameLists } from '../../../hooks/useRecipes';
import { SearchBar } from '../../ui/SearchBar/SearchBar';
import { getRandomRecipe } from '../../../services/api/mealApi';

export function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { favoritesCount } = useFavorites();
  const { compareCount } = useCompare();
  const { theme, toggleTheme } = useTheme();
  const { ingredients: ingredientNames } = useNameLists();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [mode, setMode] = useState(searchParams.get('mode') ?? SEARCH_MODES.NAME);
  const [surpriseLoading, setSurpriseLoading] = useState(false);

  const isDark = theme === THEMES.DARK;

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setMode(searchParams.get('mode') ?? SEARCH_MODES.NAME);
  }, [searchParams]);

  const getNavClass = ({ isActive }) => `header__nav-link${isActive ? ' active' : ''}`;
  const getMobileClass = ({ isActive }) => `header__mobile-link${isActive ? ' active' : ''}`;

  function handleSearchSubmit(value) {
    const term = (value ?? query).trim();
    if (!term) {
      navigate(ROUTES.RESULTS);
      return;
    }
    const params = new URLSearchParams({ q: term, mode });
    navigate(`${ROUTES.RESULTS}?${params.toString()}`);
  }

  async function handleSurprise() {
    if (surpriseLoading) return;
    setSurpriseLoading(true);
    try {
      const recipe = await getRandomRecipe();
      if (recipe?.id) {
        navigate(recipePath(recipe.id));
      }
    } catch {
      // silencioso: o usuário pode tentar de novo
    } finally {
      setSurpriseLoading(false);
    }
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <NavLink to={ROUTES.HOME} className="header__logo">
          FoodMeet 🍳
        </NavLink>

        <nav className="header__nav" aria-label="Navegação principal">
          <NavLink to={ROUTES.HOME} className={getNavClass} end>
            <FiHome size={16} />
            Início
          </NavLink>
          <NavLink to={ROUTES.FAVORITES} className={getNavClass}>
            <FiHeart size={16} />
            Favoritos
            {favoritesCount > 0 && (
              <span className="header__nav-badge">{favoritesCount}</span>
            )}
          </NavLink>
          <NavLink to={ROUTES.COMPARE} className={getNavClass}>
            <FaScaleBalanced size={16} />
            Comparar
            {compareCount > 0 && (
              <span className="header__nav-badge">{compareCount}</span>
            )}
          </NavLink>
        </nav>

        <div className="header__search">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            mode={mode}
            onModeChange={setMode}
            onSubmit={handleSearchSubmit}
            suggestions={mode === SEARCH_MODES.INGREDIENT ? ingredientNames : []}
            placeholder={
              mode === SEARCH_MODES.INGREDIENT
                ? 'Buscar por ingrediente...'
                : 'Buscar frango cremoso...'
            }
          />
        </div>

        <div className="header__actions">
          <button
            type="button"
            className="header__surprise-btn"
            onClick={handleSurprise}
            disabled={surpriseLoading}
            aria-label="Surpreenda-me com uma receita aleatória"
          >
            <FiGift size={16} />
            <span className="header__surprise-label">
              {surpriseLoading ? 'Buscando...' : 'Surpreenda-me'}
            </span>
          </button>

          <button
            type="button"
            className="header__theme-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </div>

      <nav className="header__nav--mobile" aria-label="Navegação mobile">
        <NavLink to={ROUTES.HOME} className={getMobileClass} end>
          <FiHome size={20} />
          Início
        </NavLink>
        <NavLink to={ROUTES.FAVORITES} className={getMobileClass}>
          <FiHeart size={20} />
          Favoritos
          {favoritesCount > 0 && (
            <span className="header__mobile-badge">{favoritesCount}</span>
          )}
        </NavLink>
        <NavLink to={ROUTES.COMPARE} className={getMobileClass}>
          <FaScaleBalanced size={20} />
          Comparar
          {compareCount > 0 && (
            <span className="header__mobile-badge">{compareCount}</span>
          )}
        </NavLink>
      </nav>
    </header>
  );
}
