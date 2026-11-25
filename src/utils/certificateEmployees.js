export function getCertificateEmployees(certificate, employees, isExample = false) {
  const employeeKey = isExample ? "id" : "databaseId";
  const employeesById = new Map(employees
    .filter((employee) => employee[employeeKey] != null && employee[employeeKey] !== "")
    .map((employee) => [String(employee[employeeKey]), employee]));

  return [...new Set((certificate.employeeIds || []).map(String))]
    .map((id) => ({ id, employee: employeesById.get(id) || null }))
    .sort((first, second) => (first.employee?.name || first.id)
      .localeCompare(second.employee?.name || second.id, "nl", {
        sensitivity: "base",
        numeric: true,
      }));
}
