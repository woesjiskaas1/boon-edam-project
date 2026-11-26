import { useState } from "react";
import Button from "../components/atoms/Button";
import EscoSearch from "../components/organisms/EscoSearch";
import RoleForm from "../components/organisms/RoleForm";
import "../styles/add-employee.css";
import "../styles/tag-picker.css";
import "../styles/esco-search.css";

// Eerste letter groot: ESCO schrijft namen met een kleine letter.
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Rol toevoegen.
// Standaard zoek je eerst in ESCO. Staat de rol er niet in, dan kun je via
// een losse knop zelf een rol aanmaken (modus "own").
function AddRole({ skills, onSave, onCancel }) {
  // "esco" = zoeken/gekozen uit ESCO (standaard), "own" = zelf aanmaken.
  const [mode, setMode] = useState("esco");
  // Het gekozen ESCO-beroep: { title, uri, code }, of null.
  const [escoOccupation, setEscoOccupation] = useState(null);
  // Boon Edam-naam (bij ESCO optioneel) of de naam van een eigen rol.
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // De gekozen skills. Elk item: { id, name }.
  // Een ESCO-skill die nog niet in de database staat, heeft ook "escoUri".
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Een skill uit je eigen lijst kiezen (via de TagPicker).
  const handleSkillSelect = (skillId) => {
    const skill = skills.find((item) => item.id === skillId);
    setSelectedSkills((current) => [...current, skill]);
  };

  // Een skill weghalen (het kruisje op een chip).
  const handleSkillRemove = (skillId) => {
    setSelectedSkills((current) => current.filter((skill) => skill.id !== skillId));
  };

  // Een beroep uit ESCO gekozen: omschrijving en skills invullen.
  const handleEscoSelect = (occupation) => {
    setEscoOccupation({
      title: capitalize(occupation.title),
      uri: occupation.uri,
      code: occupation.code,
    });
    setDescription(occupation.description);

    const escoSkills = occupation.essentialSkills.map((escoSkill) => {
      // Bestaat deze skill al in de database (zelfde ESCO-id of naam)? Gebruik die.
      const existing = skills.find(
        (skill) =>
          (skill.escoUri && skill.escoUri === escoSkill.uri) ||
          skill.name.toLowerCase() === escoSkill.name.toLowerCase()
      );
      // Anders: onthoud de ESCO-gegevens; bij opslaan wordt het een skill.
      return existing ?? { id: escoSkill.uri, name: escoSkill.name, escoUri: escoSkill.uri };
    });
    setSelectedSkills(escoSkills);
    setError("");
  };

  // Terug naar het zoeken (ander beroep kiezen of toch ESCO gebruiken).
  const startOver = () => {
    setMode("esco");
    setEscoOccupation(null);
    setName("");
    setDescription("");
    setSelectedSkills([]);
    setError("");
  };

  // Zelf een rol aanmaken, zonder ESCO.
  const startOwnRole = () => {
    startOver();
    setMode("own");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Bij ESCO mag de eigen naam leeg zijn: dan geldt de ESCO-naam.
    const finalName = name.trim() || escoOccupation?.title || "";
    if (finalName === "") {
      setError("Vul een naam in voor de rol.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await onSave({
        name: finalName,
        description: description.trim(),
        skills: selectedSkills,
        escoTitle: escoOccupation?.title ?? "",
        escoUri: escoOccupation?.uri ?? "",
        escoCode: escoOccupation?.code ?? "",
      });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Stap 1: zoeken in ESCO (standaard) ----------
  if (mode === "esco" && escoOccupation === null) {
    return (
      <section className="add-employee-page">
        <div className="employees-header">
          <div>
            <h1>Rol toevoegen</h1>
            <p>Zoek het beroep in ESCO, de Europese lijst met beroepen en skills.</p>
          </div>
        </div>

        <EscoSearch onSelect={handleEscoSelect} />

        <div className="not-in-esco">
          <div>
            <strong>Staat deze rol niet in ESCO?</strong>
            <span>Maak dan zelf een rol aan met een eigen naam. Die heeft geen ESCO-koppeling.</span>
          </div>
          <Button variant="secondary" onClick={startOwnRole}>
            Zelf een rol aanmaken
          </Button>
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={onCancel}>
            Annuleren
          </Button>
        </div>
      </section>
    );
  }

  // ---------- Stap 2: het formulier (na ESCO kiezen, of een eigen rol) ----------
  const isEsco = mode === "esco";

  return (
    <section className="add-employee-page">
      <div className="employees-header">
        <div>
          <h1>Rol toevoegen</h1>
          <p>{isEsco ? "Gebaseerd op een beroep uit ESCO." : "Een eigen rol, zonder ESCO-koppeling."}</p>
        </div>
        <Button variant="secondary" onClick={startOver}>
          {isEsco ? "Ander beroep kiezen" : "Toch zoeken in ESCO"}
        </Button>
      </div>

      <RoleForm
        escoOccupation={isEsco ? escoOccupation : null}
        name={name}
        description={description}
        skills={skills}
        selectedSkills={selectedSkills}
        error={error}
        isSaving={isSaving}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onSkillSelect={handleSkillSelect}
        onSkillRemove={handleSkillRemove}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </section>
  );
}

export default AddRole;
