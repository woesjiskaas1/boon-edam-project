import { useState } from "react";
import Button from "../components/atoms/Button";
import Select from "../components/atoms/Select";
import ConfirmDeleteDialog from "../components/molecules/ConfirmDeleteDialog";
import CertificateFormDialog from "../components/organisms/CertificateFormDialog";
import CertificateEmployeesDialog from "../components/organisms/CertificateEmployeesDialog";
import CertificateDetailsDialog from "../components/organisms/CertificateDetailsDialog";
import CertificatesGrid from "../components/organisms/CertificatesGrid";
import { certificateCategories } from "../data/certificates";
import { sortSkills } from "../utils/skillSorting";
import "../styles/skills.css";
import "../styles/certificates.css";

const sortOptions = [
  { value: "name:ascending", label: "Naam (A–Z)" },
  { value: "name:descending", label: "Naam (Z–A)" },
  { value: "employees:descending", label: "Meeste medewerkers" },
  { value: "employees:ascending", label: "Minste medewerkers" },
];

function Certificates({ certificates, employees = [], isExample = false, notice, onSaveCertificate, onDeleteCertificate }) {
  const [editor, setEditor] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificateDetails, setCertificateDetails] = useState(null);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [status, setStatus] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sorts, setSorts] = useState([{ column: "name", direction: "ascending" }]);
  const selectedCategory = categoryFilter.startsWith("category:")
    ? categoryFilter.slice("category:".length)
    : "";
  const categories = [...new Set([
    ...certificateCategories,
    ...certificates.map((certificate) => certificate.category?.trim()).filter(Boolean),
    ...(selectedCategory ? [selectedCategory] : []),
  ])].sort((first, second) => first.localeCompare(second, "nl"));
  const filters = [
    { value: "", label: "Alle categorieën" },
    ...categories.map((category) => ({ value: `category:${category}`, label: category })),
  ];
  if (categoryFilter === "uncategorized" || certificates.some((certificate) => !certificate.category?.trim())) {
    filters.push({ value: "uncategorized", label: "Zonder categorie" });
  }

  const matchingCertificates = certificates.filter((certificate) => {
    if (!categoryFilter) return true;
    const category = certificate.category?.trim() || "";
    return categoryFilter === "uncategorized" ? category === "" : category === selectedCategory;
  });
  const employeeCounts = new Map(certificates.map((certificate) => [
    certificate.id, certificate.employeeIds.length,
  ]));
  const visibleCertificates = sortSkills(matchingCertificates, employeeCounts, sorts);
  const primarySort = sorts[0];

  const handleSortChange = (event) => {
    const [column, direction] = event.target.value.split(":");
    setSorts((currentSorts) => [
      { column, direction },
      ...currentSorts.filter((sort) => sort.column !== column),
    ]);
  };

  const openEditor = (certificate = null) => {
    setStatus("");
    setEditor({ certificate });
  };

  const handleSave = (certificate) => {
    onSaveCertificate(certificate);
    setStatus(`${certificate.name} is ${certificate.id ? "bijgewerkt" : "toegevoegd"}.`);
  };

  const handleDelete = (certificate) => {
    onDeleteCertificate(certificate.id);
    setEditor(null);
    setStatus(`${certificate.name} is verwijderd.`);
  };

  return (
    <section className="skills-page certificates-page" aria-labelledby="certificates-page-title">
      <header className="employees-header skills-header">
        <div>
          <h1 id="certificates-page-title">Certificaten</h1>
          <p>{notice || "Beheer de certificaten binnen je organisatie."}</p>
        </div>
        <Button variant="primary" onClick={() => openEditor()}>
          <span aria-hidden="true">+</span> Certificaat toevoegen
        </Button>
      </header>

      <div className="certificates-toolbar">
        <div className="certificates-filters" role="group" aria-label="Filter op categorie">
          {filters.map(({ value, label }) => (
            <Button
              key={value}
              className="certificates-filter"
              aria-pressed={categoryFilter === value}
              onClick={() => setCategoryFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <label className="certificates-sort">
          <span>Sorteren</span>
          <Select value={`${primarySort.column}:${primarySort.direction}`} onChange={handleSortChange}>
            {sortOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </label>
      </div>

      <CertificatesGrid
        certificates={visibleCertificates}
        total={certificates.length}
        onShowDetails={setCertificateDetails}
        onShowEmployees={setSelectedCertificate}
        onEdit={openEditor}
      />

      <p className="certificates-result" role="status" aria-atomic="true">
        {categoryFilter ? `${visibleCertificates.length} van ` : ""}
        {certificates.length} {certificates.length === 1 ? "certificaat" : "certificaten"}
      </p>
      <p className="skills-status" role="status">{status}</p>

      {certificateDetails && (
        <CertificateDetailsDialog
          certificate={certificateDetails}
          onClose={() => setCertificateDetails(null)}
        />
      )}

      {selectedCertificate && (
        <CertificateEmployeesDialog
          certificate={selectedCertificate}
          employees={employees}
          isExample={isExample}
          onClose={() => setSelectedCertificate(null)}
        />
      )}

      {editor && (
        <CertificateFormDialog
          certificate={editor.certificate}
          certificates={certificates}
          categories={categories}
          defaultCategory={selectedCategory}
          onSave={handleSave}
          onDelete={(certificate) => {
            setStatus("");
            setCertificateToDelete(certificate);
          }}
          onClose={() => setEditor(null)}
        />
      )}

      {certificateToDelete && (
        <ConfirmDeleteDialog
          title="Certificaat verwijderen?"
          description={`Weet je zeker dat je het certificaat “${certificateToDelete.name}” wilt verwijderen? Het certificaat verdwijnt uit dit overzicht, inclusief de medewerkerkoppelingen.`}
          onConfirm={() => handleDelete(certificateToDelete)}
          onClose={() => setCertificateToDelete(null)}
        />
      )}
    </section>
  );
}

export default Certificates;
