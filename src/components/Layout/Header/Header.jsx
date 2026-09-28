import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { FiSun, FiMoon, FiGift, FiMenu } from 'react-icons/fi';
import './Header.css';
import { ROUTES, SEARCH_MODES, THEMES, recipePath } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { useNameLists } from '../../../hooks/useRecipes';
import { SearchBar } from '../../ui/SearchBar/SearchBar';
import { getRandomRecipe } from '../../../services/api/mealApi';
import logoFoodmeet from '../../../assets/icon-logo-foodmeet.png';

export function Header({ onOpenMenu }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
      console.log('Erro ao buscar receita aleatória');
    } finally {
      setSurpriseLoading(false);
    }
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <button
          type="button"
          className="header__menu-btn"
          onClick={onOpenMenu}
          aria-label="Abrir menu de navegação"
        >
          <FiMenu size={22} />
        </button>

        <NavLink to={ROUTES.HOME} className="header__logo">
          <img src={logoFoodmeet} className="header__logo-img" alt="FoodMeet Logo" />
          FoodMeet
        </NavLink>

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
    </header>
  );
}
