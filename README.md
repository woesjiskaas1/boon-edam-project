# Boon Edam-medewerkersportaal

HR-portaal voor Boon Edam om medewerkers, rollen, skills en certificaten te
bekijken. De React-frontend haalt de catalogi en medewerkers op via een
PHP-API met Slim en MySQL. Nieuwe medewerkers en hun rol- en skillkoppelingen
worden opgeslagen in MySQL. Inloggen en registreren werken met demoaccounts
in het geheugen van de frontend.

## Lokaal starten

Gebruik Git, Node.js **22.22.0 of nieuwer** en npm. Voor de API heb je ook
**PHP 8.5** met `pdo_mysql` en een draaiende MySQL-server nodig. De PHP-versie
staat in de [backend-README](backend/README.md). De minimale Node-versie volgt
uit de versie van React Router in [package-lock.json](package-lock.json).

Kloon het project als je nog geen lokale kopie hebt.

```bash
git clone https://github.com/woesjiskaas1/boon-edam-project.git
cd boon-edam-project
```

### Backend

Start MySQL en controleer de lokale verbindingsinstellingen in
[db.php](backend/src/config/db.php). Het standaardschema heet `test_db`.
De benodigde PHP-dependencies staan al in `backend/vendor/`.

Start de PHP-server vanuit de hoofdmap in een aparte terminal.

```bash
cd backend/public
php -S localhost:3333 index.php
```

De eerste databaseaanroep kan de database en de tabellen aanmaken.
Bij een lege medewerkerstabel worden voorbeeldmedewerkers geladen. Bij
een lege roltabel worden de voorbeeldrollen en hun standaardskills geladen.
De databasegebruiker moet de database, tabellen en gegevens kunnen aanmaken
en wijzigen. Zie het [schema](backend/src/config/database.sql) en de
[voorbeeldrollen](backend/src/config/job-role-seed.sql).

