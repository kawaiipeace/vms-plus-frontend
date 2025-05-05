import React from "react";
import Paginationselect from "@/components/table/paginationSelect";
import { PaginationType } from "@/app/types/request-action-type";

type PaginationControlsProps = {
  pagination: PaginationType;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newLimit: number) => void;
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const { page, limit, total, totalPages } = pagination;

  const handlePageSizeChange = (newLimit: number) => {
    onPageSizeChange(newLimit);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Adjust this number as needed

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there aren't too many
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      // Adjust if we're at the beginning or end
      if (page <= 3) {
        end = 3;
      } else if (page >= totalPages - 2) {
        start = totalPages - 2;
      }

      // Add ellipsis if there's a gap after first page
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if there's a gap before last page
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-5 dt-bottom flex-col-reverse md:flex-row gap-5">
      <div className="flex items-center gap-2 w-full justify-center md:justify-start">
        <div className="dt-info" aria-live="polite" role="status">
          แสดง{" "}
          {Math.min(page * limit - limit + 1, total)} ถึง{" "}
          {Math.min(page * limit, total)} จาก {total} รายการ
        </div>

        <Paginationselect
          w="w-[5em]"
          position="top"
          options={["10", "25", "50", "100"]}
          value={limit}
          onChange={handlePageSizeChange}
        />
      </div>

      <div className="pagination flex justify-center md:justify-end w-full">
        <div className="join">
          <button
            className="join-item btn btn-sm btn-outline"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <i className="material-symbols-outlined">chevron_left</i>
          </button>

          {getPageNumbers().map((p, index) => (
            <button
              key={index}
              className={`join-item btn btn-sm btn-outline ${
                page === p ? "active bg-primary-grayBorder" : ""
              }`}
              onClick={() => typeof p === 'number' ? onPageChange(p) : null}
              disabled={p === '...'}
            >
              {p}
            </button>
          ))}

          <button
            className="join-item btn btn-sm btn-outline"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <i className="material-symbols-outlined">chevron_right</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;