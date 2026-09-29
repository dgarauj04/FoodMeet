export const ROUTES = Object.freeze({
  HOME: "/",
  RESULTS: "/results",
  RECIPE_DETAIL: "/recipe/:id",
  FAVORITES: "/favorites",
  COMPARE: "/compare",
  FRIDGE: "/fridge",
  NOT_FOUND: "*",
});

export function recipePath(id) {
  return `/recipe/${id}`;
}

export const SEARCH_MODES = Object.freeze({
  NAME: "name",
  INGREDIENT: "ingredient",
});

export const API_LIMITS = Object.freeze({
  REQUEST_TIMEOUT_MS: 8000, // client.js: aborta fetch travado
  SEARCH_DEBOUNCE_MS: 400, // hooks: antecipa digitação na busca
  MAX_COMPARE_ITEMS: 2, // Context: bandeja de comparação (duelo 1x1)
  MAX_INGREDIENT_SLOTS: 20, // mapper: strIngredient1..20
  AUTOCOMPLETE_LIMIT: 50, // dropdown de ingredientes
  MAX_GRID_ITEMS: 24, // "carregar mais" do grid inicial
});

export const STORAGE_KEYS = Object.freeze({
  FAVORITES: "foodmeet:favorites",
  COMPARE: "foodmeet:compare",
  FRIDGE: "foodmeet:fridge",
  THEME: "foodmeet:theme",
});

export const THEMES = Object.freeze({ LIGHT: "light", DARK: "dark" });

export const DEFAULT_CATEGORIES = Object.freeze([
  { id: "beef",      name: "Carne Bovina",  nameEn: "Beef",      image: null, emoji: "🥩" },
  { id: "chicken",   name: "Frango",        nameEn: "Chicken",   image: null, emoji: "🍗" },
  { id: "dessert",   name: "Sobremesa",     nameEn: "Dessert",   image: null, emoji: "🍰" },
  { id: "pasta",     name: "Massas",        nameEn: "Pasta",     image: null, emoji: "🍝" },
  { id: "seafood",   name: "Frutos do Mar", nameEn: "Seafood",   image: null, emoji: "🐟" },
  { id: "vegan",     name: "Vegana",        nameEn: "Vegan",     image: null, emoji: "🥗" },
  { id: "breakfast", name: "Café da Manhã", nameEn: "Breakfast", image: null, emoji: "🍳" },
]);