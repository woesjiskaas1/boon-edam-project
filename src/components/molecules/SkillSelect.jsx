import Input from "../atoms/Input";

export default function SkillSelect({ skills, selectedIds, onToggle }) {
  return (
    <fieldset className="skills-fieldset">
      <legend>Skills</legend>
      <p className="skills-hint">
        Bij het kiezen van een rol worden de standaard skills al aangevinkt. Je kunt ze hier aanpassen.
      </p>
      <div className="skills-list">
        {skills.map((skill) => (
          <label key={skill.id} className="skill-option">
            <Input type="checkbox" checked={selectedIds.includes(skill.id)} onChange={() => onToggle(skill.id)} />
            {skill.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
