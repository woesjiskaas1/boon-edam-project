// Voorbeeldcertificaten voor als de certificaten-API leeg of niet beschikbaar is.
const certificates = [
  { id: "vca-basis", name: "VCA Basis", category: "Veiligheid", employeeIds: [] },
  { id: "vca-vol", name: "VOL-VCA", category: "Veiligheid", employeeIds: [] },
  { id: "bhv", name: "BHV", category: "Veiligheid", employeeIds: [] },
  { id: "ehbo", name: "EHBO", category: "Veiligheid", employeeIds: [] },
  { id: "nen-3140", name: "NEN 3140", category: "Techniek", employeeIds: [] },
  { id: "heftruck", name: "Heftruckcertificaat", category: "Techniek", employeeIds: [] },
  { id: "prince2", name: "PRINCE2 Foundation", category: "Organisatie", employeeIds: [] },
];

export const certificateCategories = ["Organisatie", "Techniek", "Veiligheid"];

export default certificates;
