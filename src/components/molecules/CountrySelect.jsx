import { useEffect, useId, useRef, useState } from "react";
import CountryLabel from "./CountryLabel";
import countries from "../../data/countries";
import "../../styles/country-select.css";

function CountrySelect({ value, onChange, error }) {
  const id = useId();
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = countries.findIndex((country) => country.name === value);
  const selectedCountry = countries[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, activeIndex]);

  const openDropdown = (index = Math.max(0, selectedIndex)) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const selectCountry = (index) => {
    onChange(countries[index].name);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        if (isOpen) {
          setActiveIndex((current) => (current + direction + countries.length) % countries.length);
        } else {
          openDropdown(selectedIndex >= 0 ? selectedIndex : direction === 1 ? 0 : countries.length - 1);
        }
        break;
      }
      case "Home":
      case "End":
        event.preventDefault();
        openDropdown(event.key === "Home" ? 0 : countries.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) selectCountry(activeIndex);
        else openDropdown();
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const startIndex = isOpen ? activeIndex + 1 : selectedIndex + 1;
          for (let offset = 0; offset < countries.length; offset += 1) {
            const index = (startIndex + offset) % countries.length;
            if (countries[index].name.toLowerCase().startsWith(event.key.toLowerCase())) {
              event.preventDefault();
              openDropdown(index);
              break;
            }
          }
        }
    }
  };

  return (
    <div className="form-field">
      <label id={`${id}-label`} htmlFor={`${id}-trigger`}>Land</label>
      <div className="country-select" ref={containerRef}>
        <button
          ref={triggerRef}
          id={`${id}-trigger`}
          type="button"
          role="combobox"
          className={`country-select-trigger${isOpen ? " is-open" : ""}`}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
          aria-invalid={Boolean(error)}
          aria-required="true"
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsOpen(false)}
        >
          <span id={`${id}-value`} className={`country-select-value${selectedCountry ? "" : " is-placeholder"}`}>
            {selectedCountry ? <CountryLabel country={selectedCountry.name} /> : "Kies een land"}
          </span>
          <svg className="country-select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen && (
          <ul id={`${id}-listbox`} className="country-select-options" role="listbox" aria-labelledby={`${id}-label`}>
            {countries.map((country, index) => (
              <li
                key={country.code}
                id={`${id}-option-${index}`}
                ref={(element) => { optionRefs.current[index] = element; }}
                role="option"
                aria-selected={country.name === value}
                className={`country-select-option${activeIndex === index ? " is-active" : ""}`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectCountry(index)}
              >
                <CountryLabel country={country.name} />
                {country.name === value && (
                  <svg className="country-select-check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}
        <input type="hidden" name="country" value={value} />
      </div>
      {error && <span id={`${id}-error`} className="form-error">{error}</span>}
    </div>
  );
}

export default CountrySelect;
