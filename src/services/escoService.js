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
