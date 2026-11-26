// Verzoeken naar ESCO, de Europese lijst met beroepen en skills.
// ESCO is een openbare API van de Europese Commissie. We roepen hem
// rechtstreeks vanuit de browser aan; de API staat dat toe (CORS).
const ESCO_URL = "https://ec.europa.eu/esco/api";

// De taal van de namen en omschrijvingen die ESCO teruggeeft.
const LANGUAGE = "nl";

// GET: zoekt beroepen in ESCO.
// Geeft een lijst terug met per beroep: { uri, title, code }.
export async function searchEscoOccupations(text) {
  // URLSearchParams maakt de ?text=...&type=... achter de URL,
  // en zet speciale tekens (spaties, é) om naar een veilige vorm.
  const params = new URLSearchParams({
    text: text,
    type: "occupation",
    language: LANGUAGE,
    limit: "10",
  });

  const response = await fetch(`${ESCO_URL}/search?${params}`);

  if (!response.ok) {
    throw new Error("ESCO kon niet worden doorzocht. Probeer het later opnieuw.");
  }

  const data = await response.json();

  // De resultaten staan in data._embedded.results.
  // Zijn er geen resultaten, dan bestaat _embedded soms niet: dan een lege lijst.
  const results = data._embedded?.results ?? [];

  return results.map((result) => ({
    uri: result.uri,
    title: result.title,
    code: result.code,
  }));
}

// GET: haalt één beroep uit ESCO op, met omschrijving en essentiële skills.
// "uri" is het unieke adres van het beroep, uit searchEscoOccupations.
// Geeft terug: { uri, title, description, essentialSkills: [{ uri, name }] }
export async function getEscoOccupation(uri) {
  const params = new URLSearchParams({
    uri: uri,
    language: LANGUAGE,
  });

  const response = await fetch(`${ESCO_URL}/resource/occupation?${params}`);

  if (!response.ok) {
    throw new Error("Dit beroep kon niet worden opgehaald uit ESCO.");
  }

  const data = await response.json();

  // De essentiële skills staan in data._links.hasEssentialSkill.
  const essentialSkills = data._links?.hasEssentialSkill ?? [];

  return {
    uri: data.uri,
    title: data.title,
    // De ESCO-code, bijv. "7412.3".
    code: data.code ?? "",
    // De omschrijving staat per taal; wij willen de Nederlandse tekst.
    description: data.description?.[LANGUAGE]?.literal ?? "",
    essentialSkills: essentialSkills.map((skill) => ({
      uri: skill.uri,
      name: skill.title,
    })),
  };
}

// ---------- Skills en categorieën zoeken (Senn, Skills-pagina) ----------

const ESCO_API = "https://ec.europa.eu/esco/api/suggest2";
const ESCO_VERSION = "v1.2.0";
const CATEGORY_SCHEME = "http://data.europa.eu/esco/concept-scheme/skills-hierarchy";
const SKILL_URI = /^https?:\/\/data\.europa\.eu\/esco\/skill\/[a-f\d-]+$/i;
const CATEGORY_URI = /^https?:\/\/data\.europa\.eu\/esco\/(?:skill\/[a-f\d-]+|isced-f\/[\w-]+)$/i;
const catalogPromises = {};

export function loadLocalEscoSkills() {
  return loadLocalCatalog("skills");
}

export function loadLocalEscoCategories() {
  return loadLocalCatalog("categories");
}

function loadLocalCatalog(kind) {
  const isCategory = kind === "categories";
  catalogPromises[kind] ??= fetch(`${import.meta.env?.BASE_URL || "/"}data/esco-${kind}.json`)
    .then(async (response) => {
      if (!response.ok) throw new Error("De lokale ESCO-lijst kon niet worden geladen.");
      const data = await response.json();
      const items = data[kind];
      if (!Array.isArray(items) || !items.length || items.some((item) => !item.name || !(isCategory ? CATEGORY_URI : SKILL_URI).test(item.uri) || (isCategory && !item.code))) {
        throw new Error("De lokale ESCO-lijst is ongeldig.");
      }
      return items;
    }).catch((error) => {
      delete catalogPromises[kind];
      throw error;
    });
  return catalogPromises[kind];
}

export function searchRemoteEscoSkills(text, options) {
  return searchRemoteCatalog("skills", text, options);
}

export function searchRemoteEscoCategories(text, options) {
  return searchRemoteCatalog("categories", text, options);
}

async function searchRemoteCatalog(kind, text, { signal, fetcher = fetch } = {}) {
  const isCategory = kind === "categories";
  if (text.trim().length < 2) return [];
  const url = new URL(ESCO_API);
  url.search = new URLSearchParams({
    text: text.trim(), language: "nl", limit: "12",
    ...(isCategory ? { isInScheme: CATEGORY_SCHEME } : { type: "skill" }),
    alt: "true", selectedVersion: ESCO_VERSION,
  });
  const response = await fetcher(url, {
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(4000)]) : AbortSignal.timeout(4000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("ESCO is tijdelijk niet bereikbaar.");
  const data = await response.json();
  if (!Array.isArray(data._embedded?.results)) throw new Error("ESCO gaf een ongeldig antwoord.");
  return data._embedded.results
    .filter((row) => row.className === (isCategory ? "Concept" : "Skill") &&
      (isCategory ? CATEGORY_URI : SKILL_URI).test(row.uri) &&
      (!isCategory || (row.code && row.isInScheme?.includes(CATEGORY_SCHEME))) &&
      (row.preferredLabel?.nl || row.preferredLabel?.en))
    .map((row) => ({
      uri: row.uri,
      name: row.preferredLabel.nl || row.preferredLabel.en,
      englishLabel: row.preferredLabel.en || "",
      ...(isCategory ? { code: row.code, broaderUris: row.broaderConcept || [] } : {}),
      aliases: [row.searchHit, ...(row.alternativeLabel?.nl || []), ...(row.alternativeLabel?.en || [])].filter(Boolean),
    }));
}
