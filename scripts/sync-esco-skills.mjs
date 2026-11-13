import { mkdir, rename, writeFile } from "node:fs/promises";

// Officiële ESCO-labels ophalen; het bestaande bestand blijft intact bij een fout.
const endpoint = "https://ec.europa.eu/esco/api/search";
const version = "v1.2.0";
const pageSize = 1000;
const requestedCatalogs = process.argv.slice(2);
if (requestedCatalogs.some((kind) => !["skills", "categories"].includes(kind))) {
  throw new Error("Gebruik: npm run esco:sync -- [skills|categories]");
}
async function syncCatalog(kind) {
  const isCategory = kind === "categories";
  const items = new Map();
  let total;

  for (let page = 0; total === undefined || page * pageSize < total; page += 1) {
    const url = new URL(endpoint);
    url.search = new URLSearchParams({
      ...(isCategory ? { isInScheme: "http://data.europa.eu/esco/concept-scheme/skills-hierarchy" } : { type: "skill" }),
      language: "nl", selectedVersion: version,
      full: "false", limit: String(pageSize), offset: String(page),
    });
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`ESCO gaf HTTP ${response.status}.`);
    const data = await response.json();
    total ??= data.total;
    const rows = data._embedded?.results;
    if (!Number.isInteger(total) || !Array.isArray(rows) || rows.length === 0) {
      throw new Error("Onvolledig ESCO-antwoord; het bestaande bestand is behouden.");
    }
    for (const row of rows) {
      if (row.className !== (isCategory ? "Concept" : "Skill") || !(row.preferredLabel?.nl || row.preferredLabel?.en) || !row.uri?.startsWith("http://data.europa.eu/esco/") || (isCategory && !row.code)) {
        throw new Error("Een ESCO-concept mist een officiële URI, code of label.");
      }
      items.set(row.uri, {
        uri: row.uri,
        name: row.preferredLabel.nl || row.preferredLabel.en,
        ...(!row.preferredLabel.nl ? { language: "en" } : {}),
        englishLabel: row.preferredLabel.en || "",
        ...(isCategory ? { code: row.code, broaderUris: row.broaderConcept || [] } : {}),
        aliases: [...new Set([
          ...(row.alternativeLabel?.nl || []),
          ...(row.alternativeLabel?.en || []),
        ])],
      });
    }
    console.log(`ESCO ${kind}: ${items.size} van ${total} opgehaald.`);
  }

  if (items.size !== total) throw new Error("De ESCO-export is onvolledig; het bestaande bestand is behouden.");

  const directory = new URL("../public/data/", import.meta.url);
  const target = new URL(`esco-${kind}.json`, directory);
  const temporary = new URL(`esco-${kind}.json.tmp`, directory);
  await mkdir(directory, { recursive: true });
  await writeFile(temporary, JSON.stringify({
    source: "European Commission — ESCO",
    sourceUrl: "https://esco.ec.europa.eu/en/use-esco",
    apiUrl: endpoint,
    version,
    languages: ["nl", "en"],
    retrievedAt: new Date().toISOString(),
    total: items.size,
    [kind]: [...items.values()].sort((a, b) => a.name.localeCompare(b.name, "nl")),
  }, null, 2) + "\n");
  await rename(temporary, target);
  console.log(`Opgeslagen: ${target.pathname}`);
}

for (const kind of requestedCatalogs.length ? requestedCatalogs : ["skills", "categories"]) {
  await syncCatalog(kind);
}
