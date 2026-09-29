import { API_LIMITS } from "../../utils/constants";
import { splitSteps, getYoutubeVideoId } from "../../utils/recipeUtils";
import {
  translateCategory,
  translateArea,
  translateIngredientName,
  translateMeasure,
} from "../../data/translations";

export function parseIngredients(meal = {}) {
  const ingredients = [];

  for (let slot = 1; slot <= API_LIMITS.MAX_INGREDIENT_SLOTS; slot++) {
    const rawName = meal[`strIngredient${slot}`];
    const rawMeasure = meal[`strMeasure${slot}`];

    const nameEn = typeof rawName === "string" ? rawName.trim() : "";
    if (!nameEn) continue; 

    const measureEn = typeof rawMeasure === "string" ? rawMeasure.trim() : "";

    ingredients.push({
      name: translateIngredientName(nameEn), 
      nameEn,
      measure: translateMeasure(measureEn),
    });
  }

  return ingredients;
}

function parseTags(rawTags) {
  if (typeof rawTags !== "string") return [];
  return rawTags.split(",").map((t) => t.trim()).filter(Boolean);
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
    category: translateCategory(meal.strCategory), 
    categoryEn: meal.strCategory || null,          
    area: translateArea(meal.strArea),
    areaEn: meal.strArea || null,
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
    category: translateCategory(meal.strCategory),
    categoryEn: meal.strCategory || null,
    area: translateArea(meal.strArea),
    areaEn: meal.strArea || null,
    tags: parseTags(meal.strTags),
    ingredientCount: null, 
  };
}

export function toCategory(raw = {}) {
  if (!raw?.strCategory) return null;

  return {
    id: raw.idCategory ?? raw.strCategory,
    name: translateCategory(raw.strCategory),    
    nameEn: raw.strCategory,                      
    image: raw.strCategoryThumb || null,
    description: (raw.strCategoryDescription || "").trim(),
  };
}


export function toNameList(payload, field) {
  const items = Array.isArray(payload?.meals) ? payload.meals : [];

  const translate = {
    strCategory: translateCategory,
    strArea: translateArea,
    strIngredient: translateIngredientName,
  }[field] ?? ((v) => v);

  return items
    .map((item) => (typeof item?.[field] === "string" ? item[field].trim() : ""))
    .filter(Boolean)
    .map((value) => ({ value, label: translate(value) }));
}