# boon-edam-project

React + Vite (JavaScript).

## Dashboard

Responsive uitvoering van dashboardontwerp 1 voor issue #10. Het dashboard bevat
een zijmenu, gebruikersnaam, organisatiecijfers, recente medewerkers en activiteit.
Op kleine schermen is de navigatie beschikbaar via de menuknop.

De pagina's Dashboard, Medewerkers en Rollen werken met fictieve voorbeeldgegevens.
Je kunt medewerkers zoeken, op rol en status filteren, gegevens bekijken en via het
formulier een medewerker toevoegen. Aantallen en recente activiteit worden direct
bijgewerkt. Gegevens staan alleen in het geheugen en worden bij herladen teruggezet.
Er is geen backend of echte authenticatie gekoppeld; de uitlogactie is een demo
en het toevoegformulier verstuurt geen e-mail.

Accentkleuren: groen `#6CC05B` en geel `#D1E04E`.

## Bestandsstructuur: Atomic Design

De UI volgt de vijf lagen van [Atomic Design van Brad Frost](https://atomicdesign.bradfrost.com/chapter-2/).
Voor dit React-project vertaalt dat zich naar deze indeling:

```text
src/
├── components/
│   ├── atoms/
│   │   ├── Avatar.jsx
│   │   ├── Brand.jsx
│   │   ├── Button.jsx
│   │   ├── Icon.jsx
│   │   └── StatusBadge.jsx
│   ├── molecules/
│   │   ├── Dialog.jsx
│   │   ├── NavItem.jsx
│   │   ├── PageHeading.jsx
│   │   ├── RoleCard.jsx
│   │   ├── SearchField.jsx
│   │   ├── StatCard.jsx
│   │   ├── Toast.jsx
│   │   └── UserMenu.jsx
│   └── organisms/
│       ├── ActivityList.jsx
│       ├── AppDialogs.jsx
│       ├── EmployeeForm.jsx
│       ├── EmployeeProfile.jsx
│       ├── EmployeeTable.jsx
│       ├── Sidebar.jsx
│       ├── StatGrid.jsx
│       └── TopBar.jsx
├── templates/
│   └── DashboardLayout.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── EmployeesPage.jsx
│   ├── RolesPage.jsx
│   └── SignedOutPage.jsx
├── hooks/
│   └── useDashboard.js
├── data/
│   └── dashboard.js
├── styles/
│   ├── global.css
│   └── dashboard.css
├── assets/
├── App.jsx
└── main.jsx
```

| Laag | Verantwoordelijkheid | Voorbeeld |
| --- | --- | --- |
| Atoms | Kleine, zelfstandige UI-bouwstenen | Knop, icoon, avatar, statuslabel |
| Molecules | Kleine combinaties van bouwstenen met één taak | Zoekveld, navigatie-item, statistiekkaart |
| Organisms | Complete onderdelen van de interface | Zijmenu, bovenbalk, medewerkerstabel, formulier |
| Templates | De gedeelde pagina-indeling | `DashboardLayout` plaatst zijmenu, bovenbalk, inhoud en footer |
| Pages | Concrete pagina-inhoud met gegevens en acties | Dashboard, medewerkers, rollen en uitlogscherm |

`App.jsx` verbindt de pagina's met het gedeelde template en de dashboardlogica.
Het template blijft gemount bij het wisselen van pagina, zodat bijvoorbeeld het
zoekveld zijn focus behoudt. `useDashboard` beheert de gegevens, filters,
navigatiestatus en acties. Voorbeeldgegevens staan in `data/`; kleuren,
basisstijlen en responsive dashboardstijlen staan in `styles/`.

Gebruik bij nieuwe onderdelen deze richting: atoms → molecules → organisms →
templates/pages. Een bouwsteen importeert uitsluitend onderdelen uit dezelfde
of een lagere UI-laag. Gegevens en dashboardacties worden via props doorgegeven;
deze worden beheerd buiten de UI-bouwstenen.

## Starten

```bash
npm install
npm run dev
```

## Controleren

```bash
npm run lint
npm run build
```
