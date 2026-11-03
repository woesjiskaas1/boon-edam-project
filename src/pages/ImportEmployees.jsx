function ImportEmployees({ onCancel }) {
  return (
    <section className="add-employee-page">
      <div className="employees-header">
        <div>
          <h1>Medewerkers importeren</h1>
          <p>Voeg veel medewerkers tegelijk toe met een CSV- of Excel-bestand.</p>
        </div>
      </div>

      <div className="content-card">
        <h2>Binnenkort beschikbaar</h2>
        <p>
          Hier kun je straks een bestand kiezen. Het systeem controleert dan
          per rij of de gegevens kloppen, voordat de medewerkers worden toegevoegd.
        </p>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Terug naar medewerkers
        </button>
      </div>
    </section>
  );
}

export default ImportEmployees;