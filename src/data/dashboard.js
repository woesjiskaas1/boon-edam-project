export const currentUser = { name: 'Robin de Vries', firstName: 'Robin', initials: 'RV', role: 'Eigenaar' }

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

const names = ['Emma Jansen', 'Noah Bakker', 'Sophie de Groot', 'Lucas Visser', 'Julia Smit', 'Daan Meijer', 'Mila de Boer', 'Levi Mulder', 'Tess de Vries', 'Finn Bos', 'Sara Vos', 'Sem Peters', 'Nora Hendriks', 'Liam Dekker', 'Eva van Dijk', 'Luuk Brouwer', 'Lotte de Wit', 'Mees Dijkstra', 'Zoë Smits', 'Bram de Graaf', 'Anna Kok', 'Noud Jacobs', 'Evi van Leeuwen', 'Jesse Vermeer', 'Fien van den Berg', 'Max Willems', 'Liv van Vliet', 'Thomas de Ruiter', 'Isa van Beek', 'Sam van der Meer', 'Lynn Hoekstra', 'Milan Kuiper', 'Saar van Dam', 'Adam Scholten', 'Maud de Bruin', 'Thijs van Rijn', 'Roos Post', 'Siem van der Wal', 'Noor Veldman', 'Stijn Timmer', 'Elin Verhoeven', 'Olivier van Loon', 'Bo van Houten', 'Floris Prins', 'Fleur van Es', 'Benjamin Stam', 'Lara de Jong', 'Robin de Vries']

function employeeRole(index) {
  if (index === 47) return 'Eigenaar'
  if (index === 0) return 'Beheerder'
  if (index < 3) return 'Medewerker'
  if (index % 13 === 0) return 'Gast'
  if (index % 11 === 0) return 'HR-manager'
  if (index % 9 === 0) return 'Teamleider'
  if (index % 4 === 0) return 'Beheerder'
  return 'Medewerker'
}

// Fictieve gegevens; de beginwaarden sluiten aan op het gekozen ontwerp.
export const initialEmployees = names.map((name, index) => ({
  id: index + 1,
  name,
  email: `${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('.')}@boonedam.nl`,
  role: employeeRole(index),
  status: index === 2 || (index >= 43 && index < 47) ? 'Uitgenodigd' : 'Actief',
}))

export const initialActivities = [
  { id: 1, text: 'Sophie de Groot is uitgenodigd', time: '2 uur geleden', icon: 'user-plus', invited: true },
  { id: 2, text: 'Noah Bakker is toegevoegd', time: '1 dag geleden', icon: 'users' },
  { id: 3, text: 'Rol Beheerder is bijgewerkt', time: '2 dagen geleden', icon: 'shield' },
  { id: 4, text: 'Emma Jansen is toegevoegd', time: '3 dagen geleden', icon: 'user-plus' },
  { id: 5, text: 'Uitnodiging verstuurd naar sophie.de.groot@boonedam.nl', time: '3 dagen geleden', icon: 'mail', invited: true },
  { id: 6, text: 'Rol Teamleider is aangemaakt', time: '4 dagen geleden', icon: 'shield' },
  { id: 7, text: 'Lucas Visser is toegevoegd', time: '5 dagen geleden', icon: 'users' },
]
