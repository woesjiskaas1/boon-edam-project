// Certificaattypen en medewerkerkoppelingen uit de bestaande PHP-backend.
export async function getCertificates() {
  const [certificatesResponse, linksResponse] = await Promise.all([
    fetch("/api/certificates"),
    fetch("/api/employee_certificates"),
  ]);

  if (!certificatesResponse.ok || !linksResponse.ok) {
    throw new Error("De certificaten konden niet worden opgehaald.");
  }

  const [rows, links] = await Promise.all([
    certificatesResponse.json(),
    linksResponse.json(),
  ]);

  return rows.map((row) => ({
    id: String(row.certificate_type_id),
    name: row.name,
    description: row.description ?? "",
    category: row.category ?? "",
    // Eén medewerker kan meerdere exemplaren van hetzelfde certificaat hebben.
    employeeIds: [...new Set(links
      .filter((link) => String(link.certificate_type_id) === String(row.certificate_type_id))
      .map((link) => String(link.employee_id)))],
  }));
}
