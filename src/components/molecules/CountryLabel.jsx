import flags from "../../assets/flags.svg?no-inline";
import countries from "../../data/countries";
import "../../styles/country.css";

function CountryLabel({ country }) {
  const selectedCountry = countries.find((item) => item.name === country);

  return (
    <span className="country-label">
      {selectedCountry && (
        <svg className="country-flag" viewBox="0 0 30 20" aria-hidden="true">
          <use href={`${flags}#${selectedCountry.code}`} />
        </svg>
      )}
      <span className="country-label-name">{country || "Niet ingevuld"}</span>
    </span>
  );
}

export default CountryLabel;
