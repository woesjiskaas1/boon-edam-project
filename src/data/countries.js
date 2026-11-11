// Landen waar Boon Edam een eigen vestiging heeft (zie locations.js).
// "code" is de landcode (ISO 3166-1) en de id van de vlag in assets/flags.svg.
// "name" laten we zien op het scherm en slaan we op in de database.
// Bron: https://www.boonedam.com/contact (november 2026).
const countries = [
  { code: "au", name: "Australië" },
  { code: "be", name: "België" },
  { code: "cn", name: "China" },
  { code: "de", name: "Duitsland" },
  { code: "fr", name: "Frankrijk" },
  { code: "hk", name: "Hongkong" },
  { code: "in", name: "India" },
  { code: "ie", name: "Ierland" },
  { code: "my", name: "Maleisië" },
  { code: "nl", name: "Nederland" },
  { code: "no", name: "Noorwegen" },
  { code: "ae", name: "Verenigde Arabische Emiraten" },
  { code: "gb", name: "Verenigd Koninkrijk" },
  { code: "us", name: "Verenigde Staten" },
  { code: "se", name: "Zweden" },
];

export default countries;
