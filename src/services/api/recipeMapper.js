/**
 * recipeMapper.js — Fronteira de tradução de dados.
 *
 * MODELO CANÔNICO da aplicação (documentação viva):
 *
 * RecipeSummary (cards, grids — vem de search.php e filter.php):
 * { id, name, image, category, area, tags[], ingredientCount: null }
 *
 * Recipe (detalhe completo — vem de lookup.php e random.php):
 * { id, name, image, category, area, tags[],
 *   ingredients: [{ name, measure }],
 *   instructions: string,
 *   steps: string[],          <- derivado de instructions
 *   youtubeUrl: string|null,
 *   videoId: string|null,     <- derivado de youtubeUrl
 *   sourceUrl: string|null }
 */

import { API_LIMITS } from "../../utils/constants";
import { splitSteps, getYoutubeVideoId } from "../../utils/recipeUtils";

/**
 * Converte os 20 pares "strIngredientN"/"strMeasureN" em um array limpo.
 * Slots vazios/null (ex.: strIngredient13) são descartados — a API preenche
 * só os N primeiros e deixa o resto como null ou "".
 *
 * @param {Object} meal Objeto cru da API
 * @returns {{ name: string, measure: string }[]}
 */
export function parseIngredients(meal = {}) {
  const ingredients = [];

  for (let slot = 1; slot <= API_LIMITS.MAX_INGREDIENT_SLOTS; slot++) {
    const rawName = meal[`strIngredient${slot}`];
    const rawMeasure = meal[`strMeasure${slot}`];

    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (!name) continue; // slot vazio = fim da lista real de ingredientes

    const measure = typeof rawMeasure === "string" ? rawMeasure.trim() : "";
    ingredients.push({ name, measure });
  }

  return ingredients;
}

function parseTags(rawTags) {
  if (typeof rawTags !== "string") return [];
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Converte UM meal cru (de lookup/random) no modelo Recipe completo.
 * @returns {Recipe|null} null se o payload for inválido (defensivo).
 */
export function toRecipe(meal = {}) {
  if (!meal || !meal.idMeal) return null;

  const instructions =
    typeof meal.strInstructions === "string" ? meal.strInstructions.trim() : "";

  return {
    id: meal.idMeal,
    name: (meal.strMeal || "").trim() || "Receita sem nome",
    image: meal.strMealThumb || null,
    category: meal.strCategory || null,
    area: meal.strArea || null,
    tags: parseTags(meal.strTags),

    ingredients: parseIngredients(meal),
    instructions,
    steps: splitSteps(instructions),

    youtubeUrl: meal.strYoutube || null,
    videoId: getYoutubeVideoId(meal.strYoutube),
    sourceUrl: meal.strSource || null,
  };
}

export function toRecipeSummary(meal = {}) {
  if (!meal || !meal.idMeal) return null;

  return {
    id: meal.idMeal,
    name: (meal.strMeal || "").trim() || "Receita sem nome",
    image: meal.strMealThumb || null,
    category: meal.strCategory || null,
    area: meal.strArea || null,
    tags: parseTags(meal.strTags),
    ingredientCount: null, // filter.php não devolve ingredientes → o Card omite a contagem
  };
}

/**
 * Converte um item de categories.php (tem id, nome, thumb e descrição).
 * @returns {{ id, name, image, description }|null}
 */
export function toCategory(raw = {}) {
  if (!raw?.strCategory) return null;

  return {
    id: raw.idCategory ?? raw.strCategory,
    name: raw.strCategory,
    image: raw.strCategoryThumb || null,
    description: (raw.strCategoryDescription || "").trim(),
  };
}

/**
 * Normaliza a resposta de list.php, que devolve { meals: [...] } com listas
 * de nomes simples: [{ strCategory }] | [{ strArea }] | [{ strIngredient, ... }].
 *
 * @param {Object} payload JSON cru da resposta
 * @param {string} field   Campo a extrair ("strCategory" | "strArea" | "strIngredient")
 * @returns {string[]} Lista de nomes limpos
 */
export function toNameList(payload, field) {
  const items = Array.isArray(payload?.meals) ? payload.meals : [];

  return items
    .map((item) => (typeof item?.[field] === "string" ? item[field].trim() : ""))
    .filter(Boolean);
}