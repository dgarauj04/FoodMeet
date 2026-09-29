export const CATEGORY_TRANSLATIONS = Object.freeze({
  Beef: "Carne Bovina",
  Breakfast: "Café da Manhã",
  Chicken: "Frango",
  Dessert: "Sobremesa",
  Goat: "Cabra",
  Lamb: "Cordeiro",
  Miscellaneous: "Diversos",
  Pasta: "Massas",
  Pork: "Porco",
  Seafood: "Frutos do Mar",
  Side: "Acompanhamento",
  Starter: "Entrada",
  Vegan: "Vegana",
  Vegetarian: "Vegetariana",
});

export const AREA_TRANSLATIONS = Object.freeze({
  American: "Americana",
  Australian: "Australiana",
  British: "Britânica",
  Brazilian: "Brasileira",
  Canadian: "Canadense",
  Chinese: "Chinesa",
  Croatian: "Croata",
  Dutch: "Holandesa",
  Egyptian: "Egípcia",
  Filipino: "Filipina",
  French: "Francesa",
  Greek: "Grega",
  Indian: "Indiana",
  Irish: "Irlandesa",
  Italian: "Italiana",
  Jamaican: "Jamaicana",
  Japanese: "Japonesa",
  Kenyan: "Queniana",
  Malaysian: "Malaia",
  Mexican: "Mexicana",
  Moroccan: "Marroquina",
  Norway: "Norueguesa",
  Pakistani: "Paquistanesa",
  Polish: "Polonesa",
  Portuguese: "Portuguesa",
  Russian: "Russa",
  Spanish: "Espanhola",
  Thai: "Tailandesa",
  Tunisian: "Tunisiana",
  Turkish: "Turca",
  Ukrainian: "Ucraniana",
  Unknown: "Internacional",
  "United States": "Estadunidense",
  Uruguayan: "Uruguaia",
  Vietnamese: "Vietnamita",
});

