import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildEscoIndex, findEscoSuggestions } from "../src/utils/escoMatching.js";
import { loadLocalEscoCategories, searchRemoteEscoCategories } from "../src/services/escoService.js";

const catalog = JSON.parse(await readFile(new URL("../public/data/esco-categories.json", import.meta.url), "utf8"));
const index = buildEscoIndex(catalog.categories);
const scheme = "http://data.europa.eu/esco/concept-scheme/skills-hierarchy";

test("the category export includes all four ESCO branches and their parent relations", () => {
  assert.equal(catalog.categories.length, catalog.total);
  assert.ok(catalog.total > 600);
  const uris = new Set(catalog.categories.map((item) => item.uri));
  assert.equal(uris.size, catalog.total);
  assert.deepEqual(catalog.categories.filter((item) => !item.broaderUris.length).map((item) => item.code).sort(), ["K", "L", "S", "T"]);
  assert.ok(catalog.categories.every((item) => item.name && item.code && item.broaderUris.every((uri) => uris.has(uri))));
});

test("category corrections prefer an official group and preserve exact custom names", () => {
  const combined = [...index, ...buildEscoIndex([{ name: "Communicatie", uri: "local:Communicatie", isCustom: true }])];
  const correction = findEscoSuggestions(combined, "comunicatie")[0];
  assert.equal(correction.name, "communicatie, samenwerking en creativiteit");
  assert.equal(correction.code, "S1");
  assert.equal(correction.isCorrection, true);
  assert.equal(findEscoSuggestions(combined, "Communicatie")[0].uri, "local:Communicatie");
});

test("category names support English, typo corrections, full long labels and ESCO codes", () => {
  assert.equal(findEscoSuggestions(index, "working with computers")[0].name, "werken met computers");
  assert.equal(findEscoSuggestions(index, "computres")[0].code, "S5");
  assert.equal(findEscoSuggestions(index, "S8.6.4")[0].code, "S8.6.4");
  const longest = catalog.categories.reduce((first, second) => first.name.length > second.name.length ? first : second);
  assert.ok(longest.name.length > 60);
  assert.equal(findEscoSuggestions(index, longest.name)[0].name, longest.name);
});

test("the category API restricts suggestions to official hierarchy concepts", async () => {
  const category = catalog.categories.find((item) => item.code === "S5");
  let requestedUrl;
  const row = {
    className: "Concept", uri: category.uri, code: category.code,
    preferredLabel: { nl: category.name, en: category.englishLabel },
    isInScheme: [scheme], broaderConcept: category.broaderUris,
  };
  const result = await searchRemoteEscoCategories("computers", { fetcher: async (url) => {
    requestedUrl = url;
    return { ok: true, json: async () => ({ _embedded: { results: [
      row, { ...row, className: "Skill" }, { ...row, isInScheme: [] }, { ...row, code: null },
    ] } }) };
  } });
  assert.equal(requestedUrl.searchParams.get("isInScheme"), scheme);
  assert.equal(requestedUrl.searchParams.has("type"), false);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, category.name);
  assert.equal(result[0].code, "S5");
  assert.deepEqual(result[0].broaderUris, category.broaderUris);
});

test("the category catalog rejects skill data and retries with the separate category file", async (context) => {
  let requestedPath;
  const fetchMock = context.mock.method(globalThis, "fetch", async (path) => {
    requestedPath = path;
    return { ok: true, json: async () => ({ skills: [] }) };
  });
  await assert.rejects(loadLocalEscoCategories());
  fetchMock.mock.mockImplementation(async () => ({ ok: true, json: async () => catalog }));
  const categories = await loadLocalEscoCategories();
  assert.equal(requestedPath, "/data/esco-categories.json");
  assert.equal(categories.length, catalog.total);
  assert.equal(await loadLocalEscoCategories(), categories);
  assert.equal(fetchMock.mock.callCount(), 2);
});
