import Button from "../atoms/Button";
import FormField from "../molecules/FormField";
import TagPicker from "../molecules/TagPicker";

export default function RoleForm({
  formData,
  escoTitle,
  skills,
  selectedSkills,
  onChange,
  onSkillSelect,
  onSkillRemove,
  onCancel,
}) {
  return (
    <form className="add-employee-form" noValidate>
      {escoTitle && (
        <p className="esco-chosen">
          Gebaseerd op het ESCO-beroep <strong>{escoTitle}</strong>. Je kunt alles nog aanpassen.
        </p>
      )}

      <h2 className="form-section-title">Rol</h2>
      <div className="form-stack">
        <FormField
          label="Naam van de rol"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Bijv. Servicemonteur"
        />
        <FormField
          control="textarea"
          label="Omschrijving (optioneel)"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={3}
        />
      </div>

      <h2 className="form-section-title">Standaard skills</h2>
      <TagPicker
        label="Skills"
        hint="Iedereen die deze rol krijgt, krijgt deze skills standaard. Skills uit ESCO die nog niet bestaan, worden bij opslaan aangemaakt."
        placeholder="Zoek een skill..."
        selectedItems={selectedSkills}
        options={skills}
        onSelect={onSkillSelect}
        onRemove={onSkillRemove}
      />

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" variant="primary">
          Rol opslaan
        </Button>
      </div>
    </form>
  );
}
