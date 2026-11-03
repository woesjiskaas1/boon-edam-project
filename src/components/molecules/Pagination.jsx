import Button from "../atoms/Button";

export default function Pagination({ currentPage, totalPages, onPageChange, children }) {
  return (
    <div className="pagination">
      <p className="pagination-info" aria-live="polite">{children}</p>
      <nav className="pagination-controls" aria-label="Paginering">
        <Button variant="pagination" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          Vorige
        </Button>
        <span className="pagination-current">Pagina {currentPage} van {totalPages}</span>
        <Button variant="pagination" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          Volgende
        </Button>
      </nav>
    </div>
  );
}
