export const INGREDIENT_EMOJIS = {
  // Proteínas
  chicken: "🍗",
  "chicken breast": "🍗",
  beef: "🥩",
  "ground beef": "🥩",
  pork: "🥓",
  bacon: "🥓",
  fish: "🐟",
  salmon: "🐟",
  tuna: "🐟",
  shrimp: "🦐",
  egg: "🥚", // cobre "egg" e "eggs"
  eggs: "🥚",
  tofu: "🧈",

  // Vegetais
  tomato: "🍅",
  tomatoes: "🍅",
  onion: "🧅",
  onions: "🧅",
  garlic: "🧄",
  potato: "🥔",
  potatoes: "🥔",
  carrot: "🥕",
  carrots: "🥕",
  broccoli: "🥦",
  lettuce: "🥬",
  spinach: "🥬",
  cabbage: "🥬",
  pepper: "🌶️",
  chili: "🌶️",
  corn: "🌽",
  mushroom: "🍄",
  mushrooms: "🍄",
  avocado: "🥑",
  cucumber: "🥒",

  // Frutas
  lemon: "🍋",
  lime: "🍋",
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  strawberry: "🍓",
  strawberries: "🍓",
  coconut: "🥥",

  // Grãos e massas
  rice: "🍚",
  pasta: "🍝",
  spaghetti: "🍝",
  noodle: "🍜",
  bread: "🍞",
  flour: "🌾",
  oats: "🌾",

  // Laticínios
  milk: "🥛",
  cheese: "🧀",
  butter: "🧈",
  cream: "🥛",
  yogurt: "🥛",

  // Temperos e condimentos
  salt: "🧂",
  sugar: "🍬",
  honey: "🍯",
  oil: "🫒",
  "olive oil": "🫒",
  olive: "🫒",
  vinegar: "🍶",
  curry: "🍛",

  // Bebidas/outros
  wine: "🍷",
  coffee: "☕",
  tea: "🍵",
  beer: "🍺",
  water: "💧",
  chocolate: "🍫",
};

const DEFAULT_EMOJI = '🍽️';

/**
 * Retorna o emoji correspondente a um ingrediente.
 * Faz a busca de forma case-insensitive e tenta variações simples
 * (singular/plural, remoção de "fresh", "chopped", etc.) antes de desistir.
 *
 * @param {string} ingredientName - nome do ingrediente (ex: "Chicken Breast")
 * @returns {string} emoji correspondente, ou o emoji padrão se não encontrado
 */
export function getIngredientEmoji(ingredientName) {
  if (!ingredientName || typeof ingredientName !== 'string') {
    return DEFAULT_EMOJI;
  }

  const normalized = ingredientName.trim().toLowerCase();

  if (INGREDIENT_EMOJIS[normalized]) {
    return INGREDIENT_EMOJIS[normalized];
  }
  const qualifiers = ['fresh', 'chopped', 'diced', 'ground', 'sliced', 'minced', 'dried'];
  const withoutQualifiers = qualifiers
    .reduce((acc, word) => acc.replace(new RegExp(`\\b${word}\\b`, 'g'), ''), normalized)
    .trim()
    .replace(/\s+/g, ' ');

  if (INGREDIENT_EMOJIS[withoutQualifiers]) {
    return INGREDIENT_EMOJIS[withoutQualifiers];
  }

  const foundKey = Object.keys(INGREDIENT_EMOJIS).find((key) =>
    withoutQualifiers.includes(key)
  );

  return foundKey ? INGREDIENT_EMOJIS[foundKey] : DEFAULT_EMOJI;
}