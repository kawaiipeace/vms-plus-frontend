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
      onPageSizeChange(newLimit); // Update parent state
    };
  
    return (
      <div className="flex justify-between items-center mt-5 dt-bottom flex-col-reverse md:flex-row gap-5">
        <div className="flex items-center gap-2 w-full justify-center">
          <div className="dt-info" aria-live="polite" role="status">
            แสดง{" "}
            {Math.min(page * limit - limit + 1, total)} ถึง{" "}
            {Math.min(page * limit, total)} จาก {total} รายการ
          </div>
  
          <Paginationselect
            w="w-[5em]"
            position="top"
            options={["10", "25", "50", "100"]}
            value={limit} // Pass the updated limit
            onChange={handlePageSizeChange} // Pass the handler
          />
        </div>
  
        <div className="pagination flex justify-center md:justify-end w-full ">
          <div className="join">
            <button
              className="join-item btn btn-sm btn-outline"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <i className="material-symbols-outlined">chevron_left</i>
            </button>
  
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (p) => (
                <button
                  key={p}
                  className={`join-item btn btn-sm btn-outline ${
                    page === p ? "active !bg-primary-grayBorder" : ""
                  }`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              )
            )}
  
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
