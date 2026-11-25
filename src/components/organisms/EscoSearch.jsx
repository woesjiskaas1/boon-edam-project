import { useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { searchEscoOccupations, getEscoOccupation } from "../../services/escoService";

// Je zoekt een beroep, en met "Kiezen" haalt het paneel de details op
// en geeft die aan de pagina (onSelect).
function EscoSearch({ onSelect, onClose }) {
  // Wat de gebruiker in het zoekveld typt.
  const [query, setQuery] = useState("");
  // De beroepen die ESCO teruggaf.
  const [results, setResults] = useState([]);
  // Wachten we op ESCO? Dan zetten we de knop uit.
  const [isSearching, setIsSearching] = useState(false);
  // Foutmelding, bijv. als ESCO niet bereikbaar is.
  const [searchError, setSearchError] = useState("");
  // Is er al gezocht? Nodig voor de melding "niets gevonden".
  const [hasSearched, setHasSearched] = useState(false);

  // Het beroep waarvan we de details ophalen (de uri), of "" als we niets ophalen.
  const [loadingUri, setLoadingUri] = useState("");


  const handleSearch = async (event) => {
    event.preventDefault();

    const text = query.trim();

    // Te kort? Dan niet zoeken: dat geeft alleen rare resultaten.
    if (text.length < 2) {
      setSearchError("Typ minstens 2 letters.");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const found = await searchEscoOccupations(text);
      setResults(found);
      setHasSearched(true);
    } catch (error) {
      setSearchError(error.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // "Kiezen": haal de omschrijving en de essentiële skills op,
  // en geef ze aan de pagina.
  const handleChoose = async (occupation) => {
    setLoadingUri(occupation.uri);
    setSearchError("");

    try {
      const details = await getEscoOccupation(occupation.uri);
      onSelect(details);
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setLoadingUri("");
    }
  };

  return (
    <section className="esco-search" aria-label="Zoeken in ESCO">
      <div className="esco-search-header">
        <div>
          <h2>Zoeken in ESCO</h2>
          <p>
            Zoek een beroep in de Europese ESCO-lijst. De naam, de omschrijving
            en de essentiële skills worden dan voor je ingevuld.
          </p>
        </div>
        <Button
          className="esco-search-close"
          onClick={onClose}
          aria-label="ESCO-zoeken sluiten"
        >
          ×
        </Button>
      </div>

      <form className="esco-search-bar" onSubmit={handleSearch}>
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Bijv. servicemonteur, HR-manager..."
          aria-label="Beroep zoeken in ESCO"
        />
        <Button type="submit" variant="primary" disabled={isSearching}>
          {isSearching ? "Zoeken..." : "Zoeken"}
        </Button>
      </form>

      {searchError && (
        <p className="form-error esco-error" role="alert">
          {searchError}
        </p>
      )}

      {hasSearched && results.length === 0 && !searchError && (
        <p className="esco-message">Geen beroepen gevonden. Probeer een ander woord.</p>
      )}

      <ul className="esco-results">
        {results.map((occupation) => (
          <li key={occupation.uri} className="esco-result">
            <div>
              <strong>{occupation.title}</strong>
              <span className="esco-result-code">ESCO-code {occupation.code}</span>
            </div>

            <Button
              variant="secondary"
              onClick={() => handleChoose(occupation)}
              disabled={loadingUri !== ""}
            >
              {loadingUri === occupation.uri ? "Ophalen..." : "Kiezen"}
            </Button>

          </li>
        ))}
      </ul>
    </section>
  );
}



export default EscoSearch;
