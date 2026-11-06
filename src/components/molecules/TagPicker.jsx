// Een zoekveld met "chips": de gekozen items staan als chip in het veld,
// en onder het veld staat een lijst met items die je nog kunt kiezen.
// Voor nu alleen het uiterlijk: zoeken, kiezen en verwijderen komt later.
function TagPicker({
  label,
  hint,
  placeholder,
  selectedItems,
  options,
  onSelect,
  onRemove,
  error,
}) {
  const selectedIds = new Set(selectedItems.map((item) => item.id));

  return (
    <div className="tag-picker-field">
      <span className="tag-picker-label">{label}</span>
      {hint && <p className="tag-picker-hint">{hint}</p>}

      <div className="tag-picker">
        <ul className="tag-picker-chips">
          {selectedItems.map((item) => (
            <li key={item.id} className="tag-picker-chip">
              {item.name}
              <button
                type="button"
                className="tag-picker-chip-remove"
                aria-label={`${item.name} verwijderen`}
                onClick={() => onRemove?.(item.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          className="tag-picker-input"
          placeholder={placeholder}
          aria-label={label}
        />

        {options.length > 0 && (
          <ul className="tag-picker-menu">
            {options.map((item) => (
              !selectedIds.has(item.id) && (
                <li key={item.id} className="tag-picker-option">
                  <button type="button" onClick={() => onSelect?.(item.id)}>
                    {item.name}
                  </button>
                </li>
              )
            ))}
          </ul>
        )}
      </div>

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default TagPicker;