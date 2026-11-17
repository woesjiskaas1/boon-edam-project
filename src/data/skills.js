// Voorbeeldskills voor als de skills-API leeg of niet beschikbaar is.
// "id" gebruiken we in de code, "name" laten we zien op het scherm.
const skills = [
  { id: "communicatie", name: "Communicatie", category: "Communicatie" },
  { id: "klantcontact", name: "Klantcontact", category: "Communicatie" },
  { id: "onderhandelen", name: "Onderhandelen", category: "Communicatie" },
  { id: "seo", name: "SEO", category: "Communicatie" },

  { id: "netwerkbeheer", name: "Netwerkbeheer", category: "Interne systemen" },
  { id: "erp-systeem", name: "ERP-systeem", category: "Interne systemen" },
  { id: "crm-systeem", name: "CRM-systeem", category: "Interne systemen" },
  { id: "documentbeheer", name: "Documentbeheer", category: "Interne systemen" },

  { id: "personeelsbeleid", name: "Personeelsbeleid", category: "Organisatie" },
  { id: "planning", name: "Planning", category: "Organisatie" },
  { id: "projectcoordinatie", name: "Projectcoördinatie", category: "Organisatie" },
  { id: "voorraadbeheer", name: "Voorraadbeheer", category: "Organisatie" },

  { id: "javascript", name: "JavaScript", category: "Techniek" },
  { id: "react", name: "React", category: "Techniek" },
  { id: "montage-draaideuren", name: "Montage draaideuren", category: "Techniek" },
  { id: "storingsanalyse", name: "Storingsanalyse", category: "Techniek" },

  { id: "veilig-werken", name: "Veilig werken", category: "Veiligheid" },
  { id: "machineveiligheid", name: "Machineveiligheid", category: "Veiligheid" },
  { id: "ehbo", name: "EHBO", category: "Veiligheid" },
  { id: "persoonlijke-beschermingsmiddelen", name: "Persoonlijke beschermingsmiddelen", category: "Veiligheid" },
];

export default skills;
