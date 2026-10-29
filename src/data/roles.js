// Alle functies (rollen) binnen Boon Edam.
// Elke rol heeft "defaultSkills": de skills die een medewerker
// met deze rol standaard krijgt. HR kan ze daarna per persoon aanpassen.
const roles = [
  { id: "hr-manager", name: "HR Manager", defaultSkills: ["communicatie", "personeelsbeleid"] },
  { id: "software-developer", name: "Software Developer", defaultSkills: ["javascript", "react"] },
  { id: "project-manager", name: "Project Manager", defaultSkills: ["planning", "communicatie"] },
  { id: "marketing-specialist", name: "Marketing Specialist", defaultSkills: ["communicatie", "seo"] },
  { id: "it-support", name: "IT Support", defaultSkills: ["netwerkbeheer", "klantcontact"] },
  { id: "sales-manager", name: "Sales Manager", defaultSkills: ["klantcontact", "onderhandelen"] },
];

export default roles;