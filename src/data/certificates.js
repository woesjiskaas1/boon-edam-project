// Voorbeeldcertificaten met koppelingen naar de fictieve medewerkers uit de demo.
const certificates = [
  {
    id: "vca-basis",
    name: "VCA Basis",
    category: "Veiligheid",
    employeeIds: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP006"],
  },
  {
    id: "vca-vol",
    name: "VOL-VCA",
    category: "Veiligheid",
    employeeIds: ["EMP005", "EMP007"],
  },
  {
    id: "bhv",
    name: "BHV",
    category: "Veiligheid",
    employeeIds: ["EMP001", "EMP005", "EMP007"],
  },
  {
    id: "ehbo",
    name: "EHBO",
    category: "Veiligheid",
    employeeIds: ["EMP003", "EMP005"],
  },
  {
    id: "veilig-werken-op-hoogte",
    name: "Veilig werken op hoogte",
    category: "Veiligheid",
    employeeIds: ["EMP002", "EMP004"],
  },
  {
    id: "nen-3140",
    name: "NEN 3140 VOP",
    category: "Techniek",
    employeeIds: ["EMP002", "EMP003", "EMP004"],
  },
  {
    id: "heftruck",
    name: "Heftruckcertificaat",
    category: "Techniek",
    employeeIds: ["EMP006"],
  },
  {
    id: "onderhoud-automatische-deuren",
    name: "Onderhoud van automatische deuren",
    category: "Techniek",
    employeeIds: ["EMP002", "EMP003", "EMP004", "EMP006"],
  },
  {
    id: "storingsdiagnose-automatische-deuren",
    name: "Storingsdiagnose bij automatische deuren",
    category: "Techniek",
    employeeIds: [],
  },
  {
    id: "prince2",
    name: "PRINCE2 Foundation",
    category: "Organisatie",
    employeeIds: ["EMP005"],
  },
  {
    id: "werkplekinstructie",
    name: "Werkplekinstructie",
    category: "Organisatie",
    employeeIds: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP006"],
  },
];

export const certificateCategories = ["Organisatie", "Techniek", "Veiligheid"];

export default certificates;
