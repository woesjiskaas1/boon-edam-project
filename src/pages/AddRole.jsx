import { useState } from "react";
import Button from "../components/atoms/Button";
import EscoSearch from "../components/organisms/EscoSearch";
import RoleForm from "../components/organisms/RoleForm";
import "../styles/add-employee.css";
import "../styles/tag-picker.css";
import "../styles/esco-search.css";

function AddRole({ skills, onCancel }) {
  // Is het ESCO-zoekpaneel open? Begint dicht.
  const [isEscoOpen, setIsEscoOpen] = useState(false);
  // Naam en omschrijving van de rol.
  const [formData, setFormData] = useState({ name: "", description: "" });
  // De gekozen skills. Elk item: { id, name }.
  // Een ESCO-skill die nog niet in de database staat, heeft ook "escoUri".
  const [selectedSkills, setSelectedSkills] = useState([]);
  // Het ESCO-beroep waar deze rol op is gebaseerd (alleen om te tonen).
  const [escoTitle, setEscoTitle] = useState("");

  // Eén functie voor de tekstvelden, zoals bij Medewerker toevoegen.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Een skill uit je eigen lijst kiezen (via de TagPicker).
  const handleSkillSelect = (skillId) => {
    const skill = skills.find((item) => item.id === skillId);

    setSelectedSkills((current) => [...current, skill]);
  };

  // Een skill weghalen (het kruisje op een chip).
  const handleSkillRemove = (skillId) => {
    setSelectedSkills((current) => current.filter((skill) => skill.id !== skillId));
  };

  // Een beroep uit ESCO gekozen: vul naam, omschrijving en skills in.
  const handleEscoSelect = (occupation) => {
    setFormData({
      // ESCO schrijft met een kleine letter: maak de eerste letter groot.
      name: occupation.title.charAt(0).toUpperCase() + occupation.title.slice(1),
      description: occupation.description,
    });

    setSelectedSkills((current) => {
      // Namen die al gekozen zijn, in kleine letters, om dubbele te voorkomen.
      const chosenNames = current.map((skill) => skill.name.toLowerCase());

      const escoSkills = occupation.essentialSkills
        .filter((escoSkill) => !chosenNames.includes(escoSkill.name.toLowerCase()))
        .map((escoSkill) => {
          // Bestaat deze skill al in de database (zelfde naam)? Gebruik die.
          const existing = skills.find(
            (skill) => skill.name.toLowerCase() === escoSkill.name.toLowerCase()
          );

          if (existing) {
            return existing;
          }

          // Nog niet in de database: onthoud de ESCO-uri.
          // Bij opslaan (stap 4) maakt de backend er een skill van.
          return { id: escoSkill.uri, name: escoSkill.name, escoUri: escoSkill.uri };
        });

      return [...current, ...escoSkills];
    });

    setEscoTitle(occupation.title);
    setIsEscoOpen(false);
  };

  return (
    <section className="add-employee-page">
      <div className="employees-header">
        <div>
          <h1>Rol toevoegen</h1>
          <p>Maak een rol zelf aan, of neem een beroep over uit ESCO.</p>
        </div>
        {!isEscoOpen && (
          <Button variant="secondary" onClick={() => setIsEscoOpen(true)}>
            Zoek in ESCO
          </Button>
        )}
      </div>

      {isEscoOpen && (
        <EscoSearch
          onSelect={handleEscoSelect}
          onClose={() => setIsEscoOpen(false)}
        />
      )}

      <RoleForm
        formData={formData}
        escoTitle={escoTitle}
        skills={skills}
        selectedSkills={selectedSkills}
        onChange={handleChange}
        onSkillSelect={handleSkillSelect}
        onSkillRemove={handleSkillRemove}
        onCancel={onCancel}
      />
    </section>
  );
}

export default AddRole;