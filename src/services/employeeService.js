// Alle verzoeken over medewerkers staan in dit bestand.
// De pagina's roepen alleen deze functies aan, en weten niet hoe de backend werkt.

// Vite stuurt /api door naar de PHP-backend (zie vite.config.js).
const API_URL = "/api";

// De database gebruikt andere veldnamen dan de front-end.
// Deze functie zet één rij uit de database om naar de vorm die de pagina's gebruiken.
const fromDatabase = (row) => ({
  id: row.employee_number,
  // Het nummer uit de database. Nodig voor de verzoeken over rollen en skills.
  databaseId: row.employee_id,
  // Alleen de delen die ingevuld zijn, met één spatie ertussen.
  name: [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" "),
  firstName: row.first_name ?? "",
  middleName: row.middle_name ?? "",
  lastName: row.last_name ?? "",
  email: row.email ?? "",
  country: row.country ?? "",
  location: row.location ?? "",
  // Rollen en skills staan in andere tabellen; getEmployees vult de rollen hieronder aan.
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

  // De rollen staan in een andere tabel (employee_job_role).
  // Die halen we voor alle medewerkers in één keer op.
  const rolesResponse = await fetch(`${API_URL}/employee-job-roles`);

  if (!rolesResponse.ok) {
    throw new Error("De rollen van de medewerkers konden niet worden opgehaald.");
  }

  const roleLinks = await rolesResponse.json();

  return rows.map((row) => {
    // Alleen de rollen van deze medewerker.
    const employeeRoles = roleLinks.filter(
      (link) => link.employee_id === row.employee_id
    );

    return {
      ...fromDatabase(row),
      roleIds: employeeRoles.map((link) => link.job_role_id),
      role: employeeRoles.map((link) => link.name).join(", "),
    };
  });
}

// GET: haalt alle rollen op, met hun standaard skills.
export async function getJobRoles() {
  const response = await fetch(`${API_URL}/job-roles`);

  if (!response.ok) {
    throw new Error("De rollen konden niet worden opgehaald.");
  }

  const rows = await response.json();

  // Zelfde vorm als eerst in src/data/employeeRoles.js,
  // zodat de rest van de code niet hoeft te veranderen.
  return rows.map((row) => ({
    id: row.job_role_id,
    name: row.name,
    description: row.description ?? "",
    defaultSkills: row.skills.map((skill) => skill.skill_id),
  }));
}

// GET: haalt alle skills op.
export async function getSkills() {
  const response = await fetch(`${API_URL}/skills`);

  if (!response.ok) {
    throw new Error("De skills konden niet worden opgehaald.");
  }

  const rows = await response.json();

  // Zelfde vorm als eerst in src/data/skills.js.
  return rows.map((row) => ({
    id: row.skill_id,
    name: row.name,
  }));
}

// Stuurt een verzoek met JSON naar de backend en geeft het antwoord terug.
// Gaat het mis, dan gooien we een fout met de melding van de backend.
async function sendJson(method, url, body) {
  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Er ging iets mis.");
  }

  return data;
}

// POST: maakt een nieuwe medewerker, met zijn rollen en skills.
// Dit zijn een paar verzoeken na elkaar:
// 1. de medewerker zelf opslaan
// 2. elke rol koppelen (de backend kopieert dan de standaard skills)
// 3. skills toevoegen die de gebruiker extra heeft gekozen
// 4. standaard skills weghalen die de gebruiker heeft verwijderd
export async function createEmployee(formData) {
  // 1. De medewerker zelf. De database gebruikt snake_case.
  const row = await sendJson("POST", `${API_URL}/employees`, {
    first_name: formData.firstName.trim(),
    middle_name: formData.middleName.trim() || null,
    last_name: formData.lastName.trim(),
    email: formData.email.trim(),
    country: formData.country,
    location: formData.location || null,
  });

  const employeeId = row.employee_id;

  // 2. De rollen. Elk antwoord is de lijst skills die de medewerker nu heeft.
  let currentSkills = [];
  for (const roleId of formData.roleIds) {
    currentSkills = await sendJson("POST", `${API_URL}/employees/${employeeId}/job-roles`, {
      job_role_id: roleId,
    });
  }
  const currentSkillIds = currentSkills.map((skill) => skill.skill_id);

  // 3. Gekozen skills die er nog niet bij staan: toevoegen.
  for (const skillId of formData.skillIds) {
    if (!currentSkillIds.includes(skillId)) {
      await sendJson("POST", `${API_URL}/employees/${employeeId}/skills`, {
        skill_id: skillId,
      });
    }
  }

  // 4. Skills die de backend kopieerde, maar die de gebruiker niet wil: weghalen.
  for (const skillId of currentSkillIds) {
    if (!formData.skillIds.includes(skillId)) {
      const response = await fetch(`${API_URL}/employees/${employeeId}/skills/${skillId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Een skill kon niet worden weggehaald.");
      }
    }
  }

  return fromDatabase(row);
}