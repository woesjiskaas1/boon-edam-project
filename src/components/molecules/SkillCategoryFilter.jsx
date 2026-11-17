import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../atoms/Button";

export default function SkillCategoryFilter({ skills, categories, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();
  const titleId = useId();
  const options = [
    { value: "", label: "Alle categorieën", count: skills.length },
    {
      value: "uncategorized",
      label: "Zonder categorie",
      count: skills.filter((skill) => !skill.category?.trim()).length,
    },
    ...categories.map((category) => ({
      value: `category:${category}`,
      label: category,
      count: skills.filter((skill) => skill.category?.trim() === category).length,
    })),
  ];
  const selectedLabel = options.find((option) => option.value === value)?.label;

  // De lijst staat buiten de scrollbare tabel, zodat hij niet wordt afgeknipt.
  useLayoutEffect(() => {
    if (!isOpen) return;

    const positionPanel = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const anchor = trigger.getBoundingClientRect();
      if (anchor.bottom < 0 || anchor.top > window.innerHeight) {
        setIsOpen(false);
        return;
      }

      const margin = 12;
      const gap = 8;
      const below = window.innerHeight - anchor.bottom - gap - margin;
      const above = anchor.top - gap - margin;
      panel.style.maxHeight = `${Math.max(0, Math.max(below, above))}px`;
      const bounds = panel.getBoundingClientRect();
      const placeBelow = below >= bounds.height || below >= above;
      const top = placeBelow ? anchor.bottom + gap : anchor.top - bounds.height - gap;
      panel.style.top = `${Math.max(margin, top)}px`;
      panel.style.left = `${Math.max(margin, Math.min(anchor.left, window.innerWidth - bounds.width - margin))}px`;
    };

    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    return () => {
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen) return;

    panelRef.current?.querySelector("input:checked")?.focus({ preventScroll: true });

    const handleOutsideClick = (event) => {
      if (!triggerRef.current?.contains(event.target) && !panelRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const closePanel = () => {
    setIsOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const handleSelect = (category) => {
    onChange(category);
    closePanel();
  };

  return (
    <>
      <Button
        ref={triggerRef}
        className={`skills-category-trigger${value ? " is-filtered" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? panelId : undefined}
        aria-label={value ? `Categorieën filteren, huidige categorie: ${selectedLabel}` : "Categorieën filteren"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>Categorieën</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M3 5h18M6 12h12M10 19h4" />
        </svg>
        {value && <span className="skills-category-indicator" aria-hidden="true">1</span>}
      </Button>

      {isOpen && createPortal(
        <div
          ref={panelRef}
          id={panelId}
          className="skills-category-popover"
          role="dialog"
          aria-labelledby={titleId}
        >
          <div className="skills-category-popover-header">
            <h2 id={titleId}>Filter op categorie</h2>
            <Button className="skills-category-close" onClick={closePanel} aria-label="Categoriefilter sluiten">
              <span aria-hidden="true">×</span>
            </Button>
          </div>
          <fieldset className="skills-category-options">
            <legend className="skills-visually-hidden">Categorie</legend>
            {options.map((option) => (
              <label key={option.value} className="skills-category-option">
                <input
                  type="radio"
                  name={panelId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleSelect(option.value)}
                />
                <span>{option.label}</span>
                <span className="skills-category-count">{option.count}</span>
              </label>
            ))}
          </fieldset>
        </div>,
        document.body
      )}
    </>
  );
}
