"use client";

import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Paginationselect from "./table/paginationSelect";
// import Link from "next/link";

// Make TableComponent generic
type TableComponentProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  listName?: string;
  editRecordTravel?: (data: T) => void;
  deleteRecordTravel?: (data: T) => void;
  previewRecordTravel?: (data: T) => void;
};

export default function TableRecordTravelComponent<T>({
  data,
  columns,
  listName,
  editRecordTravel,
  deleteRecordTravel,
  previewRecordTravel,
}: TableComponentProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  // const router = useRouter();
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
      if (typeof updater === "function") {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      } else {
        setPageIndex(updater.pageIndex ?? pageIndex);
        setPageSize(updater.pageSize ?? pageSize);
      }
    },
    defaultColumn: {
      enableSorting: false,
    },
  });

  useEffect(() => {
    setPageCount(table.getPageCount());
  }, [table]);

  return (
    <>
      <div className="block md:hidden space-y-4">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="bg-white dark:bg-black shadow-md rounded-lg border">
            {row.getVisibleCells().map((cell) => {
              const value = cell.renderValue() as React.ReactNode;
              const dateTime = cell.column.id.includes("datetime") || cell.column.id.includes("date");
              const header = table.getHeaderGroups()[0].headers.find((header) => header.id === cell.column.id);

              if (header?.id === "action") {
                return "";
              }
              if (dateTime) {
                const convertDate =
                  convertToBuddhistDateTime(value as string).date +
                  " " +
                  convertToBuddhistDateTime(value as string).time;
                return (
                  <div key={cell.id} className="grid grid-cols-2  p-4 border-b border-[#EAECF0] items-center">
                    <span className="font-semibold flex items-center justify-start">
                      {header ? flexRender(header?.column.columnDef.header, header?.getContext()) : ""}
                    </span>
                    <span className="flex justify-end">{value ? convertDate : "-"}</span>
                  </div>
                );
              }

              return (
                <div key={cell.id} className="grid grid-cols-2  p-4 border-b border-[#EAECF0] items-center">
                  <span className="font-semibold flex items-center justify-start">
                    {header ? flexRender(header?.column.columnDef.header, header?.getContext()) : ""}
                  </span>
                  <span className="flex justify-end">{value ? value : "-"}</span>
                </div>
              );
            })}
            {listName == "request" && (
              <div className="grid grid-cols-2  p-4 border-b border-[#EAECF0] items-center gap-4">
                {editRecordTravel && (
                  <button
                    data-tip="แก้ไข"
                    className="btn btn-secondary w-full text-base font-semibold"
                    onClick={() => {
                      editRecordTravel?.(row.original);
                    }}
                  >
                    <i className="material-symbols-outlined  w-5 h-5 ">stylus</i>แก้ไข
                  </button>
                )}
                {deleteRecordTravel && (
                  <button
                    className="btn btn-secondary w-full text-base font-semibold"
                    data-tip="ลบ"
                    onClick={() => {
                      deleteRecordTravel?.(row.original);
                    }}
                  >
                    <i className="material-symbols-outlined  w-5 h-5">delete</i>ลบ
                  </button>
                )}
              </div>
            )}
            {listName == "fuel" && (
              <div className="grid grid-cols-2  p-4 border-b border-[#EAECF0] items-center gap-4">
                {editRecordTravel && (
                  <button
                    className="btn btn-secondary w-full text-base font-semibold"
                    data-tip="แก้ไข"
                    onClick={() => {
                      editRecordTravel?.(row.original);
                    }}
                  >
                    <i className="material-symbols-outlined w-5 h-5">stylus</i>แก้ไข
                  </button>
                )}
                {deleteRecordTravel && (
                  <button
                    className="btn btn-secondary w-full text-base font-semibold"
                    data-tip="ลบ"
                    onClick={() => {
                      deleteRecordTravel?.(row.original);
                    }}
                  >
                    <i className="material-symbols-outlined w-5 h-5">delete</i>ลบ
                  </button>
                )}
                <button
                  className="btn btn-secondary w-full text-base font-semibold col-span-2"
                  data-tip="รูปใบเสร็จ"
                  onClick={() => {
                    previewRecordTravel?.(row.original);
                  }}
                >
                  <i className="material-symbols-outlined w-5 h-5">imagesmode</i>ดูรูปใบเสร็จ
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 hidden md:block overflow-x-auto rounded-xl">
        <table className="w-full dataTable">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-base font-semibold">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-2 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      <span>
                        {{
                          asc: <i className="material-symbols-outlined text-black select-none">arrow_upward_alt</i>,
                          desc: <i className="material-symbols-outlined text-black select-none">arrow_downward_alt</i>,
                        }[header.column.getIsSorted() as string] ||
                          (header.column.getCanSort() ? (
                            <i className="material-symbols-outlined select-none">import_export</i>
                          ) : null)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr key={row.id} className={` ${index === 0 ? "" : "border-t"} border-gray-200 text-left`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {cell.column.columnDef.header === "สถานะคำขอ" ? (
                      <div className="w-full text-center">
                        {cell.renderValue() === "เกินวันที่นัดหมาย" || cell.renderValue() === "ถูกตีกลับ" ? (
                          <span className="badge badge-pill-outline badge-error whitespace-nowrap">
                            {cell.renderValue() as React.ReactNode}
                          </span>
                        ) : cell.renderValue() === "ตีกลับคำขอ" ? (
                          <span className="badge badge-pill-outline badge-warning whitespace-nowrap">
                            {cell.renderValue() as React.ReactNode}
                          </span>
                        ) : (
                          <span className="badge badge-pill-outline badge-info whitespace-nowrap">
                            {cell.renderValue() as React.ReactNode}
                          </span>
                        )}
                      </div>
                    ) : cell.column.columnDef.header === "" ? (
                      <>
                        {listName == "request" && (
                          <div className="dt-action">
                            <button
                              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                              data-tip="แก้ไข"
                              onClick={() => {
                                editRecordTravel?.(row.original);
                              }}
                            >
                              <i className="material-symbols-outlined icon-settings-fill-300-24">stylus</i>
                            </button>
                            <button
                              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                              data-tip="ลบ"
                              onClick={() => {
                                deleteRecordTravel?.(row.original);
                              }}
                            >
                              <i className="material-symbols-outlined icon-settings-fill-300-24">delete</i>
                            </button>
                          </div>
                        )}
                        {listName == "fuel" && (
                          <div className="dt-action">
                            <button
                              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                              data-tip="แก้ไข"
                              onClick={() => {
                                editRecordTravel?.(row.original);
                              }}
                            >
                              <i className="material-symbols-outlined icon-settings-fill-300-24">stylus</i>
                            </button>
                            <button
                              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                              data-tip="ลบ"
                              onClick={() => {
                                deleteRecordTravel?.(row.original);
                              }}
                            >
                              <i className="material-symbols-outlined icon-settings-fill-300-24">delete</i>
                            </button>
                            <button
                              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                              data-tip="รูปใบเสร็จ"
                              onClick={() => {
                                previewRecordTravel?.(row.original);
                              }}
                            >
                              <i className="material-symbols-outlined icon-settings-fill-300-24">imagesmode</i>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}

                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-5 dt-bottom">
        <div className="flex items-center gap-2">
          <div className="dt-info" aria-live="polite" id="DataTables_Table_0_info" role="status">
            แสดง {Math.min(pageIndex * pageSize + 1, table.getRowCount())} ถึง{" "}
            {Math.min((pageIndex + 1) * pageSize, table.getRowCount())} จาก {table.getRowCount()} รายการ
          </div>
          <Paginationselect
            w="w-[5em]"
            position="top"
            options={["10", "25", "50", "100"]}
            value={table.getState().pagination.pageSize}
            onChange={(selectedValue) => table.setPageSize(Number(selectedValue))}
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

            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                className="join-item btn btn-sm btn-outline active"
                onClick={() => table.setPageIndex(page - 1)} // Add logic to navigate to the specific page
              >
                {page}
              </button>
            ))}
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
