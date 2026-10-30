// Toegangsrollen bepalen wat iemand in het PORTAAL mag doen.
// Dit is iets anders dan employeeRoles.js. Dat zijn functies van
// medewerkers (bijv. Software Developer). Dit zijn toegangsrechten in de app.

// Alle rechten die er zijn. Named export, want dit bestand
// geeft twee dingen door (zie ook export default onderaan).
export const permissions = [
  { key: "view", label: "Medewerkers en rollen bekijken" },
  { key: "edit", label: "Medewerkers en rollen toevoegen en aanpassen" },
  { key: "settings", label: "Instellingen en toegang beheren" },
];

const accessRoles = [
  {
    id: "owner",
    name: "Eigenaar",
    description: "Eigenaar van het portaal. Kan alles en kan niet verwijderd worden.",
    rights: { view: true, edit: true, settings: true },
  },
  {
    id: "admin",
    name: "Beheerder",
    description: "Kan alles, ook de instellingen en wie toegang heeft.",
    rights: { view: true, edit: true, settings: true },
  },
  {
    id: "editor",
    name: "Bewerker",
    description: "Kan medewerkers en rollen toevoegen en aanpassen.",
    rights: { view: true, edit: true, settings: false },
  },
  {
    id: "viewer",
    name: "Lezer",
    description: "Kan alles bekijken, maar niets aanpassen.",
    rights: { view: true, edit: false, settings: false },
  },
];

export default accessRoles;