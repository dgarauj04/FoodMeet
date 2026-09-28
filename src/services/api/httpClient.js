import { API_LIMITS } from "../../utils/constants";

const BASE_URL = (
  import.meta.env?.VITE_MEALDB_BASE_URL || "https://www.themealdb.com/api/json/v1"
).replace(/\/+$/, ""); 

const API_KEY = import.meta.env?.VITE_MEALDB_VERSION || "1";

const REQUEST_TIMEOUT_MS = API_LIMITS.REQUEST_TIMEOUT_MS;

const cache = new Map();

export class ApiError extends Error {
  constructor(message, { type = "http", status = null, cause = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.status = status;
    this.cause = cause;
  }
}

/** Monta a URL final: {BASE}/{KEY}/{path}?{query}. Ignora params vazios/null/undefined. */
function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}/${API_KEY}/${path.replace(/^\//, "")}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

/**
 * Executa uma requisição GET contra a TheMealDB.
 *
 * @param {string} path          Ex.: "search.php"
 * @param {Object} params        Query params. Ex.: { s: "pie" }
 * @param {Object} [options]
 * @param {boolean} [options.useCache]  Cachear a resposta em memória (listas estáticas).
 * @returns {Promise<Object>} JSON cru da API.
 * @throws {ApiError} type: "network" | "timeout" | "http"
 */
export async function request(path, params = {}, { useCache = false } = {}) {
  const url = buildUrl(path, params);

  // Cache hit: retorno síncrono (envolvido em Promise pela própria assinatura async)
  if (useCache && cache.has(url.href)) {
    return cache.get(url.href);
  }

  // AbortController: se o fetch ultrapassar o timeout, ele é CANCELADO de verdade.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new ApiError(`A API respondeu com o status ${response.status}.`, {
        type: "http",
        status: response.status,
      });
    }

    const data = await response.json();

    if (useCache) cache.set(url.href, data);
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error?.name === "AbortError") {
      throw new ApiError(
        "A requisição demorou demais e foi cancelada. Tente novamente.",
        { type: "timeout", cause: error }
      );
    }

    throw new ApiError(
      "Não foi possível conectar ao servidor de receitas. Verifique sua conexão.",
      { type: "network", cause: error }
    );
  } finally {
    clearTimeout(timeoutId); 
  }
}

export function getErrorMessage(error) {
  if (error instanceof ApiError) return error.message;
  return "Algo inesperado aconteceu. Tente novamente em instantes.";
}