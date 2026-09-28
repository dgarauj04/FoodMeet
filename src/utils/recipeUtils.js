import { INGREDIENT_EMOJIS } from "../data/ingredientEmojis";

/**
 * Extrai o ID de 11 caracteres de qualquer formato de URL do YouTube.
 * Suporta: watch?v=, youtu.be/, /embed/, /shorts/ — ou um ID puro.
 *
 * @param {string} urlOrId
 * @returns {string|null} ex.: "tA-m5R2v8Hc"
 *
 * @example
 * getYoutubeVideoId("https://www.youtube.com/watch?v=1Is9TQ7HqzE") // "1Is9TQ7HqzE"
 */
export function getYoutubeVideoId(urlOrId) {
  if (!urlOrId) return null;
  const value = String(urlOrId).trim();

  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }

  if (/^[\w-]{11}$/.test(value)) return value;

  return null;
}

/**
 * Monta a URL de EMBED pronta para <iframe>.
 * Usa youtube-nocookie.com: mesmo player, sem rastreamento de cookies extras.
 *
 * @returns {string|null} ex.: "https://www.youtube-nocookie.com/embed/1Is9TQ7HqzE"
 */
export function getYoutubeEmbedUrl(urlOrId) {
  const videoId = getYoutubeVideoId(urlOrId);
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

function cleanStep(raw) {
  return String(raw)
    .replace(/^\s*(?:step\s*)?\d+\s*[.):\-–]\s*/i, "")
    .trim();
}

/**
 * Quebra o bloco único de instruções da TheMealDB em um array de passos.
 *
 * Estratégia em 2 níveis:
 *  1. A API às vezes já vem com quebras de linha por passo → split por \n;
 *  2. Fallback: quando vem UM parágrafo gigante (>200 chars), quebra por frases
 *     (ponto, exclamação, interrogação), preservando a frase final sem pontuação.
 *
 * @param {string} instructions
 * @returns {string[]} Ex.: ["Season the chicken.", "Fry in hot oil...", ...]
 */
export function splitSteps(instructions) {
  if (typeof instructions !== "string" || !instructions.trim()) return [];

  const text = instructions.replace(/\r\n/g, "\n").trim();

  let steps = text
    .split(/\n+/)
    .map(cleanStep)
    .filter(Boolean);

  const isSingleGiantBlock = steps.length <= 1 && text.length > 200;
  if (isSingleGiantBlock) {
    const sentences = text.match(/[^.!?]+[.!?]+(?:["')\]]+)?|[^.!?]+$/g) ?? [text];
    steps = sentences.map(cleanStep).filter(Boolean);
  }

  return steps;
}

/**
 * Normaliza um nome de ingrediente para COMPARAÇÃO (não para exibição):
 * minúsculas, sem acentos, sem números/símbolos, espaços colapsados.
 * Ex.: "Chicken Breasts" -> "chicken breasts"
 */
export function normalizeIngredientName(name) {
  if (typeof name !== "string") return "";

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Emoji de um ingrediente, para os chips da Geladeira e listas divertidas.
 * Faz matching por CONTÊM ("chicken breast" contém "chicken").
 * @returns {string} Emoji ou o fallback 🍽️
 */
export function getIngredientEmoji(name) {
  const normalized = normalizeIngredientName(name);
  if (!normalized) return '🍽️';

  for (const [key, emoji] of Object.entries(INGREDIENT_EMOJIS)) {
    if (normalized.includes(key)) return emoji; // ordem do mapa define prioridade
  }

  return '🍽️';
}

/**
 * Formata um ingrediente para exibição: "Flour (200g)" ou "Salt" se não houver medida.
 * @param {{ name?: string, measure?: string }} ingredient
 */
export function formatIngredient({ name, measure } = {}) {
  if (!name) return "";
  return measure ? `${name} (${measure})` : name;
}