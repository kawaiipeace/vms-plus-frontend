interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageRange = 3;
  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  const endPage = Math.min(totalPages, startPage + pageRange - 1);

  if (endPage - startPage + 1 < pageRange) {
    startPage = Math.max(1, endPage - pageRange + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <div className="join">
      <button
        className="join-item btn btn-sm btn-outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="material-symbols-outlined">chevron_left</i>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`join-item btn btn-sm btn-outline ${currentPage === page ? "btn-active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="join-item btn btn-sm btn-outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="material-symbols-outlined">chevron_right</i>
      </button>
    </div>
  );
}
