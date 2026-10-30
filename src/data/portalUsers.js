// Mensen die toegang hebben tot het portaal (voorbeelddata).
// "accessRoleId" verwijst naar een id uit accessRoles.js.
// LET OP: wachtwoorden staan hier alleen voor de demo als gewone tekst.
// In een echt systeem bewaart alleen de server een versleutelde versie.
const portalUsers = [
  { id: 1, name: "John Doe", email: "john.doe@boonedam.com", password: "Welkom123", accessRoleId: "owner" },
  { id: 2, name: "Jane Doe", email: "jane.doe@boonedam.com", password: "Welkom123", accessRoleId: "admin" },
  { id: 3, name: "Jan de Vries", email: "jan.devries@boonedam.com", password: "Welkom123", accessRoleId: "editor" },
  { id: 4, name: "Leo Visscher", email: "leovisscher07@gmail.com", password: "1234", accessRoleId: "viewer" },
];

// Mensen die zijn uitgenodigd, maar nog geen account hebben.
// Alleen met een e-mailadres uit deze lijst kun je je registreren.
// De beheerder bepaalt bij het uitnodigen welke toegangsrol iemand krijgt.
export const invitations = [
  { email: "lisa.bakker@boonedam.com", accessRoleId: "editor" },
  { email: "tom.smit@boonedam.com", accessRoleId: "viewer" },
];

export default portalUsers;