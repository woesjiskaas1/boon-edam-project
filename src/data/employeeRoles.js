// All employee functions within Boon Edam.
// Each function has default skills that can be adjusted per employee.
const employeeRoles = [
  { id: "hr-manager", name: "HR Manager", defaultSkills: ["communicatie", "personeelsbeleid"] },
  { id: "software-developer", name: "Software Developer", defaultSkills: ["javascript", "react"] },
  { id: "project-manager", name: "Project Manager", defaultSkills: ["planning", "communicatie"] },
  { id: "marketing-specialist", name: "Marketing Specialist", defaultSkills: ["communicatie", "seo"] },
  { id: "it-support", name: "IT Support", defaultSkills: ["netwerkbeheer", "klantcontact"] },
  { id: "sales-manager", name: "Sales Manager", defaultSkills: ["klantcontact", "onderhandelen"] },
];

export default employeeRoles;