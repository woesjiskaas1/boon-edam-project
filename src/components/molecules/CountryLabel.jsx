import CountryFlag from "../atoms/CountryFlag";
import countries from "../../data/countries";
import "../../styles/country.css";

function CountryLabel({ country }) {
  const selectedCountry = countries.find((item) => item.name === country);

  return (
    <span className="country-label">
      {selectedCountry && <CountryFlag code={selectedCountry.code} />}
      <span className="country-label-name">{country || "Niet ingevuld"}</span>
    </span>
  );
}

export default CountryLabel;
