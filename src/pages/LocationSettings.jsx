import { useState } from "react";
import NoDatabaseBadge from "../components/atoms/NoDatabaseBadge";
import CountryLabel from "../components/molecules/CountryLabel";
import ConfirmDialog from "../components/organisms/ConfirmDialog";
import "../styles/location-settings.css";

// Instellingen > Landen en vestigingen.
// Hier beheer je de keuzelijsten die je ziet bij "Medewerker toevoegen".
// Let op: dit staat nog niet in de database. Na verversen is alles weer
// zoals in src/data/countries.js en src/data/locations.js.
function LocationSettings({
  countries,
  locations,
  employees,
  onAddCountry,
  onDeleteCountry,
  onAddLocation,
  onDeleteLocation,
  onBack,
}) {
  const [newCountry, setNewCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  // Het land waarvan je de vestigingen bekijkt (rechts / onder).
  const [selectedCountry, setSelectedCountry] = useState(countries[0]?.name ?? "");
  const [newLocation, setNewLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  // Wat je wilt verwijderen; zolang dit niet null is, staat het venster open.
  const [pendingRemoval, setPendingRemoval] = useState(null);

  // Hoeveel vestigingen en medewerkers er per land / vestiging zijn.
  const countLocations = (countryName) =>
    locations.filter((location) => location.country === countryName).length;
  const countEmployeesInCountry = (countryName) =>
    employees.filter((employee) => employee.country === countryName).length;
  const countEmployeesAtLocation = (location) =>
    employees.filter(
      (employee) =>
        employee.country === location.country && employee.location === location.name
    ).length;

  // Landen op alfabet, zodat je ze snel terugvindt.
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name, "nl"));
  const countryLocations = locations
    .filter((location) => location.country === selectedCountry)
    .sort((a, b) => a.name.localeCompare(b.name, "nl"));

  const handleAddCountry = (event) => {
    event.preventDefault();
    const name = newCountry.trim();
    if (name === "") {
      setCountryError("Vul een naam in.");
      return;
    }
    // Hoofdletters maken niet uit: "nederland" is hetzelfde als "Nederland".
    if (countries.some((country) => country.name.toLowerCase() === name.toLowerCase())) {
      setCountryError(`"${name}" bestaat al.`);
      return;
    }
    onAddCountry(name);
    setNewCountry("");
    setCountryError("");
    setSelectedCountry(name);
  };

  const handleAddLocation = (event) => {
    event.preventDefault();
    const name = newLocation.trim();
    if (name === "") {
      setLocationError("Vul een naam in.");
      return;
    }
    const exists = countryLocations.some(
      (location) => location.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setLocationError(`"${name}" bestaat al in ${selectedCountry}.`);
      return;
    }
    onAddLocation(selectedCountry, name);
    setNewLocation("");
    setLocationError("");
  };

  // Pas na het bevestigen in het venster.
  const confirmRemoval = () => {
    if (pendingRemoval.type === "country") {
      onDeleteCountry(pendingRemoval.item.name);
      if (selectedCountry === pendingRemoval.item.name) {
        setSelectedCountry("");
      }
    } else {
      onDeleteLocation(pendingRemoval.item.id);
    }
    setPendingRemoval(null);
  };

  return (
    <section className="page" aria-labelledby="locations-title">
      <button type="button" className="employee-back-button" onClick={onBack}>
        <span aria-hidden="true">←</span> Terug naar instellingen
      </button>

      <div className="page-header">
        <div>
          <p className="page-eyebrow">CONFIGURATIE</p>
          <h1 id="locations-title">Landen en vestigingen</h1>
          <p className="page-description">
            Deze lijsten zie je bij het toevoegen van een medewerker.
          </p>
        </div>
        <NoDatabaseBadge text="Nog geen databaseverbinding: na verversen weg" />
      </div>

      <div className="locations-grid">
        {/* ---------- Landen ---------- */}
        <section className="content-card" aria-labelledby="countries-title">
          <h2 id="countries-title">Landen ({countries.length})</h2>

          <form className="locations-add" onSubmit={handleAddCountry} noValidate>
            <input
              className="roles-search"
              value={newCountry}
              onChange={(event) => setNewCountry(event.target.value)}
              placeholder="Nieuw land, bijv. Spanje"
              aria-label="Naam van het nieuwe land"
            />
            <button type="submit" className="primary-button">+ Land</button>
          </form>
          {countryError && <p className="form-error" role="alert">{countryError}</p>}

          <ul className="locations-list">
            {sortedCountries.map((country) => {
              const locationCount = countLocations(country.name);
              const employeeCount = countEmployeesInCountry(country.name);
              const isSelected = country.name === selectedCountry;
              return (
                <li key={country.name} className={isSelected ? "is-selected" : ""}>
                  <button
                    type="button"
                    className="locations-select"
                    onClick={() => setSelectedCountry(country.name)}
                    aria-pressed={isSelected}
                  >
                    <CountryLabel country={country.name} />
                    <span className="roles-muted">
                      {locationCount} {locationCount === 1 ? "vestiging" : "vestigingen"}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="role-remove-button"
                    onClick={() => setPendingRemoval({ type: "country", item: country, employeeCount })}
                    disabled={locationCount > 0}
                    title={locationCount > 0 ? "Verwijder eerst alle vestigingen van dit land." : undefined}
                  >
                    Verwijderen
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------- Vestigingen van het gekozen land ---------- */}
        <section className="content-card" aria-labelledby="locations-list-title">
          <h2 id="locations-list-title">
            {selectedCountry ? `Vestigingen in ${selectedCountry}` : "Vestigingen"}
          </h2>

          {selectedCountry === "" ? (
            <p className="roles-muted">Kies links een land.</p>
          ) : (
            <>
              <form className="locations-add" onSubmit={handleAddLocation} noValidate>
                <input
                  className="roles-search"
                  value={newLocation}
                  onChange={(event) => setNewLocation(event.target.value)}
                  placeholder="Nieuwe vestiging, bijv. Madrid"
                  aria-label={`Naam van de nieuwe vestiging in ${selectedCountry}`}
                />
                <button type="submit" className="primary-button">+ Vestiging</button>
              </form>
              {locationError && <p className="form-error" role="alert">{locationError}</p>}

              {countryLocations.length === 0 ? (
                <p className="roles-muted">Dit land heeft nog geen vestigingen.</p>
              ) : (
                <ul className="locations-list">
                  {countryLocations.map((location) => {
                    const employeeCount = countEmployeesAtLocation(location);
                    return (
                      <li key={location.id}>
                        <span className="locations-name">
                          {location.name}
                          <span className="roles-muted">
                            {employeeCount} {employeeCount === 1 ? "medewerker" : "medewerkers"}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="role-remove-button"
                          onClick={() => setPendingRemoval({ type: "location", item: location, employeeCount })}
                        >
                          Verwijderen
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </div>

      {pendingRemoval && (
        <ConfirmDialog
          title={pendingRemoval.type === "country" ? "Land verwijderen?" : "Vestiging verwijderen?"}
          onConfirm={confirmRemoval}
          onClose={() => setPendingRemoval(null)}
        >
          <p>
            <strong>{pendingRemoval.item.name}</strong> verdwijnt uit de keuzelijst bij
            "Medewerker toevoegen".
          </p>
          {pendingRemoval.employeeCount > 0 && (
            <p>
              Let op: {pendingRemoval.employeeCount}{" "}
              {pendingRemoval.employeeCount === 1 ? "medewerker heeft" : "medewerkers hebben"} dit
              nog ingevuld. Bij hen blijft het gewoon staan.
            </p>
          )}
        </ConfirmDialog>
      )}
    </section>
  );
}

export default LocationSettings;
