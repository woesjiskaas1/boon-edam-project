# Boon Edam-medewerkersportaal

Een HR-portaal voor het bekijken en toevoegen van medewerkers, hun functies en
vaardigheden. De frontend is gebouwd met React, JavaScript en Vite en gebruikt
[Atomic Design van Brad Frost](https://atomicdesign.bradfrost.com/chapter-2/)
als uitgangspunt voor de componentstructuur. Een aparte PHP-backend met Slim
en MySQL staat in `backend/`.

De huidige versie is een frontenddemo met voorbeeldgegevens. Inloggen,
registreren op uitnodiging en medewerkers toevoegen werken binnen de lopende
sessie. De PHP-backend biedt leesendpoints voor de database, maar de
React-schermen gebruiken momenteel nog de lokale voorbeeldgegevens.

## Lokaal starten

Benodigdheden:

- Node.js **22.22.0 of nieuwer**, vereist door de huidige React Router-versie.
- npm, meegeleverd met Node.js.
- Git om de repository te klonen.

```bash
git clone https://github.com/woesjiskaas1/boon-edam-project.git
cd boon-edam-project
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). Als die poort bezet is, toont Vite
in de terminal op welke URL de app beschikbaar is.

`npm ci` installeert de versies uit `package-lock.json`. Voor alleen de
frontenddemo zijn geen database, API-sleutels of `.env`-bestand nodig.

## Frontend en backend samen starten

Gebruik twee aparte terminals. Naast de frontendbenodigdheden heb je PHP 8.5,
Composer en een draaiende MySQL-server nodig. PHP moet de extensie `pdo_mysql`
hebben. MySQL kan bijvoorbeeld via XAMPP worden gestart; controleer de versie
van de PHP-installatie die je via de terminal gebruikt.

### Backend instellen en starten

1. Controleer de verbindingsgegevens in
   [backend/src/config/db.php](backend/src/config/db.php) en pas ze aan jouw
   lokale MySQL-installatie aan.
2. Start MySQL. De verbinding gebruikt standaard de database `test_db`.
3. Installeer de PHP-dependencies en start de server vanuit de projectmap:

```bash
cd backend
composer install
cd public
php -S localhost:3333 index.php
```

De databasecode maakt bij een databaseaanroep de database en ontbrekende
tabellen aan met [database.sql](backend/src/config/database.sql). Als de tabel
`employee` nog niet bestond, worden ook de voorbeeldgegevens toegevoegd. De
MySQL-gebruiker moet dus rechten hebben om de database en tabellen aan te maken
en te wijzigen.

De backend is bereikbaar op [localhost:3333](http://localhost:3333). De route
`/` geeft een eenvoudig JSON-testantwoord; voor `/employees` is een werkende
databaseverbinding nodig. Zie ook [backend/README.md](backend/README.md).

### Frontend in de tweede terminal

Voer vanuit de hoofdmap uit:

```bash
npm run dev
```

[vite.config.js](vite.config.js) stuurt ontwikkelverzoeken naar `/api/...`
door naar `http://localhost:3333`, waarbij `/api` uit het pad wordt verwijderd.
Zo gaat `fetch("/api/employees")` naar `http://localhost:3333/employees`.
Deze proxy is beschikbaar voor toekomstige koppelingen; de huidige
React-pagina's halen hun gegevens nog niet via deze endpoints op.

### Beschikbare API-endpoints

Alle onderstaande endpoints gebruiken `GET` en staan in
[backend/public/index.php](backend/public/index.php). De paden hieronder zijn
de rechtstreekse backendpaden. Zet er `/api` voor bij gebruik via de
Vite-ontwikkelserver.

| Pad | Inhoud |
| --- | --- |
| `/` | Eenvoudig testantwoord met een naam. |
| `/name/{userInput}` | Testantwoord met de opgegeven naam. |
| `/first-names` | Voornamen van medewerkers. |
| `/employees` | Alle medewerkers uit de database. |
| `/employees/{id}` | Medewerker met een numeriek database-ID. |
| `/certificates` en `/certificates/{name}` | Certificaattypen, eventueel geselecteerd op naam. |
| `/employee_certificates` en `/employee_certificates/{id}` | Certificaten van alle medewerkers of één medewerker. |
| `/employee_training` en `/employee_training/{id}` | Trainingen van alle medewerkers of één medewerker. |
| `/employee_skills` en `/employee_skills/{id}` | Skills van alle medewerkers of één medewerker. |
| `/employee_files` en `/employee_files/{id}` | Bestanden van alle medewerkers of één medewerker. |

De `{id}`-parameters zijn numerieke database-ID's, bijvoorbeeld `1`. Ze
verschillen van de demo-ID's in de frontend, zoals `EMP001`. De backend heeft
nog geen endpoints voor het opslaan, wijzigen of verwijderen van gegevens.

## Demo gebruiken

### Inloggen

Deze voorbeeldaccounts staan in [portalUsers.js](src/data/portalUsers.js).
Het wachtwoord voor alle drie is `Welkom123`.

| Naam | E-mailadres | Toegangsrol |
| --- | --- | --- |
| John Doe | `john.doe@boonedam.com` | Eigenaar |
| Jane Doe | `jane.doe@boonedam.com` | Beheerder |
| Jan de Vries | `jan.devries@boonedam.com` | Bewerker |

Na inloggen opent het dashboard. Via het profielmenu rechtsboven kun je naar
je profiel, instellingen of uitloggen. Het zijmenu kan worden ingeklapt.

### Registreren op uitnodiging

Open **Registreren** op het inlogscherm en gebruik een van deze
voorbeeldadressen:

| E-mailadres | Toegangsrol na registratie |
| --- | --- |
| `lisa.bakker@boonedam.com` | Bewerker |
| `tom.smit@boonedam.com` | Lezer |

Vul een naam in en kies een wachtwoord van minimaal acht tekens. De herhaling
moet overeenkomen. Registratie controleert of het adres is uitgenodigd en nog
geen account heeft. Daarna ben je automatisch ingelogd en wordt de uitnodiging
uit de huidige sessie verwijderd. Er wordt geen e-mail verstuurd.

### Medewerker toevoegen

1. Open **Medewerkers** en klik op **Medewerker toevoegen**.
2. Vul voornaam, achternaam, geboortedatum, land, adres, e-mailadres en
   telefoonnummer in en kies een functie via het veld **Rol**.
3. Bij het kiezen van een functie worden de standaard skills aangevinkt.
   Pas die selectie aan als dat nodig is.
4. Klik op **Medewerker opslaan**. Je keert terug naar het overzicht, waar de
   medewerker direct beschikbaar is.

Het formulier controleert verplichte velden, het e-mailformaat en of de
geboortedatum in de toekomst ligt. Skills zijn optioneel. **Annuleren** keert
terug naar het overzicht zonder de medewerker toe te voegen.

## Pagina's en routes

| Route | Scherm | Huidige werking |
| --- | --- | --- |
| `/login` | Inloggen | Controleert e-mailadres en wachtwoord tegen de voorbeeldaccounts. |
| `/registreren` | Registreren | Maakt binnen de sessie een account aan op basis van een uitnodiging. |
| `/` | Dashboard | Persoonlijke begroeting, teamstatistieken, vier medewerkers in beeld en snelkoppelingen. |
| `/medewerkers` | Medewerkers | Tabel met naam, ID, functie en land; maximaal 50 medewerkers per pagina. |
| `/medewerkers/toevoegen` | Medewerker toevoegen | Formulier met validatie, landenkeuze en skills per functie. |
| `/medewerkers/:employeeId` | Medewerkerdetails | Persoonlijke gegevens, contactgegevens en skills van een medewerker. |
| `/functies` | Functies | Voorlopige pagina; functiebeheer moet nog worden gebouwd. |
| `/skills` | Skills | Voorlopige pagina; skillbeheer moet nog worden gebouwd. |
| `/instellingen` | Instellingen | Overzicht van portaalgebruikers, toegangsrollen en bijbehorende rechten. |
| `/profiel` | Mijn profiel | Toont vaste voorbeeldgegevens van Jan Jansen. |

Klik in de medewerkerstabel op een naam om de detailpagina te openen.
Ontbrekende gegevens krijgen een melding zoals **Niet ingevuld**. Een onbekend
medewerkers-ID toont **Medewerker niet gevonden**.

Zonder ingelogde gebruiker verwijzen alle routes behalve `/login` en
`/registreren` naar het inlogscherm. Na inloggen verwijzen onbekende routes
naar het dashboard. De router gebruikt `BrowserRouter`.

## Gegevens en rollen

Alle begingegevens komen uit `src/data/`:

| Bestand | Inhoud |
| --- | --- |
| [employees.jsx](src/data/employees.jsx) | Voorbeeldmedewerkers voor het overzicht en de detailpagina. |
| [employeeRoles.js](src/data/employeeRoles.js) | Medewerkersfuncties met standaard skills. |
| [skills.js](src/data/skills.js) | Beschikbare vaardigheden. |
| [countries.js](src/data/countries.js) | Landnamen en codes voor de vlaggen. |
| [portalUsers.js](src/data/portalUsers.js) | Voorbeeldaccounts en uitnodigingen. |
| [accessRoles.js](src/data/accessRoles.js) | Toegangsrollen en de rechten die in instellingen worden getoond. |
| [navigationItems.js](src/data/navigationItems.js) | Labels, routes en symbolen van het zijmenu. |

**Medewerkersfuncties** en **toegangsrollen** zijn twee verschillende dingen.
Een functie zoals Software Developer bepaalt de standaard skills van een
medewerker. Een toegangsrol zoals Beheerder beschrijft rechten in het portaal.

Het huidige rechtenmodel bevat:

| Toegangsrol | Bekijken | Toevoegen en aanpassen | Instellingen en toegang beheren |
| --- | --- | --- | --- |
| Eigenaar (`owner`) | Ja | Ja | Ja |
| Beheerder (`admin`) | Ja | Ja | Ja |
| Bewerker (`editor`) | Ja | Ja | Nee |
| Lezer (`viewer`) | Ja | Nee | Nee |

Dit is het model uit `accessRoles.js`. Het volledig afdwingen van deze rechten
in routes en acties moet nog worden uitgewerkt. De instellingenpagina toont
de rechten en bepaalt deels de beschikbaarheid van de knop **Wijzigen**, maar
de knoppen voor uitnodigen en wijzigen hebben nog geen actie.

## Techniek en projectstructuur

| Onderdeel | Technologie |
| --- | --- |
| Interface | React 19 en React DOM |
| Navigatie | React Router 8 |
| Ontwikkelserver en build | Vite 8 met de React-plugin |
| Taal | JavaScript met JSX en ES-modules |
| Vormgeving | CSS-bestanden in `src/styles/` |
| Codecontrole | Oxlint met React-regels |
| Backend | PHP met Slim 4 en Slim PSR-7 |
| Database | MySQL via PDO |

De dependencyversies en npm-scripts staan in [package.json](package.json).
De vastgelegde installatieversies staan in [package-lock.json](package-lock.json).

```text
boon-edam-project/
├── backend/
│   ├── public/             PHP-startpunt en webserverbestanden
│   ├── src/config/         databaseverbinding en SQL-schema met voorbeelddata
│   ├── vendor/             PHP-dependencies
│   ├── composer.json       backenddependencies
│   └── composer.lock       vastgelegde backendversies
├── public/                 statische bestanden, zoals favicon en iconen
├── src/
│   ├── assets/             logo, vlaggen en overige afbeeldingen
│   ├── components/
│   │   ├── atoms/          kleine UI-bouwstenen
│   │   ├── molecules/      combinaties met één taak
│   │   └── organisms/      complete delen van een scherm
│   ├── data/               voorbeeldgegevens en configuratie
│   ├── pages/              concrete schermen voor de routes
│   ├── styles/             gedeelde en specifieke CSS
│   ├── templates/          gedeelde pagina-indelingen
│   ├── App.jsx             routes, portaalindeling, applicatiestatus en acties
│   └── main.jsx            start React, StrictMode en BrowserRouter
├── .oxlintrc.json           lintconfiguratie
├── index.html              HTML-startpunt voor Vite
├── package.json            dependencies en npm-scripts
├── package-lock.json       vastgelegde dependencyversies
└── vite.config.js          React-plugin en ontwikkelproxy naar de PHP-backend
```

### Atomic Design

De mappen volgen vijf lagen met elk een eigen verantwoordelijkheid:

| Laag | Verantwoordelijkheid | Componenten in dit project |
| --- | --- | --- |
| Atoms | Kleine UI-bouwstenen | `Button`, `Input`, `Select`, `Logo`, `Avatar`, `CountryFlag`, `NavItem` |
| Molecules | Kleine combinaties met één taak | `FormField`, `CountryLabel`, `CountrySelect`, `NavItem`, `ProfileMenu`, `Pagination`, `SkillSelect`, `AccessRoleCard` |
| Organisms | Complete delen van een scherm | `TopNavbar`, `Sidebar`, `EmployeesTable`, `EmployeeDetails`, `EmployeeForm`, `LoginForm`, `RegisterForm`, `PortalAccessSettings` |
| Templates | Pagina-indeling met ruimte voor inhoud | `PortalLayout`, `AuthLayout` |
| Pages | Concrete schermen met gegevens en acties | De routepagina's in `src/pages/` |

De afspraak is dat een component alleen UI-componenten uit dezelfde of een
lagere laag importeert. Templates ontvangen pagina-inhoud via `children` en
importeren geen pagina's.

De huidige code gebruikt deze indeling gedeeltelijk. `App.jsx` bouwt de
portaalindeling rechtstreeks met `TopNavbar` en `Sidebar`. Het bewaart ook de
ingelogde gebruiker, portaalgebruikers, uitnodigingen en medewerkers met
`useState` en verbindt de routes met acties zoals inloggen en opslaan.
Formulierstatus en validatie staan momenteel rechtstreeks in de pagina's
`Login`, `Register` en `AddEmployee`.

De herbruikbare formulierorganisms en templates staan wel in de repository,
maar zijn nog niet overal aangesloten op de pagina's. Zo combineert
`EmployeeForm` de molecule `FormField` met functies en skills, terwijl de
huidige pagina `AddEmployee` haar velden zelf opbouwt. `FormField` koppelt
eventuele foutmeldingen via `aria-describedby` aan het invoerveld.

Voeg nieuwe bouwstenen toe op basis van hun taak en complexiteit. Gewone
koppen, tekst en containers mogen in een pagina blijven staan.

### Stijlen

- `global.css`: basisinstellingen en focusstijl voor knoppen.
- `layout.css`: portaalindeling, navigatie, knoppen, tabellen en paginering.
- `forms.css`: gedeelde formuliervelden en foutmeldingen.
- `auth.css`: inloggen en registreren.
- `dashboard.css`: dashboard, statistieken en snelkoppelingen.
- `add-employee.css`, `employee.css`, `profile.css` en `settings.css`: specifieke
  schermen en onderdelen.
- `country.css` en `country-select.css`: landlabels, vlaggen en de landenkeuze.

Pagina's, componenten en templates importeren de bijbehorende CSS. De landenkeuze
ondersteunt ook toetsenbordbediening, zoals pijltjestoetsen, Enter en Escape.

## Scripts en controles

| Commando | Doel |
| --- | --- |
| `npm run dev` | Start de ontwikkelserver met automatisch verversen. |
| `npm run lint` | Controleert de code met Oxlint. |
| `npm run build` | Maakt een productiebuild in `dist/`. |
| `npm run preview` | Serveert de bestaande productiebuild lokaal. |

Controleer codewijzigingen met:

```bash
npm run lint
npm run build
```

Voor het bekijken van de productiebuild:

```bash
npm run build
npm run preview
```

De preview is standaard beschikbaar op [localhost:4173](http://localhost:4173).
Gebruik bij een andere poort de URL uit de terminal. Bij hosting moet de
webserver onbekende paginapaden terugsturen naar `index.html`, zodat routes
zoals `/medewerkers/EMP001` ook rechtstreeks geopend kunnen worden.
De `/api`-proxy is een ontwikkelinstelling. Voor een gepubliceerde versie moet
de koppeling tussen de frontend en PHP-backend apart worden ingericht.

Er is nog geen geautomatiseerde testsuite of `npm test`-script opgenomen.
Controleer na functionele wijzigingen ook handmatig het inloggen, registreren,
toevoegen van een medewerker, de detailpagina en de navigatie op een smal scherm.

## Huidige beperkingen en vervolgstappen

- **Opslag en sessie:** de frontend is nog niet aan de database gekoppeld.
  Verversen van de pagina herstelt de begingegevens en
  logt de gebruiker uit. Toegevoegde medewerkers en nieuwe accounts gaan dan
  verloren; gebruikte uitnodigingen worden opnieuw beschikbaar.
- **Authenticatie:** de frontenddemo vergelijkt wachtwoorden in de frontend en bevat
  leesbare voorbeeldwachtwoorden. Voor echt gebruik zijn een backend en veilige
  account- en sessieafhandeling nodig.
- **Rechten:** volledige autorisatie en een werkende rangorde tussen
  toegangsrollen moeten nog worden uitgewerkt.
- **Gebruikersbeheer:** uitnodigen en toegangsrollen wijzigen zijn nog niet
  gekoppeld aan acties of opslag.
- **Medewerkersbeheer:** medewerkers bekijken en toevoegen werken;
  bestaande medewerkers bewerken en verwijderen zijn nog niet beschikbaar.
  De PHP-endpoints bieden momenteel alleen leesacties en hebben nog geen
  authenticatie of autorisatie.
- **Functies en skills:** de gegevens worden gebruikt bij het toevoegen van
  medewerkers, maar de beheerpagina's zijn nog placeholders.
- **Profiel:** de profielpagina gebruikt vaste voorbeeldgegevens en is nog
  niet gekoppeld aan de ingelogde gebruiker.
- **Componentstructuur:** de aanwezige Atomic Design-componenten en templates
  moeten nog consequent op alle pagina's worden aangesloten.
