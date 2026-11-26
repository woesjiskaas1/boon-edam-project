// Een label voor onderdelen die nog niet met de database werken.
// Zo zie je meteen wat nog voorbeelddata is.
// Werkt een onderdeel later wél met de database, haal dit label dan weg.
function NoDatabaseBadge({ text = "Nog geen databaseverbinding" }) {
  return (
    <span
      className="no-database-badge"
      title="Dit onderdeel wordt nog niet opgeslagen in of opgehaald uit de database."
    >
      <span className="no-database-dot" aria-hidden="true" />
      {text}
    </span>
  );
}

export default NoDatabaseBadge;
