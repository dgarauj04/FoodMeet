import { normalizeIngredientName } from "./recipeUtils";

function getComparableIngredients(recipe) {
  const seen = new Set();
  const result = [];

  for (const ingredient of recipe?.ingredients ?? []) {
    const key = normalizeIngredientName(ingredient.name);
    if (!key || seen.has(key)) continue; // ignora vazio e duplicado
    seen.add(key);
    result.push({ key, name: ingredient.name, measure: ingredient.measure });
  }

  return result;
}

/**
 * Compara duas receitas e classifica os ingredientes em 3 grupos.
 *
 * @param {Recipe} recipeA
 * @param {Recipe} recipeB
 * @returns {{
 *   common: { key, name, measure }[],   // nas duas → UI pinta de verde com ✅
 *   onlyInA: { key, name, measure }[],  // exclusivos da receita A
 *   onlyInB: { key, name, measure }[],  // exclusivos da receita B
 *   stats: { totalA, totalB, commonCount }
 * }}
 */
export function compareRecipes(recipeA, recipeB) {
  const listA = getComparableIngredients(recipeA);
  const listB = getComparableIngredients(recipeB);

  const setB = new Set(listB.map((i) => i.key));
  const setA = new Set(listA.map((i) => i.key));

  const common = [];
  const onlyInA = [];

  for (const ingredient of listA) {
    if (setB.has(ingredient.key)) common.push(ingredient);
    else onlyInA.push(ingredient);
  }

  const onlyInB = listB.filter((i) => !setA.has(i.key));

  return {
    common,
    onlyInA,
    onlyInB,
    stats: {
      totalA: listA.length,
      totalB: listB.length,
      commonCount: common.length,
    },
  };
}

export const getCommonIngredients = (recipeA, recipeB) =>
  compareRecipes(recipeA, recipeB).common;

export const getUniqueIngredients = (recipeA, recipeB) => {
  const { onlyInA, onlyInB } = compareRecipes(recipeA, recipeB);
  return { a: onlyInA, b: onlyInB };
};

/**
 * Calcula o "match" de uma receita com a lista do que o usuário tem em casa.
 *
 * @param {Recipe} recipe              Receita COMPLETA (com ingredients[])
 * @param {string[]} availableNames    Ex.: ["eggs", "chicken", "creme de leite"]
 * @returns {{
 *   matched: {key, name, measure}[],  // você TEM
 *   missing: {key, name, measure}[],  // falta (UI: vermelho)
 *   matchedCount: number,
 *   totalCount: number,
 *   percentage: number                // 0-100, alimenta a MatchScoreBar
 * }}
 *
 * @example
 * getFridgeMatch(recipe, ["eggs", "flour"])
 * // -> { matchedCount: 2, totalCount: 8, percentage: 25, ... }
 */
export function getFridgeMatch(recipe, availableNames = []) {
  const available = new Set(
    availableNames.map(normalizeIngredientName).filter(Boolean)
  );

  const ingredients = getComparableIngredients(recipe);

  const matched = [];
  const missing = [];

  for (const ingredient of ingredients) {
    (available.has(ingredient.key) ? matched : missing).push(ingredient);
  }

  const totalCount = ingredients.length;
  const ratio = totalCount === 0 ? 0 : matched.length / totalCount;

  return {
    matched,
    missing,
    matchedCount: matched.length,
    totalCount,
    percentage: Math.round(ratio * 100),
  };
}

/**
 * Rankeia receitas pela compatibilidade com a geladeira.
 * Desempate: mais ingredientes casados → receita mais simples (menos total).
 *
 * @param {Recipe[]} recipes        Receitas COMPLETAS (enriquecidas via lookup)
 * @param {string[]} availableNames
 * @returns {{ recipe: Recipe, score: ReturnType<getFridgeMatch> }[]} ordenado desc.
 */
export function sortRecipesByFridgeMatch(recipes = [], availableNames = []) {
  return recipes
    .map((recipe) => ({ recipe, score: getFridgeMatch(recipe, availableNames) }))
    .sort(
      (x, y) =>
        y.score.percentage - x.score.percentage ||
        y.score.matchedCount - x.score.matchedCount ||
        x.score.totalCount - y.score.totalCount
    );
}