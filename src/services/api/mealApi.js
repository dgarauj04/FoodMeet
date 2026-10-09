import { request } from "./httpClient";
import { toRecipe, toRecipeSummary, toCategory, toNameList } from "./recipeMapper";

const KNOWN_ACTIVE_AREAS = new Set([
  "Algerian",
  "Australian",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Egyptian",
  "Filipino",
  "Greek",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Saudi Arabian",
  "Spanish",
  "Syrian",
  "Thai",
  "Tunisian",
  "Turkish",
  "Ukrainian",
  "Uruguayan",
  "Vietnamese",
]);

function toRecipeSummaryList(payload) {
  const meals = Array.isArray(payload?.meals) ? payload.meals : [];
  return meals.map(toRecipeSummary).filter(Boolean);
}

function toSingleRecipe(payload) {
  const meal = payload?.meals?.[0];
  return meal ? toRecipe(meal) : null;
}

export async function searchByName(query) {
  const data = await request("search.php", { s: query });
  return toRecipeSummaryList(data);
}

export async function searchByFirstLetter(letter) {
  const data = await request("search.php", { f: letter });
  return toRecipeSummaryList(data);
}

export async function filterByIngredient(ingredient) {
  const term = String(ingredient || "").trim().replace(/\s+/g, "_");
  if (!term) return []; 

  const data = await request("filter.php", { i: term });
  return toRecipeSummaryList(data);
}

export async function filterByCategory(category) {
  const data = await request("filter.php", { c: category });
  return toRecipeSummaryList(data);
}

export async function filterByArea(area) {
  const data = await request("filter.php", { a: area }, { useCache: true });
  return toRecipeSummaryList(data);
}

export async function getRecipeById(id) {
  const data = await request("lookup.php", { i: id });
  return toSingleRecipe(data);
}

export async function getRandomRecipe() {
  const data = await request("random.php");
  return toSingleRecipe(data);
}

export async function getCategories() {
  const data = await request("categories.php", {}, { useCache: true });
  const list = Array.isArray(data?.categories) ? data.categories : [];
  return list.map(toCategory).filter(Boolean);
}

export async function listCategoryNames() {
  const data = await request("list.php", { c: "list" }, { useCache: true });
  return toNameList(data, "strCategory");
}

export async function listAreaNames() {
  const data = await request("list.php", { a: "list" }, { useCache: true });
  const areas = toNameList(data, "strArea");
  const filtered = areas.filter((area) => KNOWN_ACTIVE_AREAS.has(area.value));
  return filtered.length > 0 ? filtered : areas;
}

export async function listIngredientNames() {
  const data = await request("list.php", { i: "list" }, { useCache: true });
  return toNameList(data, "strIngredient");
}