Open [localhost:3333](http://localhost:3333) voor een JSON-testantwoord.
[localhost:3333/employees](http://localhost:3333/employees) controleert ook
de verbinding met MySQL.

### Frontend

Gebruik in een tweede terminal vanuit de hoofdmap deze commando’s.

```bash
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173) of gebruik de URL die Vite in de
terminal toont. Vite stuurt `/api/...` door naar `http://localhost:3333` en
verwijdert het voorvoegsel `/api`. Een verzoek naar `/api/employees` wordt
bijvoorbeeld `http://localhost:3333/employees`. Zie
[vite.config.js](vite.config.js).

Zonder PHP en MySQL kun je inloggen en de demo-interface openen. De lijsten
met medewerkers en rollen blijven dan leeg. Skills en certificaten hebben
voorbeeldgegevens voor als hun API leeg of onbereikbaar is.

## De demo gebruiken

### Inloggen en registreren

De volgende demoaccounts gebruiken hetzelfde wachtwoord, `Welkom123`. Zie
[portalUsers.js](src/data/portalUsers.js).

| Naam | E-mailadres | Toegangsrol |
| --- | --- | --- |
| John Doe | `john.doe@boonedam.com` | Eigenaar |
| Jane Doe | `jane.doe@boonedam.com` | Beheerder |
| Jan de Vries | `jan.devries@boonedam.com` | Bewerker |

Na inloggen opent het dashboard. Het uitklapbare zijmenu bevat de
hoofdonderdelen. Via het profielmenu kun je naar je profiel of instellingen
en kun je uitloggen.

Via **Registreren** kun je een lokaal demoaccount maken met
`lisa.bakker@boonedam.com` (Bewerker) of `tom.smit@boonedam.com` (Lezer).
Vul je naam in en kies een wachtwoord van minimaal acht tekens. Je wordt
automatisch ingelogd en de uitnodiging verdwijnt voor de rest van de sessie.
Bij verversen word je uitgelogd en vervallen nieuwe accounts. De uitnodigingen
zijn dan opnieuw beschikbaar. Er wordt geen e-mail gestuurd.

### Medewerkers

Open **Medewerkers** en klik op een naam voor de gegevens van die medewerker.
Het overzicht bevat maximaal 50 medewerkers per pagina. Op de detailpagina
zie je onder meer het medewerkersnummer, land, vestiging, rollen en e-mailadres.

Kies **Medewerker toevoegen** om een medewerker op te slaan. Vul voornaam,
achternaam, e-mailadres en land in en kies minstens één rol. Tussenvoegsel
en een vestiging in het gekozen land zijn optioneel. Het formulier selecteert
de gecombineerde standaardskills van de gekozen rollen. Je kunt vaardigheden
toevoegen of weghalen voordat je opslaat. Na opslaan ga je terug naar het
overzicht.

Het portaal haalt na verversen medewerkers en hun rollen opnieuw op.
De frontend leest de opgeslagen koppelingen tussen medewerkers en skills
nog niet opnieuw in. Daardoor kunnen de skills op de detailpagina en de
aantallen in het skilloverzicht onvolledig zijn.

### Rollen

De pagina **Rollen** toont de functiecatalogus uit MySQL. Zoek op naam of
omschrijving en sorteer op naam of medewerkeraantal. Open een rol voor de
omschrijving, standaardskills en gekoppelde medewerkers. De medewerkerslijst
is doorzoekbaar op naam en nummer en heeft filters voor land en vestiging.

Via **Rol toevoegen** kun je naam, omschrijving en standaardskills invullen.
Met **Zoek in ESCO** kan een Nederlands beroepsprofiel die velden vooraf
invullen, inclusief essentiële vaardigheden. Dit gebruikt de online ESCO-API.
Het formulier is al beschikbaar. Opslaan van nieuwe rollen moet nog worden
aangesloten.

### Skills en ESCO

In **Skills** kun je vaardigheden op categorie filteren en sorteren op naam
en medewerkeraantal. De laatst gekozen sorteerkolom krijgt voorrang. De
andere kolom bepaalt de volgorde bij gelijke waarden. Bij ontbrekende of
lege API-gegevens toont het overzicht voorbeelden uit [skills.js](src/data/skills.js).

Het skillformulier biedt suggesties voor namen en categorieën vanaf twee
tekens. Je kunt zoeken met Nederlandse en Engelse termen, typefouten en
categoriecodes. Gebruik de pijltjestoetsen en Enter voor een suggestie of
voer zelf een naam in. De lokale lijsten bieden dezelfde zoekmogelijkheid
bij verbindingsproblemen. Zie de [ESCO-API](https://esco.ec.europa.eu/en/use-esco/use-esco-services-api/esco-web-service-api),
de [skillcatalogus](public/data/esco-skills.json) en de [categorielijst](public/data/esco-categories.json).

De frontend heeft formulieren voor toevoegen, bewerken en verwijderen van
skills. De PHP-backend heeft momenteel alleen een leesroute voor de
skillcatalogus. Daardoor worden veranderingen aan skillnamen, categorieën
en ESCO-koppelingen nog niet opgeslagen. De API kan bestaande skills wel aan
medewerkers koppelen en die koppelingen verwijderen.

### Certificaten

Open **Certificaten** om certificaattypen te bekijken, te filteren op
categorie en te sorteren op naam of het aantal unieke gekoppelde medewerkers.
Het overzicht leest de typen en koppelingen via de API. Bij ontbrekende
gegevens toont het fictieve voorbeelden.

In de kaartweergave opent de naam een detailvenster.
Voor herkende certificaten bevat het venster uitleg en bronlinks. Het aantal
medewerkers opent de lijst met koppelingen. Toevoegen, bewerken en verwijderen
werkt binnen de sessie. Bij verversen laadt het portaal de begingegevens
opnieuw.

## Routes

| Route | Scherm en werking |
| --- | --- |
| `/login` | Inloggen met een demoaccount. |
| `/registreren` | Een demoaccount maken met een bestaande uitnodiging. |
| `/` | Dashboard met begroeting, teamstatistieken, medewerkers en snelkoppelingen. |
| `/medewerkers` | Overzicht met naam, medewerkersnummer, rol en land. |
| `/medewerkers/toevoegen` | Formulier dat de medewerker, rollen en skills opslaat via de API. |
| `/medewerkers/importeren` | Voorbereide pagina voor CSV- of Excel-import. Importeren is nog niet beschikbaar. |
| `/medewerkers/:employeeId` | Detailpagina op basis van het zichtbare medewerkersnummer. |
| `/rollen` | Doorzoekbare en sorteerbare catalogus van medewerkersrollen. |
| `/rollen/nieuw` | Formulier met skillkeuze en ESCO-beroepszoeker. Opslag volgt nog. |
| `/rollen/:roleId` | Rol, standaardskills, statistieken en filterbare medewerkerslijst. |
| `/skills` | Skilloverzicht met categoriefilter, sortering en ESCO-suggesties. |
| `/certificaten` | Certificaattypen en aantallen gekoppelde medewerkers. |
| `/instellingen` | Overzicht van portaalgebruikers, toegangsrollen en rechten. |
| `/profiel` | Profielpagina met vaste voorbeeldgegevens. |

Zonder ingelogde gebruiker verwijst het portaal naar `/login`.
De registratieroute blijft beschikbaar. Na inloggen verwijzen onbekende
routes naar het dashboard.

## API

Deze paden zijn rechtstreeks beschikbaar op de PHP-server. Voeg `/api`
toe als je de endpoints via Vite aanroept. De numerieke `{id}` in de API
is het database-ID `employee_id`. De React-route gebruikt het zichtbare
medewerkersnummer `employee_number`. Zie [index.php](backend/public/index.php).

| Methode | Pad | Werking |
| --- | --- | --- |
| GET | `/`, `/name/{userInput}` | JSON-testantwoorden. |
| GET | `/first-names` | Voornamen van medewerkers. |
| GET | `/employees`, `/employees/{id}` | Alle medewerkers of de medewerker met dit database-ID. |
| POST | `/employees` | Een medewerker aanmaken. |
| GET | `/employee-job-roles` | Koppelingen tussen medewerkers en rollen. |
| GET | `/job-roles` | Rolcatalogus met standaardskills. |
| POST | `/employees/{id}/job-roles` | Een rol koppelen en de standaardskills aan de medewerker toevoegen. |
| GET | `/skills` | Skillcatalogus. |
| POST | `/employees/{id}/skills` | Een bestaande skill aan een medewerker koppelen. |
| DELETE | `/employees/{id}/skills/{skillId}` | Een skillkoppeling bij een medewerker verwijderen. |
| GET | `/certificates`, `/certificates/{name}` | Certificaattypen, eventueel gezocht op naam. |
| GET | `/employee_certificates`, `/employee_certificates/{id}` | Certificaatkoppelingen van alle medewerkers of één medewerker. |
| GET | `/employee_training`, `/employee_training/{id}` | Trainingen van alle medewerkers of één medewerker. |
| GET | `/employee_skills`, `/employee_skills/{id}` | Skillkoppelingen van alle medewerkers of één medewerker. |
| GET | `/employee_files`, `/employee_files/{id}` | Bestandsrecords van alle medewerkers of één medewerker. |

## Toegangsrollen

Medewerkersrollen horen bij functies en bepalen de standaardskills.
Toegangsrollen horen bij portaalaccounts. In **Instellingen** staat per rol
welke rechten zijn bedoeld. Zie [accessRoles.js](src/data/accessRoles.js).

| Toegangsrol | Bekijken | Toevoegen en aanpassen | Instellingen en toegang beheren |
| --- | --- | --- | --- |
| Eigenaar | Ja | Ja | Ja |
| Beheerder | Ja | Ja | Ja |
| Bewerker | Ja | Ja | Nee |
| Lezer | Ja | Nee | Nee |

De API dwingt deze rechten nog niet af. De interface toont knoppen voor
uitnodigen en rolwijzigingen. Die acties moeten nog worden aangesloten.

## Projectstructuur

```text
backend/public/      Slim-router en PHP-startpunt
backend/src/config/  MySQL-verbinding, schema en voorbeeldgegevens
backend/vendor/      PHP-dependencies
public/data/         Lokale ESCO-catalogi voor skills en categorieën
scripts/             ESCO-catalogi verversen
src/components/      Atoms, molecules en organisms
src/templates/       Gedeelde pagina-indelingen
src/pages/           Pagina's voor de routes
src/data/            Voorbeelddata, landen, vestigingen en portaalrollen
src/services/        Verzoeken naar PHP en ESCO
src/utils/           Sortering, zoeklogica en gegevensverwerking
src/styles/          Gedeelde stijlen en stijlen per scherm
src/App.jsx          Routes, applicatiestatus en API-acties
tests/               Tests met de ingebouwde Node.js-testrunner
```

De componentmappen volgen [Atomic Design van Brad Frost](https://atomicdesign.bradfrost.com/chapter-2/).

| Laag | Taak | Voorbeelden |
| --- | --- | --- |
| Atoms | Basisbouwstenen | `Button`, `Input`, `Select`, `Avatar`, `Logo` |
| Molecules | Bouwstenen combineren voor één taak | `FormField`, `NavItem`, `TagPicker`, `CertificateCard` |
| Organisms | Een formulier, tabel of ander zelfstandig schermonderdeel | `EmployeeForm`, `RolesTable`, `SkillsTable`, `CertificatesGrid` |
| Templates | Gedeelde indeling voor meerdere pagina’s | `PortalLayout` voor het portaal en `AuthLayout` voor inloggen en registreren |
| Pages | Onderdelen samenstellen met de gegevens en acties voor een route | `Employees`, `AddEmployee`, `Skills`, `Certificates` |

`App.jsx` beheert de routes, applicatiestatus en API-acties. `PortalLayout`
plaatst de bovenbalk, het zijmenu en de pagina-inhoud. Pagina’s geven hun
gegevens en acties door aan de onderdelen die ze samenstellen. Zo gebruikt
`AddEmployee` het `EmployeeForm` met onder meer `FormField` en `TagPicker`.
Een component kan andere UI-componenten uit dezelfde of een lagere laag
gebruiken. Gedeelde formuliervelden gebruiken `src/styles/forms.css`.

## Scripts en controles

| Commando | Doel |
| --- | --- |
| `npm run dev` | Start Vite met automatisch verversen. |
| `npm run lint` | Controleert de code met Oxlint. |
| `npm test` | Draait tests voor sortering, ESCO-zoeken en certificaten. |
| `npm run build` | Maakt een frontendbuild in `dist/`. |
| `npm run preview` | Opent de bestaande build lokaal, standaard op poort 4173. |
| `npm run esco:sync` | Ververst beide lokale ESCO-catalogi via internet. |

Met `npm run esco:sync -- skills` of `npm run esco:sync -- categories`
ververs je één catalogus. Versie, herkomst en ophaaldatum staan in de
JSON-bestanden.

Voor hosting van de build moet de webserver onbekende paginapaden naar
`index.html` sturen voor React Router. Verzoeken naar `/api/` hebben hun
eigen route naar de PHP-backend nodig.

De demo is bedoeld voor lokaal gebruik met testgegevens. Voor gebruik met
echte accounts en medewerkersgegevens zijn onder meer serverauthenticatie
en autorisatie nodig. Medewerkers bewerken of verwijderen, importeren,
rollen opslaan en certificaten blijvend wijzigen zijn nog niet beschikbaar.
