import { useEffect, useId, useMemo, useRef, useState } from "react";
import Input from "../atoms/Input";
import { loadLocalEscoSkills, loadLocalEscoCategories, searchRemoteEscoSkills, searchRemoteEscoCategories } from "../../services/escoService";
import { buildEscoIndex, findEscoSuggestions } from "../../utils/escoMatching";

const EMPTY_OPTIONS = [];

export default function EscoAutocomplete({ kind = "skill", value, selectedItem, existingOptions = EMPTY_OPTIONS, onChange, onSelect, error, ref }) {
  const isCategory = kind === "category";
  const itemLabel = isCategory ? "categorie" : "vaardigheid";
  const listLabel = isCategory ? "ESCO-categorieën" : "ESCO-vaardigheden";
  const id = useId();
  const fieldRef = useRef(null);
  const optionRefs = useRef([]);
  const [catalog, setCatalog] = useState([]);
  const [localStatus, setLocalStatus] = useState("loading");
  const [remote, setRemote] = useState({ query: "", skills: [], status: "idle" });
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const localIndex = useMemo(() => buildEscoIndex(catalog), [catalog]);
  const remoteIndex = useMemo(() => buildEscoIndex(remote.skills), [remote.skills]);
  const customOptions = useMemo(() => {
    const officialNames = new Set(catalog.map((item) => item.name.toLocaleLowerCase("nl")));
    return existingOptions.filter((name) => !officialNames.has(name.toLocaleLowerCase("nl")))
      .map((name) => ({ name, uri: `local:${name}`, isCustom: true }));
  }, [existingOptions, catalog]);
  const customIndex = useMemo(() => buildEscoIndex(customOptions), [customOptions]);
  const suggestions = useMemo(() => {
    if (isCategory && !value.trim()) {
      return [...catalog.filter((item) => !item.broaderUris?.length), ...customOptions].slice(0, 12);
    }
    return findEscoSuggestions([
      ...localIndex, ...customIndex, ...(remote.query === value ? remoteIndex : []),
    ], value);
  }, [isCategory, catalog, customOptions, localIndex, customIndex, remoteIndex, remote.query, value]);
  const expanded = isOpen && !selectedItem && suggestions.length > 0;

  useEffect(() => {
    // Sluit na de klik, zodat het inklappen een aangeklikte formulierknop niet verplaatst.
    const handleOutsideClick = (event) => {
      if (!fieldRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadCatalog = isCategory ? loadLocalEscoCategories : loadLocalEscoSkills;
    loadCatalog().then((skills) => {
      if (!cancelled) {
        setCatalog(skills);
        setLocalStatus("ready");
      }
    }).catch(() => { if (!cancelled) setLocalStatus("error"); });
    return () => { cancelled = true; };
  }, [isCategory]);

  useEffect(() => {
    if (!isOpen || selectedItem || value.trim().length < 2) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setRemote({ query: value, skills: [], status: "loading" });
      const searchCatalog = isCategory ? searchRemoteEscoCategories : searchRemoteEscoSkills;
      searchCatalog(value, { signal: controller.signal }).then((skills) => {
        if (!controller.signal.aborted) setRemote({ query: value, skills, status: "ready" });
      }).catch(() => {
        if (!controller.signal.aborted) setRemote({ query: value, skills: [], status: "error" });
      });
    }, 300);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [value, isOpen, selectedItem, isCategory]);

  useEffect(() => {
    if (expanded && activeIndex >= 0) optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [expanded, activeIndex]);

  const selectSuggestion = (suggestion) => {
    onSelect({ name: suggestion.name, uri: suggestion.isCustom ? null : suggestion.uri, code: suggestion.code });
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length && !selectedItem) {
      event.preventDefault();
      setIsOpen(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => !expanded || current < 0
        ? (direction === 1 ? 0 : suggestions.length - 1)
        : (current + direction + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter" && expanded && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (event.key === "Tab") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const remoteStatus = remote.query === value ? remote.status : "idle";
  let hint = isCategory
    ? "Zoek een ESCO-categorie of kies een eigen categorie. Laat leeg voor Zonder categorie."
    : "Typ minstens 2 letters. Kies een ESCO-suggestie of gebruik je eigen naam.";
  if (selectedItem) hint = `Gekoppeld aan de officiële ESCO-${itemLabel}${selectedItem.code ? ` (${selectedItem.code})` : ""}.`;
  else if (isOpen && value.trim().length >= 2) {
    if (localStatus === "error" && remoteStatus === "error") hint = "ESCO-suggesties zijn niet beschikbaar. Je kunt je eigen naam opslaan.";
    else if (remoteStatus === "error" && localStatus === "ready") hint = "ESCO is tijdelijk niet bereikbaar. Je zoekt in de lokale ESCO-lijst.";
    else if (suggestions.length) hint = `${suggestions.length} suggesties. Kies met de pijltjestoetsen en Enter, of klik op een suggestie.`;
    else if (localStatus === "loading" || remoteStatus === "loading" || remoteStatus === "idle") hint = "ESCO-suggesties zoeken…";
    else hint = `Geen passende ESCO-${itemLabel} gevonden. Probeer een andere term of sla je eigen naam op.`;
  }

  return (
    <div ref={fieldRef} className="esco-skill-field">
      <div className="esco-skill-control">
        <label className="form-field" htmlFor={id}>
          {isCategory ? "Categorie" : "Naam van de vaardigheid"}
          <Input
            ref={ref}
            id={id}
            name={isCategory ? "category" : "skillName"}
            value={value}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={`${id}-listbox`}
            aria-activedescendant={expanded && suggestions[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
            aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
            aria-invalid={Boolean(error)}
            autoComplete="off"
            spellCheck={false}
            placeholder={isCategory ? "Bijvoorbeeld: communicatie of werken met computers" : "Bijvoorbeeld: JavaScript of onderhoud"}
            required={!isCategory}
            onChange={(event) => {
              onChange(event.target.value);
              setActiveIndex(-1);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setActiveIndex(-1)}
            onKeyDown={handleKeyDown}
          />
        </label>
        {expanded && (
          <div className="esco-suggestions">
            <p className="esco-suggestions-heading" aria-hidden="true">
              {suggestions[0].isCorrection ? "Bedoelde je…" : listLabel}
            </p>
            <ul id={`${id}-listbox`} role="listbox" aria-label={listLabel}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.uri}
                  id={`${id}-option-${index}`}
                  ref={(element) => { optionRefs.current[index] = element; }}
                  role="option"
                  aria-selected={activeIndex === index}
                  className={activeIndex === index ? "is-active" : ""}
                  onPointerDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <span>{suggestion.name}</span>
                  {suggestion.code && <small>{suggestion.code} · ESCO-categorie</small>}
                  {suggestion.isCustom && <small>Eigen categorie</small>}
                  {suggestion.matchedLabel && suggestion.matchedLabel !== suggestion.name && suggestion.matchedLabel !== suggestion.code && <small>{suggestion.matchedLabel}</small>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p id={`${id}-hint`} className={`esco-hint${selectedItem ? " is-linked" : ""}`} role="status">{hint}</p>
      {error && <span id={`${id}-error`} className="form-error">{error}</span>}
    </div>
  );
}