export const INGREDIENT_TRANSLATIONS = Object.freeze({
  /* proteínas */
  beef: "carne bovina", "minced beef": "carne moída", steak: "bife", veal: "vitela",
  lamb: "cordeiro", "leg of lamb": "perna de cordeiro", "lamb chops": "costeletas de cordeiro",
  pork: "porco", "pork loin": "lombo de porco", bacon: "bacon", ham: "presunto",
  gammon: "presunto", sausage: "salsicha", sausages: "salsichas", chorizo: "chorizo",
  chicken: "frango", "chicken breast": "peito de frango", "chicken thighs": "coxas de frango",
  turkey: "peru", duck: "pato", goat: "cabra",
  egg: "ovo", eggs: "ovos", "egg yolks": "gemas de ovo", "egg whites": "claras de ovo",

  /* peixes e frutos do mar */
  fish: "peixe", salmon: "salmão", tuna: "atum", cod: "bacalhau", sardines: "sardinhas",
  mackerel: "cavala", shrimp: "camarão", prawns: "camarões", crab: "caranguejo",
  mussels: "mexilhões", squid: "lula",

  /* laticínios */
  milk: "leite", "whole milk": "leite integral", "skimmed milk": "leite desnatado",
  "condensed milk": "leite condensado", "coconut milk": "leite de coco",
  butter: "manteiga", cheese: "queijo", "cheddar cheese": "queijo cheddar",
  parmesan: "parmesão", "parmigiano reggiano": "parmesão", mozzarella: "mussarela",
  "cream cheese": "cream cheese", yogurt: "iogurte", "double cream": "creme de leite",
  "single cream": "creme de leite", "heavy cream": "creme de leite",
  "sour cream": "creme azedo", mascarpone: "mascarpone", feta: "queijo feta",

  /* grãos, farinhas e fermentos */
  flour: "farinha de trigo", "plain flour": "farinha de trigo",
  "self-raising flour": "farinha com fermento", breadcrumbs: "farinha de rosca",
  rice: "arroz", "basmati rice": "arroz basmati", pasta: "macarrão",
  spaghetti: "espaguete", noodles: "macarrão oriental", "lasagne sheets": "massa de lasanha",
  couscous: "cuscuz", oats: "aveia", quinoa: "quinoa", cornmeal: "fubá",
  cornstarch: "amido de milho", cornflour: "amido de milho", semolina: "semolina",
  yeast: "fermento biológico", "baking powder": "fermento em pó",
  "baking soda": "bicarbonato de sódio",

  /* vegetais */
  potato: "batata", potatoes: "batatas", "sweet potato": "batata-doce",
  onion: "cebola", onions: "cebolas", "red onion": "cebola roxa",
  "spring onions": "cebolinha", "green onions": "cebolinha", shallots: "chalotas",
  garlic: "alho", "garlic cloves": "dentes de alho", leek: "alho-poró",
  tomato: "tomate", tomatoes: "tomates", "chopped tomatoes": "tomates picados",
  "tomato puree": "polpa de tomate", ketchup: "ketchup",
  carrot: "cenoura", carrots: "cenouras", celery: "salsão", broccoli: "brócolis",
  cauliflower: "couve-flor", spinach: "espinafre", cabbage: "repolho", lettuce: "alface",
  peas: "ervilhas", "green beans": "vagem", corn: "milho", mushrooms: "cogumelos",
  zucchini: "abobrinha", courgettes: "abobrinha", aubergine: "berinjela",
  eggplant: "berinjela", "bell pepper": "pimentão", "red pepper": "pimentão vermelho",
  "green pepper": "pimentão verde", avocado: "abacate", beetroot: "beterraba",
  turnip: "nabo", okra: "quiabo", asparagus: "aspargos", cucumber: "pepino",
  pumpkin: "abóbora", "butternut squash": "abóbora",

  /* ervas e especiarias */
  salt: "sal", "black pepper": "pimenta-do-reino", pepper: "pimenta",
  "cayenne pepper": "pimenta caiena", paprika: "páprica", cumin: "cominho",
  "curry powder": "curry em pó", "garam masala": "garam masala", turmeric: "cúrcuma",
  cinnamon: "canela", ginger: "gengibre", nutmeg: "noz-moscada",
  cloves: "cravos-da-índia", "bay leaf": "folha de louro", "bay leaves": "folhas de louro",
  parsley: "salsa", coriander: "coentro", cilantro: "coentro", basil: "manjericão",
  oregano: "orégano", thyme: "tomilho", rosemary: "alecrim", sage: "sálvia",
  mint: "hortelã", dill: "endro", saffron: "açafrão", cardamom: "cardamomo",
  "sesame seeds": "gergelim", "sesame oil": "óleo de gergelim",

  /* óleos, molhos e caldos */
  "olive oil": "azeite", "extra virgin olive oil": "azeite extra virgem",
  "vegetable oil": "óleo de cozinha", "sunflower oil": "óleo de girassol",
  vinegar: "vinagre", mustard: "mostarda", mayonnaise: "maionese",
  "soy sauce": "molho de soja", "worcestershire sauce": "molho inglês",
  "hot sauce": "molho de pimenta", stock: "caldo", "chicken stock": "caldo de frango",
  "beef stock": "caldo de carne", "vegetable stock": "caldo de legumes", water: "água",

  /* frutas */
  lemon: "limão", lime: "lima", orange: "laranja", apple: "maçã", banana: "banana",
  strawberries: "morangos", pineapple: "abacaxi", mango: "manga", coconut: "coco",
  raisins: "uvas-passas", dates: "tâmaras", figs: "figos", apricots: "damascos",
  peaches: "pêssegos", pears: "peras", cherries: "cerejas", blueberries: "mirtilos",
  "lemon juice": "suco de limão", "lemon zest": "raspas de limão",

  /* doces, bebidas e outros */
  sugar: "açúcar", "caster sugar": "açúcar refinado", "brown sugar": "açúcar mascavo",
  "icing sugar": "açúcar de confeiteiro", honey: "mel", "maple syrup": "xarope de maple",
  chocolate: "chocolate", "dark chocolate": "chocolate meio amargo", cocoa: "cacau em pó",
  "vanilla extract": "essência de baunilha", jam: "geleia", gelatine: "gelatina",
  "ice cream": "sorvete", "peanut butter": "pasta de amendoim", almonds: "amêndoas",
  walnuts: "nozes", peanuts: "amendoins", "cashew nuts": "castanhas de caju",
  olives: "azeitonas", "red wine": "vinho tinto", "white wine": "vinho branco",
  beer: "cerveja", rum: "rum", vodka: "vodka", tofu: "tofu",
  chickpeas: "grão-de-bico", lentils: "lentilhas", "kidney beans": "feijão",
  beans: "feijão", bread: "pão", "naan bread": "pão naan", "pitta bread": "pão pita",
  tortillas: "tortilhas",
});

