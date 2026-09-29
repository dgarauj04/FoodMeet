import { useState, useEffect, useRef } from 'react';
import {
  searchByName,
  filterByIngredient,
  filterByCategory,
  getRecipeById,
  getRandomRecipe,
  getCategories,
  listCategoryNames,
  listAreaNames,
  listIngredientNames,
} from '../services/api/mealApi';
import { useDebounce } from './useDebounce';
import { SEARCH_MODES, API_LIMITS, DEFAULT_CATEGORIES } from '../utils/constants';
import { toEnglishIngredient } from '../data/translations'

/**
 * Busca receitas por nome ou ingrediente com debounce.
 * @param {string} query - Texto da busca
 * @param {string} mode - SEARCH_MODES.NAME | SEARCH_MODES.INGREDIENT
 * @returns {{ data: RecipeSummary[], loading: boolean, error: string|null }}
 */

export function useRecipeSearch(query, mode = SEARCH_MODES.NAME) {
  const debouncedQuery = useDebounce(query, API_LIMITS.SEARCH_DEBOUNCE_MS);
  const [state, setState] = useState({ data: [], loading: false, error: null });

  useEffect(() => {
    const raw = debouncedQuery?.trim();
    if (!raw) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ data: [], loading: true, error: null });

    const term =
      mode === SEARCH_MODES.INGREDIENT
        ? toEnglishIngredient(raw) || raw
        : raw;

    const fetcher =
      mode === SEARCH_MODES.INGREDIENT ? filterByIngredient : searchByName;

    fetcher(term)
      .then((data) => {
        if (!cancelled) setState({ data: data ?? [], loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: [], loading: false, error: err?.message ?? 'Erro ao buscar receitas.' });
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, mode]);

  return state;
}

/**
 * Carrega o detalhe completo de uma receita por ID.
 * @param {string|number} id
 * @returns {{ data: Recipe|null, loading: boolean, error: string|null }}
 */
export function useRecipeDetail(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    getRecipeById(id)
      .then((data) => {
        if (!cancelled) setState({ data: data ?? null, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err?.message ?? 'Erro ao carregar receita.' });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

/**
 * Carrega uma receita aleatória uma vez no mount.
 * @returns {{ data: Recipe|null, loading: boolean, error: string|null, refresh: Function }}
 */
export function useRandomRecipe() {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    getRandomRecipe()
      .then((data) => {
        if (!cancelled) setState({ data: data ?? null, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err?.message ?? 'Erro ao carregar receita.' });
      });

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const refresh = () => setTrigger((t) => t + 1);

  return { ...state, refresh };
}

/**
 * Carrega as categorias. Usa DEFAULT_CATEGORIES como fallback.
 * @returns {{ data: Category[], loading: boolean, error: string|null, usedFallback: boolean }}
 */
export function useCategories() {
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
    usedFallback: false,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: [], loading: true, error: null, usedFallback: false });

    getCategories()
      .then((data) => {
        if (!cancelled) {
          if (data && data.length > 0) {
            setState({ data, loading: false, error: null, usedFallback: false });
          } else {
            setState({
              data: DEFAULT_CATEGORIES,
              loading: false,
              error: null,
              usedFallback: true,
            });
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: DEFAULT_CATEGORIES,
            loading: false,
            error: err?.message ?? null,
            usedFallback: true,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Carrega listas de nomes (categorias, áreas, ingredientes) em paralelo.
 * @returns {{ categories: string[], areas: string[], ingredients: string[], loading: boolean }}
 */
export function useNameLists() {
  const [state, setState] = useState({
    categories: [],
    areas: [],
    ingredients: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([listCategoryNames(), listAreaNames(), listIngredientNames()]).then(
      ([catResult, areaResult, ingResult]) => {
        if (!cancelled) {
          setState({
            categories: catResult.status === 'fulfilled' ? catResult.value : [],
            areas: areaResult.status === 'fulfilled' ? areaResult.value : [],
            ingredients: ingResult.status === 'fulfilled' ? ingResult.value : [],
            loading: false,
          });
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Carrega receitas em destaque de múltiplas categorias, dedupe e limita a 12.
 * @returns {{ data: RecipeSummary[], loading: boolean, error: string|null }}
 */
export function useFeaturedRecipes() {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: [], loading: true, error: null });

    Promise.allSettled([
      filterByCategory('Dessert'),
      filterByCategory('Seafood'),
      filterByCategory('Chicken'),
    ]).then((results) => {
      if (cancelled) return;

      const [dessert, seafood, chicken] = results.map((r) =>
        r.status === 'fulfilled' ? r.value : []
      );

      const interleaved = [];
      for (let i = 0; i < 4; i++) {
        if (dessert[i]) interleaved.push(dessert[i]);
        if (seafood[i]) interleaved.push(seafood[i]);
        if (chicken[i]) interleaved.push(chicken[i]);
      }

      const seen = new Set();
      const deduped = interleaved.filter((r) => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });

      setState({ data: deduped.slice(0, 12), loading: false, error: null });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Busca receitas por categoria ou área (sem query de texto).
 * @param {{ category?: string, area?: string }} filters
 * @returns {{ data: RecipeSummary[], loading: boolean, error: string|null }}
 */
export function useFilteredRecipes(filters) {
  const { category, area } = filters || {};
  const [state, setState] = useState({ data: [], loading: false, error: null });

  useEffect(() => {
    if (!category && !area) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ data: [], loading: true, error: null });

    const promises = [];
    if (category && area) {
      promises.push(filterByCategory(category));
      promises.push(
        import('../services/api/mealApi').then((m) => m.filterByArea(area))
      );
    } else if (category) {
      promises.push(filterByCategory(category));
    } else if (area) {
      promises.push(
        import('../services/api/mealApi').then((m) => m.filterByArea(area))
      );
    }

    Promise.allSettled(promises).then((results) => {
      if (cancelled) return;

      if (category && area && results.length === 2) {
        if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
          const setArea = new Set(results[1].value.map((r) => r.id));
          const intersection = results[0].value.filter((r) => setArea.has(r.id));
          setState({ data: intersection, loading: false, error: null });
          return;
        }
      }

      const all = results
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value);

      const seen = new Set();
      const deduped = all.filter((r) => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });

      setState({ data: deduped, loading: false, error: null });
    });

    return () => {
      cancelled = true;
    };
  }, [category, area]);

  return state;
}

/**
 * Carrega um par de receitas completas por ID.
 * @param {string[]} ids - Array com exatamente 2 IDs
 * @returns {{ recipes: [Recipe|null, Recipe|null], loading: boolean, error: string|null }}
 */
export function useRecipePair(ids) {
  const key = (ids ?? []).join(',');
  const [state, setState] = useState({ recipes: [null, null], loading: false, error: null });

  useEffect(() => {
    if (!ids || ids.length < 2) {
      setState({ recipes: [null, null], loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ recipes: [null, null], loading: true, error: null });

    Promise.all([getRecipeById(ids[0]), getRecipeById(ids[1])])
      .then(([a, b]) => {
        if (!cancelled) setState({ recipes: [a, b], loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            recipes: [null, null],
            loading: false,
            error: err?.message ?? 'Erro ao carregar receitas.',
          });
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return state;
}