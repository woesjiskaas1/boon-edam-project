import flags from "../../assets/flags.svg?no-inline";
import "../../styles/country.css";

export default function CountryFlag({ code }) {
  return (
    <svg className="country-flag" viewBox="0 0 30 20" aria-hidden="true">
      <use href={`${flags}#${code}`} />
    </svg>
  );
}
