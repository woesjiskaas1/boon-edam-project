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

// Zet een rol uit de database om naar de vorm van de front-end.
// Zelfde vorm als eerst in src/data/employeeRoles.js.
// "name" is de naam die we overal tonen: de Boon Edam-naam, of de
// ESCO-naam als er geen eigen naam is. De ESCO-velden zijn leeg bij een
// rol die zelf is aangemaakt (niet uit ESCO).
const roleFromDatabase = (row) => ({
  id: row.job_role_id,
  name: row.name,
  description: row.description ?? "",
  defaultSkills: row.skills.map((skill) => skill.skill_id),
  escoTitle: row.esco_title ?? "",
  escoUri: row.esco_uri ?? "",
  escoCode: row.esco_code ?? "",
});

// GET: haalt alle rollen op, met hun standaard skills.
export async function getJobRoles() {
  const response = await fetch(`${API_URL}/job-roles`);

  if (!response.ok) {
    throw new Error("De rollen konden niet worden opgehaald.");
  }

  const rows = await response.json();
  return rows.map(roleFromDatabase);
}

// GET: haalt alle skills op.
export async function getSkills() {
  const response = await fetch(`${API_URL}/skills`);

  if (!response.ok) {
    throw new Error("De skills konden niet worden opgehaald.");
  }

  const rows = await response.json();

  return rows.map(skillFromDatabase);
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
// Zet een skill uit de database om naar de vorm van de front-end.
// Net als bij rollen: escoTitle en escoUri zijn leeg als de skill niet uit ESCO komt.
function skillFromDatabase(row) {
  return {
    id: row.skill_id,
    name: row.name,
    category: row.category ?? "",
    escoTitle: row.esco_title ?? "",
    escoUri: row.esco_id ?? "",
  };
}

// POST: maakt een nieuwe skill aan (Skills-pagina).
export async function createSkill(name) {
  const row = await sendJson("POST", `${API_URL}/skills`, { name: name });
  return skillFromDatabase(row);
}

// PATCH: wijzigt de naam van een skill.
export async function updateSkill(skillId, name) {
  const row = await sendJson("PATCH", `${API_URL}/skills/${skillId}`, { name: name });
  return skillFromDatabase(row);
}

// PATCH: zet een skill uit (is_active = false). Hij verdwijnt dan uit
// GET /skills, maar bestaande koppelingen blijven heel.
export async function deactivateSkill(skillId) {
  const row = await sendJson("PATCH", `${API_URL}/skills/${skillId}`, { is_active: false });
  return skillFromDatabase(row);
}

// POST: geeft een medewerker een rol.
// De backend kopieert dan ook de standaard skills van die rol naar de medewerker.
// Let op: de backend wil het database-nummer (databaseId), niet "EMP001".
export async function addEmployeeToRole(employeeDatabaseId, roleId) {
  await sendJson("POST", `${API_URL}/employees/${employeeDatabaseId}/job-roles`, {
    job_role_id: roleId,
  });
}

// PUT: vervangt de standaard skills van een rol door een nieuwe lijst.
// Je stuurt dus altijd de hele lijst mee, niet alleen wat er verandert.
// Let op: deze route moet Alex nog bouwen in de backend.
export async function updateJobRoleSkills(roleId, skillIds) {
  const row = await sendJson("PUT", `${API_URL}/job-roles/${roleId}/skills`, {
    skills: skillIds,
  });
  return roleFromDatabase(row);
}

// DELETE: haalt een rol weg bij een medewerker.
// Let op: deze route moet Alex nog bouwen in de backend.
export async function removeEmployeeFromRole(employeeDatabaseId, roleId) {
  const response = await fetch(`${API_URL}/employees/${employeeDatabaseId}/job-roles/${roleId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    // De backend stuurt meestal { error: "..." }; lukt dat niet, een eigen melding.
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "De rol kon niet worden weggehaald.");
  }
}

// POST: maakt een skill uit ESCO aan, of geeft de bestaande terug als die
// er al is (zelfde ESCO-id). De ESCO-naam wordt ook de gewone naam.
// Let op: deze route moet Alex nog bouwen in de backend.
export async function createEscoSkill(escoSkill) {
  const row = await sendJson("POST", `${API_URL}/skills/esco`, {
    name: escoSkill.name,
    esco_id: escoSkill.escoUri,
    esco_title: escoSkill.name,
  });
  return skillFromDatabase(row);
}

// POST: maakt een nieuwe rol aan.
// 1. Skills uit ESCO die nog niet in de database staan, eerst aanmaken.
// 2. Dan de rol zelf, met de id's van alle skills.
// Let op: deze routes moet Alex nog bouwen in de backend.
export async function createJobRole(roleData) {
  const skillIds = [];
  for (const skill of roleData.skills) {
    if (skill.escoUri && typeof skill.id !== "number") {
      const created = await createEscoSkill(skill);
      skillIds.push(created.id);
    } else {
      skillIds.push(skill.id);
    }
  }

  const row = await sendJson("POST", `${API_URL}/job-roles`, {
    name: roleData.name,
    description: roleData.description || null,
    skills: skillIds,
    esco_uri: roleData.escoUri || null,
    esco_code: roleData.escoCode || null,
    esco_title: roleData.escoTitle || null,
  });
  return roleFromDatabase(row);
}

// PATCH: geeft een rol een andere (Boon Edam-)naam.
// Let op: deze route moet Alex nog bouwen in de backend.
export async function updateJobRoleName(roleId, name) {
  const row = await sendJson("PATCH", `${API_URL}/job-roles/${roleId}`, { name: name });
  return roleFromDatabase(row);
}

// ---------- Eén medewerker bewerken ----------

// Het niveau van een skill: 1 (beginner) t/m 5 (expert).
export const SKILL_LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Basis" },
  { value: 3, label: "Gevorderd" },
  { value: 4, label: "Ervaren" },
  { value: 5, label: "Expert" },
];

// GET: de skills van één medewerker, met niveau: [{ id, level }].
export async function getEmployeeSkills(employeeDatabaseId) {
  const response = await fetch(`${API_URL}/employee_skills/${employeeDatabaseId}`);
  if (!response.ok) {
    throw new Error("De skills van deze medewerker konden niet worden opgehaald.");
  }
  const rows = await response.json();
  return rows.map((row) => ({ id: row.skill_id, level: row.skill_level ?? 1 }));
}

// GET: de skills van ALLE medewerkers in één keer (voor de skills-matrix).
// Geeft een object terug: { databaseId: { skillId: niveau } }.
export async function getAllEmployeeSkills() {
  const response = await fetch(`${API_URL}/employee_skills`);
  if (!response.ok) {
    throw new Error("De skills van de medewerkers konden niet worden opgehaald.");
  }
  const rows = await response.json();
  const result = {};
  for (const row of rows) {
    result[row.employee_id] ??= {};
    result[row.employee_id][row.skill_id] = row.skill_level ?? 1;
  }
  return result;
}

// POST: geeft een medewerker een extra skill (niveau 1).
export async function addSkillToEmployee(employeeDatabaseId, skillId) {
  await sendJson("POST", `${API_URL}/employees/${employeeDatabaseId}/skills`, {
    skill_id: skillId,
  });
}

// PATCH: wijzigt het niveau (1-5) van een skill bij een medewerker.
// Let op: deze route moet Alex nog bouwen in de backend.
export async function updateEmployeeSkillLevel(employeeDatabaseId, skillId, level) {
  await sendJson("PATCH", `${API_URL}/employees/${employeeDatabaseId}/skills/${skillId}`, {
    skill_level: level,
  });
}

// DELETE: haalt een skill weg bij een medewerker.
export async function removeSkillFromEmployee(employeeDatabaseId, skillId) {
  const response = await fetch(`${API_URL}/employees/${employeeDatabaseId}/skills/${skillId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "De skill kon niet worden weggehaald.");
  }
}

// PATCH: wijzigt de gegevens van een medewerker (naam, e-mail, land, vestiging).
// Let op: deze route moet Alex nog bouwen in de backend.
export async function updateEmployee(employeeDatabaseId, formData) {
  const row = await sendJson("PATCH", `${API_URL}/employees/${employeeDatabaseId}`, {
    first_name: formData.firstName.trim(),
    middle_name: formData.middleName.trim() || null,
    last_name: formData.lastName.trim(),
    email: formData.email.trim(),
    country: formData.country,
    location: formData.location || null,
  });
  return fromDatabase(row);
}