/* "2 tbs" -> "2 colher (sopa)" · "a pinch" -> "a pitada".                   */

const MEASURE_TOKENS = Object.freeze({
  cup: "xícara", cups: "xícaras", tbs: "colher (sopa)", tbsp: "colher (sopa)",
  tablespoon: "colher (sopa)", tablespoons: "colher (sopa)", tsp: "colher (chá)",
  teaspoon: "colher (chá)", teaspoons: "colher (chá)", dsp: "colher (sobremesa)",
  pinch: "pitada", dash: "fio", handful: "punhado", splash: "um toque",
  clove: "dente", cloves: "dentes", sprig: "ramo", sprigs: "ramos",
  stick: "tablete", sticks: "tabletes", can: "lata", cans: "latas",
  tin: "lata", tins: "latas", packet: "pacote", packets: "pacotes",
  box: "caixa", bunch: "maço", large: "grande", medium: "médio", small: "pequeno",
  whole: "inteiro", sliced: "fatiado", chopped: "picado", diced: "em cubos",
  grated: "ralado", melted: "derretido", beaten: "batido", crushed: "amassado",
  ground: "moído", minced: "picado", peeled: "descascado", boiled: "cozido",
  grams: "gramas", pounds: "libras", litres: "litros", liters: "litros",
  "to taste": "a gosto", "to serve": "para servir", garnish: "para decorar",
  "for garnish": "para decorar", "for frying": "para fritar",
  "for dusting": "para polvilhar", "as needed": "se necessário",
});

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function pretty(text = "") {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function singularize(word) {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}

const SORTED_KEYS = Object.keys(INGREDIENT_TRANSLATIONS).sort((a, b) => b.length - a.length);

export function translateCategory(name) {
  if (!name) return null;
  return CATEGORY_TRANSLATIONS[name] ?? name;
}

export function translateArea(name) {
  if (!name) return null;
  return AREA_TRANSLATIONS[name] ?? name;
}

/**
 * Traduz um nome de ingrediente para exibição.
 * Estratégia: match exato → singularizado → contém (chave mais longa primeiro).
 * Nunca retorna vazio: fallback é o nome original.
 */
export function translateIngredientName(name = "") {
  const normalized = normalize(name);
  if (!normalized) return name || "";

  for (const candidate of [normalized, singularize(normalized)]) {
    const pt = INGREDIENT_TRANSLATIONS[candidate];
    if (pt) return pretty(pt);
  }
  for (const key of SORTED_KEYS) {
    if (normalized.includes(key)) return pretty(INGREDIENT_TRANSLATIONS[key]);
  }
  return name;
}

export function translateMeasure(measure = "") {
  if (!measure) return "";
  let output = String(measure);
  for (const [en, pt] of Object.entries(MEASURE_TOKENS)) {
    output = output.replace(new RegExp(`\\b${en}\\b`, "gi"), pt);
  }
  return output;
}

const REVERSE_INGREDIENTS = new Map(
  Object.entries(INGREDIENT_TRANSLATIONS).map(([en, pt]) => [normalize(pt), en])
);

/**
 * Converte o termo digitado pelo usuário (pt-BR) no termo que a API entende.
 * Ex.: "frango" -> "chicken" · "peito de frango" -> "chicken breast"
 * Retorna "" quando não há tradução conhecida → quem chama usa o termo puro.
 */
export function toEnglishIngredient(term = "") {
  const normalized = normalize(term);
  if (!normalized) return "";
  if (REVERSE_INGREDIENTS.has(normalized)) return REVERSE_INGREDIENTS.get(normalized);
  const singular = singularize(normalized);
  if (REVERSE_INGREDIENTS.has(singular)) return REVERSE_INGREDIENTS.get(singular);
  return "";
}