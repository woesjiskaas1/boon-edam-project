import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "../components/atoms/Button";
import ConfirmDialog from "../components/organisms/ConfirmDialog";
import EmployeeDetails from "../components/organisms/EmployeeDetails";
import EmployeeEditForm from "../components/organisms/EmployeeEditForm";
import EmployeeRoles from "../components/organisms/EmployeeRoles";
import EmployeeSkillGap from "../components/organisms/EmployeeSkillGap";
import EmployeeSkills from "../components/organisms/EmployeeSkills";
import {
  getEmployeeSkills,
  addSkillToEmployee,
  removeSkillFromEmployee,
  updateEmployeeSkillLevel,
} from "../services/employeeService";
import "../styles/employee.css";

// Detailpagina van één medewerker.
// Je kunt hier de gegevens bewerken, rollen geven of weghalen, en skills
// toevoegen of weghalen. Weghalen gaat altijd via een bevestigingsvenster.
// De pagina bewaart de state en praat met App; de kaarten zelf zijn organisms.
function Employee({
  employees,
  skills,
  jobRoles,
  countries,
  locations,
  onBack,
  onUpdate,
  onAddRole,
  onRemoveRole,
}) {
  const { employeeId } = useParams();
  const employee = employees.find((item) => item.id === employeeId);

  // Hooks altijd bovenaan, vóór een "return".
  // Gegevens bewerken: null = niet aan het bewerken.
  const [editForm, setEditForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");
  // Skills van deze medewerker, met niveau: [{ id, level }], uit de database.
  const [skillRows, setSkillRows] = useState([]);
  const [skillsError, setSkillsError] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  // Rol toevoegen: het id uit de keuzelijst.
  const [roleToAdd, setRoleToAdd] = useState("");
  const [roleError, setRoleError] = useState("");
  // Wat je wilt weghalen; zolang dit niet null is, staat het venster open.
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const databaseId = employee?.databaseId;

  // De skills ophalen zodra we weten welke medewerker het is.
  // [databaseId] = opnieuw ophalen als je naar een andere medewerker gaat.
  useEffect(() => {
    if (!databaseId) {
      return;
    }
    getEmployeeSkills(databaseId)
      .then((rows) => setSkillRows(rows))
      .catch((error) => setSkillsError(error.message));
  }, [databaseId]);

  const backButton = (
    <Button className="employee-back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Terug naar medewerkers
    </Button>
  );

  if (!employee) {
    return (
      <section className="employee-page">
        {backButton}
        <div className="employees-header">
          <div>
            <h1>{employees.length === 0 ? "Medewerker laden..." : "Medewerker niet gevonden"}</h1>
            <p>Ga terug naar het overzicht en selecteer een medewerker.</p>
          </div>
        </div>
      </section>
    );
  }

  // Rollen en skills van deze medewerker, met naam.
  const employeeRoles = jobRoles.filter((role) => employee.roleIds?.includes(role.id));
  const otherRoles = jobRoles.filter((role) => !employee.roleIds?.includes(role.id));
  const skillIds = skillRows.map((row) => row.id);
  const levelOf = (skillId) => skillRows.find((row) => row.id === skillId)?.level ?? 1;
  const employeeSkills = skills.filter((skill) => skillIds.includes(skill.id));

  // Gap-analyse: welke standaard skills van zijn rollen heeft hij (nog) niet?
  const requiredSkillIds = [...new Set(employeeRoles.flatMap((role) => role.defaultSkills))];
  const missingSkills = skills.filter(
    (skill) => requiredSkillIds.includes(skill.id) && !skillIds.includes(skill.id)
  );

  // Suggesties om een skill toe te voegen (zoals op de rolpagina).
  const skillSearchText = skillSearch.trim().toLowerCase();
  const skillSuggestions =
    skillSearchText === ""
      ? []
      : skills
          .filter((skill) => !skillIds.includes(skill.id))
          .filter((skill) => skill.name.toLowerCase().includes(skillSearchText))
          .slice(0, 8);

  // ---------- Gegevens bewerken ----------
  const startEditing = () => {
    setEditForm({
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      email: employee.email,
      country: employee.country,
      location: employee.location,
    });
    setEditError("");
  };

  const changeField = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    if (editForm.firstName.trim() === "" || editForm.lastName.trim() === "") {
      setEditError("Vul een voornaam en achternaam in.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setEditError("Vul een geldig e-mailadres in.");
      return;
    }
    setIsSaving(true);
    setEditError("");
    try {
      await onUpdate(employee, editForm);
      setEditForm(null);
    } catch (error) {
      setEditError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Rollen ----------
  const addRole = async () => {
    const role = jobRoles.find((item) => String(item.id) === roleToAdd);
    if (!role) {
      return;
    }
    setRoleError("");
    try {
      await onAddRole(employee, role);
      setRoleToAdd("");
      // De backend geeft de medewerker ook de standaard skills van de rol.
      setSkillRows(await getEmployeeSkills(databaseId));
    } catch (error) {
      setRoleError(error.message);
    }
  };

  // ---------- Skills ----------
  const addSkill = async (skillId) => {
    setSkillsError("");
    try {
      await addSkillToEmployee(databaseId, skillId);
      setSkillRows(await getEmployeeSkills(databaseId));
      setSkillSearch("");
    } catch (error) {
      setSkillsError(error.message);
    }
  };

  // Niveau aanpassen. Pas na een "ja" van de backend tonen we het nieuwe niveau.
  const changeLevel = async (skillId, level) => {
    setSkillsError("");
    try {
      await updateEmployeeSkillLevel(databaseId, skillId, level);
      setSkillRows((current) =>
        current.map((row) => (row.id === skillId ? { ...row, level } : row))
      );
    } catch (error) {
      setSkillsError(error.message);
    }
  };

  // ---------- Weghalen (na bevestigen) ----------
  const confirmRemoval = async () => {
    setIsRemoving(true);
    try {
      if (pendingRemoval.type === "role") {
        setRoleError("");
        await onRemoveRole(employee, pendingRemoval.item);
      } else {
        setSkillsError("");
        await removeSkillFromEmployee(databaseId, pendingRemoval.item.id);
        setSkillRows((current) => current.filter((row) => row.id !== pendingRemoval.item.id));
      }
    } catch (error) {
      if (pendingRemoval.type === "role") {
        setRoleError(error.message);
      } else {
        setSkillsError(error.message);
      }
    } finally {
      setIsRemoving(false);
      setPendingRemoval(null);
    }
  };

  return (
    <section className="employee-page" aria-labelledby="employee-page-title">
      {backButton}

      <header className="employees-header">
        <div>
          <h1 id="employee-page-title">Medewerker</h1>
          <p>Bekijk en bewerk de gegevens, rollen en skills van deze medewerker.</p>
        </div>
        {editForm === null && (
          <Button variant="secondary" onClick={startEditing}>
            Gegevens bewerken
          </Button>
        )}
      </header>

      <EmployeeDetails
        employee={employee}
        editForm={editForm && (
          <EmployeeEditForm
            values={editForm}
            countries={countries}
            locations={locations}
            error={editError}
            isSaving={isSaving}
            onChange={changeField}
            onCountryChange={(country) =>
              setEditForm((current) => ({ ...current, country, location: "" }))
            }
            onSubmit={saveDetails}
            onCancel={() => setEditForm(null)}
          />
        )}
      >
        <EmployeeRoles
          roles={employeeRoles}
          otherRoles={otherRoles}
          roleToAdd={roleToAdd}
          error={roleError}
          onRoleToAddChange={setRoleToAdd}
          onAdd={addRole}
          onRequestRemove={(role) => setPendingRemoval({ type: "role", item: role })}
        />

        {requiredSkillIds.length > 0 && (
          <EmployeeSkillGap
            requiredCount={requiredSkillIds.length}
            missingSkills={missingSkills}
            roleCount={employeeRoles.length}
            onAddSkill={addSkill}
          />
        )}

        <EmployeeSkills
          skills={employeeSkills}
          levelOf={levelOf}
          search={skillSearch}
          suggestions={skillSuggestions}
          error={skillsError}
          onSearchChange={setSkillSearch}
          onAdd={addSkill}
          onLevelChange={changeLevel}
          onRequestRemove={(skill) => setPendingRemoval({ type: "skill", item: skill })}
        />
      </EmployeeDetails>

      {pendingRemoval && (
        <ConfirmDialog
          title={pendingRemoval.type === "role" ? "Rol weghalen?" : "Skill weghalen?"}
          isBusy={isRemoving}
          onConfirm={confirmRemoval}
          onClose={() => setPendingRemoval(null)}
        >
          <p>
            <strong>{employee.name}</strong> heeft daarna de{" "}
            {pendingRemoval.type === "role" ? "rol" : "skill"}{" "}
            <strong>{pendingRemoval.item.name}</strong> niet meer.
          </p>
        </ConfirmDialog>
      )}
    </section>
  );
}

export default Employee;
