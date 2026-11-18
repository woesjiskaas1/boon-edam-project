import { useState } from "react";
import Button from "../components/atoms/Button";
import SkillsTable from "../components/organisms/SkillsTable";
import CertificateFormDialog from "../components/organisms/CertificateFormDialog";
import SkillDeleteDialog from "../components/organisms/SkillDeleteDialog";
import { certificateCategories } from "../data/certificates";
import "../styles/skills.css";

function Certificates({ certificates, error, onSaveCertificate, onDeleteCertificate }) {
  const [editor, setEditor] = useState(null);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [status, setStatus] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const selectedCategory = categoryFilter.startsWith("category:")
    ? categoryFilter.slice("category:".length)
    : "";
  const categories = [...new Set([
    ...certificateCategories,
    ...certificates.map((certificate) => certificate.category?.trim()).filter(Boolean),
    ...(selectedCategory ? [selectedCategory] : []),
  ])].sort((first, second) => first.localeCompare(second, "nl"));
  const visibleCertificates = certificates.filter((certificate) => {
    if (!categoryFilter) return true;
    const category = certificate.category?.trim() || "";
    return categoryFilter === "uncategorized" ? category === "" : category === selectedCategory;
  });
  const employeeCounts = new Map(certificates.map((certificate) => [
    certificate.id, certificate.employeeIds.length,
  ]));

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
    <section className="skills-page" aria-labelledby="certificates-page-title">
      <header className="employees-header skills-header">
        <div>
          <h1 id="certificates-page-title">Certificaten</h1>
          <p>Beheer de certificaten binnen je organisatie.</p>
        </div>
        <Button variant="primary" onClick={() => openEditor()}>
          <span aria-hidden="true">+</span> Certificaat toevoegen
        </Button>
      </header>

      {error && <p className="auth-error" role="alert">{error} Voorbeeldcertificaten worden getoond.</p>}

      <SkillsTable
        skills={visibleCertificates}
        allSkills={certificates}
        nameLabel="Certificaat"
        collectionLabel="Certificaten"
        employeeCounts={employeeCounts}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onEdit={openEditor}
        emptyMessage={certificates.length > 0
          ? "Geen certificaten gevonden in deze categorie. Kies een andere categorie of wis het filter."
          : "Er zijn nog geen certificaten. Voeg je eerste certificaat toe."}
      />

      <div className="skills-footer">
        <span role="status" aria-atomic="true">
          {categoryFilter ? `${visibleCertificates.length} van ` : ""}
          {certificates.length} {certificates.length === 1 ? "certificaat" : "certificaten"}
          {categoryFilter ? ` · ${selectedCategory || "Zonder categorie"}` : ""}
        </span>
        <span>Centraal overzicht van alle certificaten</span>
      </div>
      <p className="skills-status" role="status">{status}</p>

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
        <SkillDeleteDialog
          skill={certificateToDelete}
          title="Certificaat verwijderen?"
          description={`Weet je zeker dat je het certificaat “${certificateToDelete.name}” wilt verwijderen? Het certificaat verdwijnt uit dit overzicht, inclusief de medewerkerkoppelingen.`}
          onConfirm={handleDelete}
          onClose={() => setCertificateToDelete(null)}
        />
      )}
    </section>
  );
}

export default Certificates;
