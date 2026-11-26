// Toont de naam van een rol of skill.
// Komt hij uit ESCO, dan staat de originele ESCO-naam er klein boven,
// met een blauw "ESCO"-label. Zelf aangemaakt? Dan een geel "EIGEN"-label.
// De grote naam ("children") is de Boon Edam-naam, of de ESCO-naam als
// er geen eigen naam is.
function EscoName({ escoTitle, children }) {
  return (
    <>
      <span className="esco-original">
        {escoTitle ? (
          <>
            <span className="esco-tag">ESCO</span>
            {escoTitle}
          </>
        ) : (
          <>
            <span className="own-tag">EIGEN</span>
            Niet in ESCO
          </>
        )}
      </span>
      {children}
    </>
  );
}

export default EscoName;
