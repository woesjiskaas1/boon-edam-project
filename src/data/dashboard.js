export const currentUser = { name: 'John Doe', firstName: 'John', initials: 'JD', role: 'Eigenaar' }

export const navigation = [
  { name: 'Dashboard', icon: 'home' },
  { name: 'Medewerkers', icon: 'users' },
  { name: 'Rollen', icon: 'shield' },
]

export const roles = [
  { name: 'Eigenaar', description: 'Volledig overzicht en toegang tot de gehele beheeromgeving.' },
  { name: 'Beheerder', description: 'Beheert medewerkers, accounts en rollen binnen de organisatie.' },
  { name: 'HR-manager', description: 'Houdt medewerkersgegevens en uitnodigingen up-to-date.' },
  { name: 'Teamleider', description: 'Heeft inzicht in de medewerkers van het eigen team.' },
  { name: 'Medewerker', description: 'Heeft toegang tot de eigen gegevens en toegewezen onderdelen.' },
  { name: 'Gast', description: 'Heeft beperkte toegang tot gedeelde informatie.' },
]

// Fictieve voorbeeldpersonen; dashboardaantallen worden uit deze gegevens afgeleid.
export const initialEmployees = [
  { id: 1, name: currentUser.name, email: 'john.doe@boonedam.nl', role: currentUser.role, status: 'Actief' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@boonedam.nl', role: 'Medewerker', status: 'Uitgenodigd' },
]

export const initialActivities = [
  { id: 1, text: 'Jane Doe is uitgenodigd', time: '2 uur geleden', icon: 'user-plus', invited: true },
  { id: 2, text: 'John Doe heeft zijn account bijgewerkt', time: '1 dag geleden', icon: 'user' },
  { id: 3, text: 'Rol Beheerder is bijgewerkt', time: '2 dagen geleden', icon: 'shield' },
  { id: 4, text: 'John Doe is toegevoegd', time: '3 dagen geleden', icon: 'user-plus' },
  { id: 5, text: 'Uitnodiging verstuurd naar jane.doe@boonedam.nl', time: '3 dagen geleden', icon: 'mail', invited: true },
  { id: 6, text: 'Rol Teamleider is aangemaakt', time: '4 dagen geleden', icon: 'shield' },
  { id: 7, text: 'Rol Medewerker is aangemaakt', time: '5 dagen geleden', icon: 'shield' },
]
