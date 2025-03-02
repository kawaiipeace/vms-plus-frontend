"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import Paginationselect from "./paginationSelect";

// Make TableComponent generic
type TableComponentProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

export default function TableComponent<T>({
  data,
  columns,
}: TableComponentProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: (
      updater: PaginationState | ((old: PaginationState) => PaginationState)
    ) => {
      if (typeof updater === "function") {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      } else {
        setPageIndex(updater.pageIndex ?? pageIndex);
        setPageSize(updater.pageSize ?? pageSize);
      }
    },
  });

  useEffect(() => {
    setPageCount(table.getPageCount());
  }, [table.getPageCount()]);

  return (
    <>
      <div className="mt-5 overflow-x-auto  rounded-xl ">
        <table className="w-full dataTable">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span
                      className={`dt-column-title flex gap-2 ${
                        header.column.columnDef.header == ""
                          ? "justify-center"
                          : ""
                      }`}
                    >
                      {header.column.columnDef.header as string}
                      {header.column.getIsSorted() === "asc" ? (
                        <i className="material-symbols-outlined text-black">
                          arrow_upward_alt
                        </i>
                      ) : header.column.getIsSorted() === "desc" ? (
                        <i className="material-symbols-outlined text-black">
                          arrow_downward_alt
                        </i>
                      ) : (
                        <i className="material-symbols-outlined">
                          import_export
                        </i>
                      )}
                    </span>
                  </th>
                ))}
                <th></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={` ${
                  index === 0 ? "" : "border-t"
                } border-gray-200 text-left`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {cell.column.columnDef.header === "สถานะคำขอ" ? (
                      <div className="w-full text-center">
                        <span className="badge badge-pill-outline badge-error">
                          {cell.renderValue() as React.ReactNode}
                        </span>
                      </div>
                    ) : cell.column.columnDef.header === "" ? (
                      <>
                      <div className="dt-action">
                        <button
                          className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                          data-tip="ดูรายละเอียดคำขอ"
                          onClick={() => router.push('request-list/1')}
                        >
                          <i className="material-symbols-outlined icon-settings-fill-300-24">
                            quick_reference_all
                          </i>
                        </button>
                        <button
                          className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                          data-tip="แก้ไข"
                          onClick={() => router.push('request-list/edit/1')}
                        >
                          <i className="material-symbols-outlined icon-settings-fill-300-24">
                            stylus
                          </i>
                        </button>
                        <div className="dropdown dropdown-left dropdown-end">
                    <div
                      className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none"
                      tabIndex={0}
                      role="button"
                    >
                      <i className="material-symbols-outlined icon-settings-fill-300-24">
                        more_vert
                      </i>
                    </div>

                    <ul
                      className="dropdown-menu dropdown-content z-[1] max-w-[200px] w-[200px]"
                      tabIndex={0}
                    >
                      <a className="dropdown-item" href="#">
                        <i className="material-symbols-outlined">
                          add_location_alt
                        </i>
                        บันทึกเดินทาง
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="material-symbols-outlined">
                          local_gas_station
                        </i>
                        เติมเชื้อเพลิง
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="material-symbols-outlined">id_card</i>
                        แสดงบัตรเดินทาง
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#">
                        <i className="material-symbols-outlined">reply</i>
                        คืนยานพาหนะ
                      </a>
                    </ul>
                  </div>
                      </div>

                      
                      </>
                    ) : (
                      (cell.renderValue() as React.ReactNode)
                    )}
                  </td>
                ))}

                <td>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-5 dt-bottom">
        <div className="flex items-center gap-2">
          <div
            className="dt-info"
            aria-live="polite"
            id="DataTables_Table_0_info"
            role="status"
          >
            แสดง {Math.min(pageIndex * pageSize + 1, table.getRowCount())} ถึง{" "}
            {Math.min((pageIndex + 1) * pageSize, table.getRowCount())} จาก{" "}
            {table.getRowCount()} รายการ
          </div>
          <Paginationselect
            w="w-[5em]"
            position="top"
            options={["10", "25", "50", "100"]}
            value={String(table.getState().pagination.pageSize)}
            onChange={(selectedValue) =>
              table.setPageSize(Number(selectedValue))
            }
          />
        </div>

        <div className="pagination flex justify-end">
          <div className="join">
            <button
              className="join-item btn btn-sm btn-outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="material-symbols-outlined">chevron_left</i>
            </button>

            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className="join-item btn btn-sm btn-outline active"
                  onClick={() => table.setPageIndex(page - 1)} // Add logic to navigate to the specific page
                >
                  {page}
                </button>
              )
            )}
            <button
              className="join-item btn btn-sm btn-outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <i className="material-symbols-outlined">chevron_right</i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
