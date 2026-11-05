# Boon Edam vergadering van 4 november 2026

Bron: **Online vergadering.docx**, overleg van 4 november 2026. Uitgewerkt op 5 november 2026. Deze versie vervangt de eerdere algemene backlog op basis van de projectcode.

## GitHub-overzicht

Samenvattend issue: [#30](https://github.com/woesjiskaas1/boon-edam-project/issues/30).

## Scrumissues

Bestaande issues zijn aangescherpt; nieuwe onderwerpen hebben een eigen ticket gekregen.

| Issue | Onderwerp | Prioriteit |
| --- | --- | --- |
| [#5](https://github.com/woesjiskaas1/boon-edam-project/issues/5) | S1-02 Datamodel ontwerpen | P1 |
| [#8](https://github.com/woesjiskaas1/boon-edam-project/issues/8) | S1-05 Beveiligde routes | P1 |
| [#9](https://github.com/woesjiskaas1/boon-edam-project/issues/9) | S1-06 Wachtwoord vergeten | P1 |
| [#11](https://github.com/woesjiskaas1/boon-edam-project/issues/11) | S1-07 Medewerkersoverzicht | P2 |
| [#12](https://github.com/woesjiskaas1/boon-edam-project/issues/12) | S1-08 Medewerker-detailpagina | P2 |
| [#13](https://github.com/woesjiskaas1/boon-edam-project/issues/13) | S1-09 Medewerker toevoegen | P2 |
| [#16](https://github.com/woesjiskaas1/boon-edam-project/issues/16) | S1-12 Rollen beheren | P1 |
| [#17](https://github.com/woesjiskaas1/boon-edam-project/issues/17) | S1-13 Rol toekennen aan medewerker | P1 |
| [#18](https://github.com/woesjiskaas1/boon-edam-project/issues/18) | inloggen/account aanmaken-backend  | P2 / backlog |
| [#19](https://github.com/woesjiskaas1/boon-edam-project/issues/19) | S1-14 in- en uitoggen-backend | P1 |
| [#22](https://github.com/woesjiskaas1/boon-edam-project/issues/22) | Functies hernoemen naar Rollen en systeemrollen onderscheiden | P1 |
| [#23](https://github.com/woesjiskaas1/boon-edam-project/issues/23) | Skills beheren op een aparte pagina | P1 |
| [#24](https://github.com/woesjiskaas1/boon-edam-project/issues/24) | Skills selecteren en onderhouden bij een medewerkersrol | P1 |
| [#25](https://github.com/woesjiskaas1/boon-edam-project/issues/25) | ESCO-koppeling onderzoeken en een zoek- en filterprototype voorbereiden | P1 / onderzoek |
| [#26](https://github.com/woesjiskaas1/boon-edam-project/issues/26) | Scope bepalen voor meerdere rollen per medewerker en afgeleide skills | P3 / refinement |
| [#27](https://github.com/woesjiskaas1/boon-edam-project/issues/27) | Import en export van rollen en skills afbakenen | P3 / refinement |
| [#28](https://github.com/woesjiskaas1/boon-edam-project/issues/28) | Demo van Rollen en Skills voorbereiden voor 11 november | P1 / demo |
| [#29](https://github.com/woesjiskaas1/boon-edam-project/issues/29) | Sprintcommunicatie en overlegafspraken vastleggen | P2 / proces |

## Samenvatting

Het portaal is bedoeld voor medewerkersrollen en skills en vervangt het personeelsysteem niet. De opdrachtgever geeft prioriteit aan de pagina's Rollen en Skills en een begrijpelijke koppeling tussen beide. Inloggen, uitloggen en wachtwoordherstel kunnen daarnaast worden uitgewerkt. Een uitgebreid systeem met individuele rechten per functionaliteit is geparkeerd.

De huidige pagina Functies moet Rollen heten. De toegangscategorieën bij Instellingen heten Systeemrollen. Functietitels, medewerkersrollen en systeemrollen blijven afzonderlijke begrippen.

Bij medewerkers blijven naam, medewerkers-ID, rol, e-mailadres en land relevant. Vestiging wordt toegevoegd, omdat één land meerdere vestigingen kan hebben. Geboortedatum, huisadres en telefoonnummer verdwijnen uit de medewerkersinterface. Uitgebreidere verwerking van samengestelde namen is geen prioriteit voor deze opdracht; identificatie via het medewerkers-ID is voor nu voldoende.

Rollen en Skills blijven aparte pagina's. Bij het aanmaken of openen van een rol moet de beheerder skills kunnen selecteren en de koppeling later onderhouden. Het ESCO-onderzoek moet de volledige sectorbreedte meenemen en beschrijven hoe zoeken, filteren en context helpen om de juiste skills te herkennen.

Voor het medewerkersoverzicht zijn zoeken, filteren en alfabetisch sorteren besproken. De precieze regels voor meerdere rollen per medewerker, de doorwerking van rolskills en import/export zijn nog te verfijnen. Certificaten zijn genoemd, maar de functionaliteit is niet uitgewerkt. Gebruik door managers is toekomstig werk buiten de huidige opdracht.

## Overleg en opvolging

- Volgende demo: **woensdag 11 november 2026 om 14:30**, circa dertig minuten. Laat vooral de opzet van Rollen, Skills en de koppeling zien. Een volledige databasekoppeling is hiervoor niet toegezegd.
- Vragen tussendoor via de afgesproken Teams-chat delen; vrijdag aan het einde van de dag een korte update over lopende taken en blokkades.
- Eindpresentatie: **woensdag 16 december 2026 om 15:00 bij Boon Edam**. Het team verzorgt de uitnodiging met exacte locatie en tijd.

De genoemde communicatieacties zijn taken voor het team. Er zijn vanuit deze uitwerking geen e-mails, Teams-berichten of agenda-uitnodigingen verstuurd.

## Bijgewerkte bestaande issues

### #5 - Datamodel aansluiten op rollen, skills en vestigingen

**Voorgestelde prioriteit:** P1

Als developer wil ik een gedeeld datamodel, zodat medewerkers, rollen en skills consequent worden opgeslagen.

Behoud de bestaande basis met gebruikers, medewerkers en unieke medewerkerscodes. Verwerk de aangescherpte scope uit de vergadering: dit portaal is gericht op rollen en skills en vervangt het personeelsysteem niet.

## Acceptatiecriteria

- [ ] Het ERD onderscheidt medewerkersrollen, skills en systeemrollen voor portaaltoegang.
- [ ] Land en vestiging kunnen bij een medewerker worden vastgelegd; een rol kan aan meerdere skills worden gekoppeld.
- [ ] Geboortedatum, huisadres en telefoonnummer zijn geen verplichte invoer of onderdeel van nieuwe medewerkersverzoeken.
- [ ] De bestaande unieke medewerkerscode en e-mailafspraken blijven gedocumenteerd; de bron van medewerkerscodes is expliciet vastgelegd.
- [ ] De keuze voor één of meerdere medewerkersrollen blijft herkenbaar als open punt en wordt pas na refinement als definitieve eis verwerkt.
- [ ] Het bijgewerkte ERD is gedeeld met het team.

**Besproken:** 5:06–12:28 en 12:31–17:50.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #8 - Beveiligde routes

**Voorgestelde prioriteit:** P1

Als portaalgebruiker wil ik dat alleen ingelogde gebruikers het portaal kunnen openen.

Dit bestaande beveiligingsticket ondersteunt de wens om inloggen en uitloggen te laten werken. Het gaat om basisbeveiliging binnen het huidige rollenmodel; individuele rechten per functionaliteit zijn geparkeerd.

## Acceptatiecriteria

- [ ] Niet-ingelogde gebruikers worden bij beschermde frontendroutes naar het inlogscherm gestuurd.
- [ ] Beschermde API-endpoints controleren de sessie en de bestaande toegangsrechten op de backend.
- [ ] Na uitloggen levert een directe aanroep van een beschermd endpoint geen medewerkersgegevens op.
- [ ] De controles zijn getest voor een geldige sessie, een ontbrekende sessie en een beëindigde sessie.

**Besproken:** 2:25–4:22 en 22:39–23:30.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #9 - Wachtwoord vergeten

**Voorgestelde prioriteit:** P1

Als portaalgebruiker wil ik mijn vergeten wachtwoord kunnen herstellen, zodat ik weer toegang tot mijn account krijg.

Deze wens werd expliciet genoemd naast inloggen en uitloggen. De bestaande eis van een resetlink per e-mail blijft behouden.

## Acceptatiecriteria

- [ ] Vanaf het inlogscherm kan een gebruiker een resetlink aanvragen.
- [ ] De herstelmail bevat een unieke link met een vastgelegde beperkte geldigheidsduur, bijvoorbeeld één uur zoals in het oorspronkelijke ticket.
- [ ] Via een geldige link kan een nieuw wachtwoord worden ingesteld; het wachtwoord wordt alleen gehasht opgeslagen.
- [ ] Een verlopen of al gebruikte resetlink wordt geweigerd.
- [ ] Het nieuwe wachtwoord werkt bij inloggen en het oude wachtwoord niet meer.

**Besproken:** 2:25–3:11.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #11 - Medewerkersoverzicht met vestiging, zoeken, filteren en sorteren

**Voorgestelde prioriteit:** P2

Als beheerder wil ik medewerkers snel kunnen vinden en herkennen, zodat ik de juiste medewerker en diens rollen kan bekijken.

Breid het bestaande overzicht uit met de afspraken over land en vestiging. Zoeken en filteren stonden al in dit ticket; alfabetisch sorteren en vestiging zijn in het overleg verduidelijkt.

## Acceptatiecriteria

- [ ] De tabel toont naam, medewerkerscode, medewerkersrol(len), land, vestiging en e-mailadres.
- [ ] Er kan worden gezocht op naam en medewerkerscode.
- [ ] Er kan worden gefilterd op medewerkersrol en vestiging.
- [ ] Relevante tabelkolommen, waaronder naam, rol en vestiging, kunnen oplopend en aflopend worden gesorteerd.
- [ ] Zoeken, filteren, sorteren en de bestaande paginering werken samen; bij een nieuwe selectie begint de weergave op de eerste pagina.
- [ ] Een lege selectie toont een duidelijke melding en de filters kunnen worden gewist.

**Besproken:** 5:06–8:59 en 21:24–22:39.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #12 - Medewerkerdetails beperken tot afgesproken gegevens

**Voorgestelde prioriteit:** P2

Als beheerder wil ik de relevante gegevens van één medewerker zien, zodat ik diens identiteit, rollen en skills kan controleren.

De opdrachtgever wil geen kopie van het personeelsysteem. Naam, medewerkers-ID, rollen, e-mailadres, land en vestiging zijn relevant. Certificaten werden genoemd als later toe te voegen onderdeel, zonder uitgewerkte scope.

## Acceptatiecriteria

- [ ] De detailpagina toont naam, medewerkerscode, medewerkersrol(len), e-mailadres, land en vestiging.
- [ ] Geboortedatum, huisadres en telefoonnummer worden niet getoond.
- [ ] De gekoppelde skills zijn zichtbaar en er is een begrijpelijke melding wanneer gegevens of skills ontbreken.
- [ ] Een onbekende medewerkerscode geeft een melding en een terugweg naar het overzicht.
- [ ] Certificaten worden als open vervolgwens vastgelegd; er wordt in dit ticket geen upload- of certificaatbeheer verondersteld.

**Besproken:** 6:37–9:54.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #13 - Medewerker toevoegen met beperkte gegevens en vestiging

**Voorgestelde prioriteit:** P2

Als beheerder wil ik een medewerker met relevante identificatiegegevens toevoegen, zodat ik rollen en skills aan de juiste persoon kan koppelen.

Deze beschrijving vervangt de eerdere eis om geboortedatum en telefoonnummer vast te leggen. Tijdens het overleg is ook afgesproken het huisadres te verwijderen en vestiging toe te voegen.

## Acceptatiecriteria

- [ ] Het formulier bevat naam, medewerkerscode, medewerkersrol, e-mailadres, land en vestiging.
- [ ] Geboortedatum, huisadres en telefoonnummer zijn uit het formulier en de bijbehorende validatie verwijderd en worden niet meegestuurd bij opslaan.
- [ ] De medewerkerscode is uniek; bij een ingevuld e-mailadres wordt het formaat gecontroleerd en land blijft via een landenkeuze beschikbaar.
- [ ] Het team legt vast welke overblijvende velden verplicht zijn en stemt de bron van de medewerkerscode af; er worden geen extra naamvelden als harde eis toegevoegd.
- [ ] Na succesvol opslaan is de medewerker in overzicht en details beschikbaar; fouten zijn bij de relevante velden zichtbaar.
- [ ] Meerdere rollen per medewerker worden pas toegevoegd na een expliciet scopebesluit.

**Besproken:** 5:06–12:28 en 22:48–23:30.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #16 - Medewerkersrollen beheren

**Voorgestelde prioriteit:** P1

Als beheerder wil ik medewerkersrollen kunnen aanmaken, wijzigen en verwijderen, zodat ik het rollenframework kan onderhouden.

Met rollen bedoelen we hier rollen die skills groeperen, zoals HR-manager of receptionist. Eigenaar en Beheerder zijn systeemrollen en vallen buiten dit rollenframework. Houd Rollen en Skills op aparte pagina's. Het selecteren van skills wordt in een gekoppeld ticket uitgewerkt.

## Acceptatiecriteria

- [ ] Er is een aparte pagina Rollen met een overzicht van de medewerkersrollen.
- [ ] Een bevoegde gebruiker kan een rol aanmaken en de naam en beschrijving wijzigen.
- [ ] De pagina biedt een begrijpelijke ingang om de skills van een rol te bekijken en te selecteren.
- [ ] Een rol die aan medewerkers is gekoppeld kan niet ongemerkt worden verwijderd; de interface toont welke koppeling dit blokkeert.
- [ ] Systeemrollen voor portaaltoegang verschijnen niet tussen medewerkersrollen.
- [ ] De interface kan op de eerstvolgende demo worden getoond; een nog ontbrekende databasekoppeling wordt daar expliciet bij vermeld.

**Besproken:** 12:31–17:50 en 22:48–23:42.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #17 - Medewerkersrol toekennen

**Voorgestelde prioriteit:** P1

Als beheerder wil ik een medewerkersrol kunnen kiezen, zodat duidelijk is welke rol en bijbehorende skills bij een medewerker horen.

Behoud de bestaande taak om een rol bij toevoegen en bewerken te kiezen. Tijdens het overleg werd meerdere rollen genoemd als verwachting, maar niet definitief vastgesteld; die keuze krijgt aparte refinement.

## Acceptatiecriteria

- [ ] Bij het toevoegen of bewerken kan een bestaande medewerkersrol worden geselecteerd.
- [ ] De geselecteerde rol is zichtbaar in het medewerkersoverzicht en op de detailpagina.
- [ ] De relatie met de aan de rol gekoppelde skills is voor de beheerder zichtbaar.
- [ ] Systeemrollen voor toegang tot het portaal worden niet via dit formulier toegekend.
- [ ] De keuze voor meerdere rollen en het effect van rolwijzigingen op bestaande medewerkersskills worden eerst expliciet vastgelegd.

**Besproken:** 5:06–6:37 en 12:31–17:50.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #18 - Portaalaccounts aanmaken binnen het huidige systeemrollenmodel

**Voorgestelde prioriteit:** P2 / backlog

Als beheerder wil ik medewerkers toegang tot het portaal kunnen geven, zodat zij met een eigen account kunnen inloggen.

Dit ticket behoudt de bestaande scope account aanmaken; de login- en logoutbackend staat in #19. In het overleg is de wens om gebruikers toe te voegen genoemd. De precieze uitnodigingsflow en fijnmazige rechten zijn nog niet besloten en krijgen geen voorrang op rollen en skills.

## Acceptatiecriteria

- [ ] De gewenste accountflow is vastgelegd: een account direct aanmaken of registreren via een uitnodiging; de keuze wordt eerst afgestemd.
- [ ] Een account heeft een uniek e-mailadres en een bestaande systeemrol; wachtwoorden worden alleen gehasht opgeslagen.
- [ ] Alleen een bevoegde beheerder kan het aanmaken of uitnodigen starten; dubbele accounts en invoerfouten krijgen een duidelijke melding.
- [ ] De bestaande instellingenpagina wordt aangesloten op de gekozen flow.
- [ ] Dit ticket introduceert geen individuele rechtenmatrix en geen managersportaal.

**Besproken:** 2:25–5:06 en 22:39–22:48.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #19 - Inloggen en uitloggen via de backend

**Voorgestelde prioriteit:** P1

Als portaalgebruiker wil ik via de backend kunnen inloggen en uitloggen, zodat mijn toegang door het systeem wordt gecontroleerd.

Dit ticket werkt de bestaande backendtaak uit. De frontend-inlogpagina heeft al een eigen ticket #6; accounts aanmaken staat in #18 en het afschermen van routes in #8.

## Acceptatiecriteria

- [ ] Inloggen controleert het account en een gehasht wachtwoord op de backend.
- [ ] Bij geldige gegevens wordt een sessie aangemaakt en opent het dashboard; onjuiste gegevens geven een begrijpelijke foutmelding.
- [ ] De frontend gebruikt deze backendflow in plaats van uitsluitend een lokale vergelijking van voorbeeldwachtwoorden.
- [ ] Uitloggen beëindigt de sessie op de backend en stuurt de gebruiker terug naar het inlogscherm.
- [ ] Inloggen, een onjuist wachtwoord en uitloggen worden gezamenlijk met de frontend gecontroleerd.

**Besproken:** 2:25–3:11 en 22:48–23:30.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

## Aangemaakte nieuwe issues

### #22 - Functies hernoemen naar Rollen en systeemrollen onderscheiden

**Voorgestelde prioriteit:** P1

Als gebruiker wil ik herkenbare termen in het portaal, zodat het systeem aansluit op de communicatie van Boon Edam.

De opdrachtgever wil de huidige pagina Functies voortaan Rollen noemen. Rollen, systeemrollen voor toegang en functietitels zijn drie verschillende begrippen.

## Acceptatiecriteria

- [ ] Het zijmenu, dashboard, paginatitels en relevante formulierlabels gebruiken Rollen voor het medewerkersrollenframework.
- [ ] Instellingen gebruikt Systeemrollen voor de toegangscategorieën zoals Eigenaar en Beheerder.
- [ ] Functietitels worden niet automatisch gelijkgesteld aan medewerkersrollen of systeemrollen.
- [ ] Bestaande navigatie blijft werken; een eventuele routewijziging behoudt een verwijzing vanaf de oude route.

**Besproken:** 12:31–14:16.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #23 - Skills beheren op een aparte pagina

**Voorgestelde prioriteit:** P1

Als beheerder wil ik een eigen skillsoverzicht, zodat ik het skillsframework kan onderhouden en skills aan rollen kan koppelen.

Houd Rollen en Skills als aparte pagina's. De opdrachtgever beschrijft periodiek onderhoud van standaardrollen en standaard skills, bijvoorbeeld jaarlijks.

## Acceptatiecriteria

- [ ] De pagina Skills toont de beschikbare skills en hun beschrijving of context.
- [ ] Een bevoegde beheerder kan een skill aanmaken en wijzigen.
- [ ] Een lege of dubbele skill wordt herkenbaar afgehandeld; gelijknamige externe skills kunnen via context en externe identificatie worden onderscheiden.
- [ ] Een gebruikte skill wordt niet zonder inzicht in de koppelingen verwijderd.
- [ ] Skills zijn beschikbaar voor selectie bij een medewerkersrol; de ESCO-bronkeuze wordt via het onderzoeksticket vastgelegd.

**Besproken:** 14:16–17:50 en 18:23–18:52.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #24 - Skills selecteren en onderhouden bij een medewerkersrol

**Voorgestelde prioriteit:** P1

Als beheerder wil ik skills bij een rol kunnen selecteren, zodat het rollenframework een vaste, inzichtelijke skillset per rol bevat.

De besproken oplossing is een selectie binnen het aanmaken of openen van een rol. Er is geen extra zelfstandige koppelpagina als harde eis afgesproken.

## Acceptatiecriteria

- [ ] Bij het aanmaken of openen van een rol kan de beheerder bestaande skills met selectievakjes of een gelijkwaardige selectie koppelen.
- [ ] Bestaande koppelingen zijn vooraf geselecteerd en skills kunnen worden toegevoegd en losgekoppeld.
- [ ] Het rollenoverzicht of de roldetailpagina maakt zichtbaar welke skills aan de rol hangen.
- [ ] Een geannuleerde bewerking verandert geen koppelingen; een opgeslagen selectie blijft bij opnieuw openen gelijk.
- [ ] Voor implementatie is vastgelegd hoe wijzigingen in de rolskillset doorwerken naar al gekoppelde medewerkers, zonder persoonlijke skills stilzwijgend te verliezen.

## Samenhang

Onderdeel van het rollenbeheer in #16; roltoekenning aan medewerkers staat in #17.

**Besproken:** 14:16–17:50.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #25 - ESCO-koppeling onderzoeken en een zoek- en filterprototype voorbereiden

**Voorgestelde prioriteit:** P1 / onderzoek

Als team wil ik vaststellen hoe we ESCO kunnen gebruiken, zodat rollen en skills uit verschillende sectoren herkenbaar geselecteerd kunnen worden.

De opdrachtgever vraagt de volledige breedte van ESCO beschikbaar te houden, omdat de eigen sector niet één-op-één in de indeling past. De technische aansluiting is nog niet onderzocht.

## Acceptatiecriteria

- [ ] Een korte notitie beschrijft de bruikbare officiële databron of API, beschikbare velden en benodigde talen, inclusief links naar de bron.
- [ ] Het voorstel sluit sectoren niet vooraf uit en beschrijft hoe zoeken en filteren de volledige verzameling hanteerbaar maken.
- [ ] Skillresultaten kunnen op basis van beschrijving, context en een stabiele ESCO-identificatie van elkaar worden onderscheiden.
- [ ] Een klein prototype of voorbeeld laat zien hoe een beheerder een rol of skill vindt en beoordeelt.
- [ ] Een uitvoerbaar vervolgvoorstel noemt de aanpak, beperkingen en eerstvolgende implementatietaak; een volledige integratie is geen impliciete deadline voor 11 november.

**Besproken:** 17:50–18:52.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #26 - Scope bepalen voor meerdere rollen per medewerker en afgeleide skills

**Voorgestelde prioriteit:** P3 / refinement

Als team wil ik de toekenningsregels verduidelijken, zodat het medewerkersmodel geen onbevestigde aannames bevat.

In de demo werd één rol per medewerker getoond. Meerdere rollen werd als verwachting genoemd; er volgde geen expliciet besluit over de regels.

## Acceptatiecriteria

- [ ] Er is een antwoord vastgelegd op de vraag of één medewerker meerdere medewerkersrollen moet kunnen hebben binnen deze opdracht.
- [ ] Als meerdere rollen nodig zijn, zijn de weergave en de combinatie van overlappende skills beschreven.
- [ ] Er is vastgelegd wat er gebeurt met medewerkersskills als een rol wordt toegevoegd, verwijderd of gewijzigd.
- [ ] De uitkomst is verwerkt in #5 en #17 voordat dit als extra functionaliteit wordt gebouwd.

**Besproken:** 5:06–6:37 en 14:16–17:50.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #27 - Import en export van rollen en skills afbakenen

**Voorgestelde prioriteit:** P3 / refinement

Als team wil ik weten welke import- en exportstromen nodig zijn, zodat het werk aansluit op de hoofdtaak van het portaal.

Import en export zijn in het overleg genoemd als belangrijker dan extra persoonsgegevens. Bestandsformaten, kolommen en concrete oplevereisen zijn nog niet besproken.

## Acceptatiecriteria

- [ ] De opdrachtgever heeft aangegeven welke gegevens geïmporteerd of geëxporteerd moeten worden: medewerkers, rollen, skills of koppelingen.
- [ ] Het gewenste bron- en doelformaat en minimaal één voorbeeldbestand zijn benoemd.
- [ ] De aanpak voor identificatie, dubbele gegevens en ongeldige regels is vastgelegd.
- [ ] De uitkomst is omgezet in afzonderlijke uitvoerbare tickets; dit onderzoek veronderstelt nog geen volledig gebouwde import- of exportmodule.

**Besproken:** 9:01–9:54.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #28 - Demo van Rollen en Skills voorbereiden voor 11 november

**Voorgestelde prioriteit:** P1 / demo

Als projectteam wil ik de voorgestelde opzet aan de opdrachtgever tonen, zodat we vroeg feedback krijgen op rollen, skills en hun koppeling.

De eerstvolgende besproken afspraak is woensdag 11 november 2026 om 14:30, met circa een halfuur beschikbaar. Een werkende interface is het doel; een volledige backendkoppeling werd niet toegezegd.

## Acceptatiecriteria

- [ ] De demo toont de terminologie Rollen en Systeemrollen en de aparte pagina's Rollen en Skills.
- [ ] De demo laat zien hoe skills aan een rol worden gekoppeld en bevat, indien haalbaar, de eerste ESCO-bevindingen.
- [ ] De wijzigingen aan medewerkersgegevens en vestiging zijn zichtbaar, of worden met een concrete status toegelicht.
- [ ] Het team benoemt duidelijk welke handelingen al worden opgeslagen en welke nog een prototype zijn.
- [ ] Er is een korte agenda met open vragen, passend binnen circa dertig minuten.

**Besproken:** 18:52–19:46 en 22:48–23:42.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

### #29 - Sprintcommunicatie en overlegafspraken vastleggen

**Voorgestelde prioriteit:** P2 / proces

Als projectteam wil ik voortgang en vragen tijdig delen, zodat de opdrachtgever zich op de wekelijkse bespreking kan voorbereiden.

Deze taak legt de afspraken vast. Het aanmaken van dit issue verstuurt geen berichten of uitnodigingen.

## Acceptatiecriteria

- [ ] Inhoudelijke vragen worden tijdens het werk verzameld en via de afgesproken Teams-chat gedeeld, in plaats van te wachten tot het overleg.
- [ ] Vrijdag aan het einde van de dag wordt een korte update voorbereid met lopende taken, voortgang en blokkades.
- [ ] De uitnodiging voor woensdag 11 november 2026 om 14:30 is door het team verzorgd.
- [ ] Voor de eindpresentatie op woensdag 16 december 2026 om 15:00 bij Boon Edam is een uitnodiging met exacte locatie en tijd geregeld.
- [ ] Open vragen krijgen een status en de reactie van de opdrachtgever wordt in het project bijgehouden.

**Besproken:** 19:46–21:24 en 23:54–27:01.

## Bron en afbakening

Uitgewerkt op basis van **Online vergadering.docx**, overleg van **4 november 2026**. De acceptatiecriteria vertalen de besproken behoefte naar uitvoerbare taken; technische details zijn voorstellen voor de uitwerking. Fijnmazige rechten per gebruiker zijn geparkeerd.

## Geparkeerd en open

- Individuele rechten per gebruiker en functionaliteit: geen prioriteit in deze fase.
- Managersportaal en verdere communicatie naar managers: buiten de huidige opdracht.
- Meerdere rollen per medewerker, doorwerking van wijzigingen aan rolskills, verplichte medewerkersvelden en import/export: eerst afstemmen.
- Certificaten: genoemd als vervolgwens; geen upload- of beheerfunctionaliteit als besloten eis toegevoegd.

Prioriteiten en acceptatiecriteria zijn een voorstel voor het scrumboard, afgeleid van de bespreking. De transcriptie bevat spraakherkenningsfouten; onduidelijke verwachtingen zijn daarom als open punten beschreven.

## Publicatiestatus

De samenvatting en de hierboven gekoppelde issues zijn toegevoegd aan de GitHub-repository. Koppeling aan het aparte GitHub Projects-board is nog niet uitgevoerd: de gebruikte aanmelding heeft geen Projects-toegang.
