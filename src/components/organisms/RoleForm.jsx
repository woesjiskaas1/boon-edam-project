import Button from "../atoms/Button";
import FormField from "../molecules/FormField";
import TagPicker from "../molecules/TagPicker";

// Het formulier van "Rol toevoegen" (alleen weergave; de logica zit in AddRole).
// Twee varianten:
// - escoOccupation gevuld: rol uit ESCO. De ESCO-naam staat vast, de
//   Boon Edam-naam is optioneel.
// - escoOccupation null: een eigen rol, zonder ESCO-koppeling.
export default function RoleForm({
  escoOccupation,
  name,
  description,
  skills,
  selectedSkills,
  error,
  isSaving,
  onNameChange,
  onDescriptionChange,
  onSkillSelect,
  onSkillRemove,
  onSubmit,
  onCancel,
}) {
  const isEsco = escoOccupation !== null;

  return (
    <form className="add-employee-form" onSubmit={onSubmit} noValidate>
      <h2 className="form-section-title">Naam</h2>
      <div className="form-stack">
        {isEsco ? (
          <>
            <div className="form-field">
              ESCO-naam (kan niet worden aangepast)
              <div className="esco-locked">
                <span className="esco-tag">ESCO</span>
                {escoOccupation.title}
                {escoOccupation.code && <small>code {escoOccupation.code}</small>}
              </div>
            </div>
            <FormField
              label="Boon Edam-naam (optioneel)"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Laat leeg om de ESCO-naam te gebruiken"
            />
            <span className="form-hint">
              Deze naam zien collega's in het portaal. De ESCO-naam staat er altijd klein boven.
            </span>
          </>
        ) : (
          <>
            <p className="esco-own-note">
              <span className="own-tag">EIGEN</span>
              Deze rol staat niet in ESCO en heeft dus geen ESCO-naam of ESCO-id.
            </p>
            <FormField
              label="Naam van de rol"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Bijv. Draaideur-specialist"
            />
          </>
        )}

        <FormField
          control="textarea"
          label="Omschrijving (optioneel)"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
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

      {error && <p className="form-error form-save-error" role="alert">{error}</p>}

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? "Opslaan..." : "Rol opslaan"}
        </Button>
      </div>
    </form>
  );
}
