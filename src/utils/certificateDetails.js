import certificateDetails from "../data/certificateDetails.js";

const normalizeName = (name) => name
  .normalize("NFKD")
  .replace(/\p{M}/gu, "")
  .toLocaleLowerCase("nl")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

// Koppel op de naam: een hernoemd certificaat krijgt geen uitleg over de oude titel.
const detailsByName = new Map(certificateDetails.flatMap((details) =>
  details.names.map((name) => [normalizeName(name), details])
));

export function getCertificateDetails(certificate) {
  const details = detailsByName.get(normalizeName(certificate.name));
  if (details) return { ...details, researched: true };

  return {
    summary: certificate.description?.trim() || "Voor dit certificaat is nog geen inhoudelijke beschrijving beschikbaar.",
    audience: "",
    topics: [],
    validity: "Raadpleeg het uitgereikte bewijs of de opleider voor de geldigheidsduur en eventuele herhaling.",
    recognition: "De aanbieder en het type bewijs zijn nog niet vastgelegd.",
    sources: [],
    researched: false,
  };
}
