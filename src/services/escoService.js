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
    // De omschrijving staat per taal; wij willen de Nederlandse tekst.
    description: data.description?.[LANGUAGE]?.literal ?? "",
    essentialSkills: essentialSkills.map((skill) => ({
      uri: skill.uri,
      name: skill.title,
    })),
  };
}