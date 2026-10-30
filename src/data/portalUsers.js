// Wie er nu "ingelogd" is. Er is nog geen echte login,
// dus voor de demo zetten we hier vast een id neer.
// Verander dit getal om te zien wat een andere gebruiker mag.
export const currentUserId = 2;

// Mensen die toegang hebben tot het portaal (voorbeelddata).
// "accessRoleId" verwijst naar een id uit accessRoles.js.
const portalUsers = [
  { id: 1, name: "John Doe", email: "john.doe@boonedam.com", accessRoleId: "owner" },
  { id: 2, name: "Jane Doe", email: "jane.doe@boonedam.com", accessRoleId: "admin" },
  { id: 3, name: "Jan de Vries", email: "jan.devries@boonedam.com", accessRoleId: "editor" },
  { id: 4, name: "Sophie Jansen", email: "sophie.jansen@boonedam.com", accessRoleId: "viewer" },
];

export default portalUsers;