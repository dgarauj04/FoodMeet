import { request } from "./httpClient";
import { toRecipe, toRecipeSummary, toCategory, toNameList } from "./recipeMapper";

const AREA_VALIDATION_CONCURRENCY = 600;

function toRecipeSummaryList(payload) {
  const meals = Array.isArray(payload?.meals) ? payload.meals : [];
  return meals.map(toRecipeSummary).filter(Boolean);
}

function toSingleRecipe(payload) {
  const meal = payload?.meals?.[0];
  return meal ? toRecipe(meal) : null;
}

/**
 * Busca por nome do prato. GET /search.php?s={query}
 * @param {string} query
 * @returns {Promise<RecipeSummary[]>} Array vazio se nada for encontrado.
 */
export async function searchByName(query) {
  const data = await request("search.php", { s: query });
  return toRecipeSummaryList(data);
}

/**
 * Busca por primeira letra. GET /search.php?f={letter}
 * Útil para navegação alfabética A-Z.
 */
export async function searchByFirstLetter(letter) {
  const data = await request("search.php", { f: letter });
  return toRecipeSummaryList(data);
}

/**
 * Busca por ingrediente. GET /filter.php?i={ingredient}
 * IMPORTANTE: a API exige ingredientes multi-palavra com UNDERSCORE
 * ("chicken breast" -> "chicken_breast"). Normalizamos aqui para que o
 * restante do app possa trabalhar com espaços normais.
 * @param {string} ingredient Ex.: "chicken breast"
 * @returns {Promise<RecipeSummary[]>}
 */
export async function filterByIngredient(ingredient) {
  const term = String(ingredient || "").trim().replace(/\s+/g, "_");
  if (!term) return []; 

  const data = await request("filter.php", { i: term });
  return toRecipeSummaryList(data);
}

/** Filtro por categoria. GET /filter.php?c={category} Ex.: "Seafood" */
export async function filterByCategory(category) {
  const data = await request("filter.php", { c: category });
  return toRecipeSummaryList(data);
}

/** Filtro por origem/país. GET /filter.php?a={area} Ex.: "Italian" */
export async function filterByArea(area) {
  const data = await request("filter.php", { a: area }, { useCache: true });
  return toRecipeSummaryList(data);
}

/**
 * Detalhe completo de uma receita. GET /lookup.php?i={id}
 * @returns {Promise<Recipe|null>} null = id inexistente (a UI mostra "não encontrada").
 */
export async function getRecipeById(id) {
  const data = await request("lookup.php", { i: id });
  return toSingleRecipe(data);
}

/**
 * Receita aleatória. GET /random.php
 * Usada pelo botão "🎲 Surpreenda-me" e pelo destaque da Home.
 */
export async function getRandomRecipe() {
  const data = await request("random.php");
  return toSingleRecipe(data);
}

/**
 * Categorias COM thumbnail e descrição. GET /categories.php
 * Usada na Home (cards visuais de categoria).
 * @returns {Promise<{ id, name, image, description }[]>}
 */
export async function getCategories() {
  const data = await request("categories.php", {}, { useCache: true });
  const list = Array.isArray(data?.categories) ? data.categories : [];
  return list.map(toCategory).filter(Boolean);
}

/** Nomes de categorias. GET /list.php?c=list (popula o filtro) */
export async function listCategoryNames() {
  const data = await request("list.php", { c: "list" }, { useCache: true });
  return toNameList(data, "strCategory");
}

/** Nomes de países/origens. GET /list.php?a=list (popula o filtro) */
export async function listAreaNames() {
  const data = await request("list.php", { a: "list" }, { useCache: true });
  const areas = toNameList(data, "strArea");
  const availableValues = new Set();
  let nextIndex = 0;

  async function validateNextArea() {
    while (nextIndex < areas.length) {
      const area = areas[nextIndex++];
      try {
        const recipes = await filterByArea(area.value);
        if (recipes.length > 0) availableValues.add(area.value);
      } catch {
        // Origins that cannot be loaded are not offered as selectable filters.
      }
    }
  }

  const workerCount = Math.min(AREA_VALIDATION_CONCURRENCY, areas.length);
  await Promise.all(Array.from({ length: workerCount }, validateNextArea));

  return areas.filter((area) => availableValues.has(area.value));
}

/**
 * Nomes de TODOS os ingredientes. GET /list.php?i=list
 */
export async function listIngredientNames() {
  const data = await request("list.php", { i: "list" }, { useCache: true });
  return toNameList(data, "strIngredient");
}
