# boon-edam-project

React + Vite (JavaScript). De interface is opgebouwd volgens
[Atomic Design van Brad Frost](https://atomicdesign.bradfrost.com/chapter-2/).

De vijf lagen hebben elk een eigen verantwoordelijkheid:

| Laag | Verantwoordelijkheid | Voorbeelden in dit project |
| --- | --- | --- |
| Atoms | Kleine UI-bouwstenen | `Button`, `Input`, `Select`, `Logo`, `Avatar`, `CountryFlag` |
| Molecules | Kleine combinaties met één taak | `FormField`, `CountryLabel`, `CountrySelect`, `NavItem`, `ProfileMenu`, `Pagination`, `SkillSelect`, `AccessRoleCard` |
| Organisms | Complete delen van een scherm | `TopNavbar`, `Sidebar`, `EmployeesTable`, `EmployeeDetails`, `EmployeeForm`, `LoginForm`, `RegisterForm`, `PortalAccessSettings` |
| Templates | Pagina-indeling met ruimte voor inhoud | `PortalLayout` voor het portaal, `AuthLayout` voor inloggen en registreren |
| Pages | Concrete schermen met gegevens en acties | `Employees`, `AddEmployee`, `Employee`, `Login`, `Register`, `Settings` |

Een component importeert alleen UI-componenten uit dezelfde of een lagere laag.
Templates krijgen pagina-inhoud via `children`; ze importeren geen pagina's.
`App.jsx` verbindt de routes, applicatiestatus en het portaaltemplate. Pagina's
koppelen gegevens en acties aan de organisms. Formulierstatus en validatie staan
bij het betreffende formulier.

Bijvoorbeeld: `AddEmployee` vult `EmployeeForm` met rollen, skills en een
opslagactie. Het formulier gebruikt `FormField`, dat een label, `Input` of
`Select` en een eventuele foutmelding combineert. Foutmeldingen zijn via
`aria-describedby` aan het invoerveld gekoppeld.

```text
src/
├── components/
│   ├── atoms/          kleine, losse bouwstenen
│   ├── molecules/      combinatie van atoms met één taak
│   └── organisms/      groter interface-onderdeel
├── templates/          gedeelde pagina-indeling
├── pages/              concrete schermen
├── data/               voorbeeldgegevens
├── styles/
│   ├── global.css      basisstijl voor de hele app
│   ├── forms.css       gedeelde formuliervelden en foutmeldingen
│   ├── layout.css      portaal, navigatie, knoppen en tabellen
│   └── …               stijl per scherm of component
├── assets/
├── App.jsx
└── main.jsx
```

```bash
npm install
npm run dev
```

Controleer wijzigingen met:

```bash
npm run lint
npm run build
```

Voeg nieuwe bouwstenen toe op basis van hun taak en complexiteit. Gewone
koppen, tekst en containers mogen in een pagina blijven staan; ze hoeven niet
allemaal een eigen component te worden.
