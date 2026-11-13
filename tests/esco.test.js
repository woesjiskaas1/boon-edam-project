import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildEscoIndex, findEscoSuggestions, normalizeSkillText } from "../src/utils/escoMatching.js";
import { loadLocalEscoSkills, searchRemoteEscoSkills } from "../src/services/escoService.js";

const catalog = JSON.parse(await readFile(new URL("../public/data/esco-skills.json", import.meta.url), "utf8"));
const index = buildEscoIndex(catalog.skills);

test("the local export contains the complete set of unique official ESCO skills", () => {
  assert.ok(catalog.total > 13000);
  assert.equal(catalog.skills.length, catalog.total);
  assert.equal(new Set(catalog.skills.map((skill) => skill.uri)).size, catalog.total);
  assert.ok(catalog.skills.every((skill) => skill.name && /^http:\/\/data\.europa\.eu\/esco\/skill\/[a-f\d-]+$/.test(skill.uri)));
});

test("local matching corrects missing and transposed letters without the API", () => {
  assert.equal(findEscoSuggestions(index, "javscript")[0].name, "JavaScript");
  assert.equal(findEscoSuggestions(index, "javascrpit")[0].name, "JavaScript");
  assert.equal(findEscoSuggestions(index, "communcatie")[0].name, "communicatie");
  assert.equal(findEscoSuggestions(index, "communcatie")[0].isCorrection, true);
});

test("English names and misspellings resolve to the official Dutch skill", () => {
  assert.equal(findEscoSuggestions(index, "first aid")[0].name, "EHBO");
  assert.equal(findEscoSuggestions(index, "project managment")[0].name, "projectbeheer");
  assert.equal(findEscoSuggestions(index, "  JAVASCRIPT  ")[0].name, "JavaScript");
  assert.equal(findEscoSuggestions(index, "java script")[0].name, "JavaScript");
  assert.equal(normalizeSkillText("coördinatie"), "coordinatie");
});

test("empty, short and unrelated queries do not get arbitrary corrections", () => {
  for (const query of ["", " ", "j", "zzxqvv"]) assert.deepEqual(findEscoSuggestions(index, query), []);
  assert.equal(findEscoSuggestions(index, "onderhoud", 3).length, 3);
});

test("remote aliases merge by URI while exact matches outrank fuzzy matches", () => {
  const javascript = catalog.skills.find((skill) => skill.name === "JavaScript");
  const merged = [...index, ...buildEscoIndex([{ ...javascript, aliases: ["webscripttaal"] }])];
  assert.equal(findEscoSuggestions(merged, "webscripttaal")[0].uri, javascript.uri);
  const results = findEscoSuggestions(merged, "javascript");
  assert.equal(results[0].uri, javascript.uri);
  assert.equal(results.filter((skill) => skill.uri === javascript.uri).length, 1);
});

test("API suggestions save preferred labels and exclude occupations and invalid URIs", async () => {
  const uri = catalog.skills.find((skill) => skill.name === "JavaScript").uri;
  let requestedUrl;
  const result = await searchRemoteEscoSkills("java", { fetcher: async (url) => {
    requestedUrl = url;
    return { ok: true, json: async () => ({ _embedded: { results: [
      { className: "Skill", uri, preferredLabel: { nl: "JavaScript", en: "JavaScript" }, searchHit: "java script" },
      { className: "Occupation", uri, preferredLabel: { nl: "Programmeur" } },
      { className: "Skill", uri: "https://example.com/skill", preferredLabel: { nl: "Onjuist" } },
    ] } }) };
  } });
  assert.equal(requestedUrl.searchParams.get("type"), "skill");
  assert.equal(requestedUrl.searchParams.get("language"), "nl");
  assert.equal(requestedUrl.searchParams.get("selectedVersion"), catalog.version);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "JavaScript");
  assert.deepEqual(result[0].aliases, ["java script"]);
});

test("API failures and invalid responses reject; short queries skip the network", async () => {
  await assert.rejects(searchRemoteEscoSkills("java", { fetcher: async () => ({ ok: false }) }));
  await assert.rejects(searchRemoteEscoSkills("java", { fetcher: async () => ({ ok: true, json: async () => ({}) }) }));
  assert.deepEqual(await searchRemoteEscoSkills("j", { fetcher: () => { throw new Error("Must not fetch"); } }), []);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(searchRemoteEscoSkills("java", { signal: controller.signal, fetcher: async (_url, options) => {
    options.signal.throwIfAborted();
  } }), { name: "AbortError" });
});

test("the local catalog retries after errors and caches successful loads", async (context) => {
  const fetchMock = context.mock.method(globalThis, "fetch", async () => ({ ok: false }));
  await assert.rejects(loadLocalEscoSkills());
  fetchMock.mock.mockImplementation(async () => ({ ok: true, json: async () => catalog }));
  const loaded = await loadLocalEscoSkills();
  assert.equal(await loadLocalEscoSkills(), loaded);
  assert.equal(loaded.length, catalog.total);
  assert.equal(fetchMock.mock.callCount(), 2);
});
