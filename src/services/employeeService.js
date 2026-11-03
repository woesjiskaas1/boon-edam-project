// Alle verzoeken over medewerkers staan in dit bestand.
// De pagina's roepen alleen deze functies aan, en weten niet hoe de backend werkt.

// Vite stuurt /api door naar de PHP-backend (zie vite.config.js).
const API_URL = "/api";

// De database gebruikt andere veldnamen dan de front-end.
// Deze functie zet één rij uit de database om naar de vorm die de pagina's gebruiken.
const fromDatabase = (row) => ({
  id: row.employee_number,
  name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
  firstName: row.first_name ?? "",
  lastName: row.last_name ?? "",
  email: row.email ?? "",
  country: row.country ?? "",
  address: row.adress ?? "",
  phone: row.phone ?? "",
  // Deze velden bestaan nog niet in de database.
  birthDate: "",
  role: "",
  skills: [],
});

// GET: haalt alle medewerkers op.
export async function getEmployees() {
  const response = await fetch(`${API_URL}/employees`);

  if (!response.ok) {
    throw new Error("De medewerkers konden niet worden opgehaald.");
  }

  const rows = await response.json();
  return rows.map(fromDatabase);
}