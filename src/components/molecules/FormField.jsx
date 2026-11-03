import { useId } from "react";
import Input from "../atoms/Input";
import "../../styles/forms.css";

export default function FormField({
  label,
  error,
  control: Control = Input,
  className = "",
  id,
  "aria-describedby": describedBy,
  ...controlProps
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;
  const description = [describedBy, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <label className={`form-field${className ? ` ${className}` : ""}`} htmlFor={fieldId}>
      {label}
      <Control
        {...controlProps}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={description || undefined}
      />
      {error && <span id={errorId} className="form-error">{error}</span>}
    </label>
  );
}
