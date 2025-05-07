"use client";

import { flexRender, Table as TableType } from "@tanstack/react-table";
import ZeroRecord from "@/components/zeroRecord";

interface DataTableProps<TData> {
  table: TableType<TData>;
  onRowClick?: (row: TData) => void;
  style?: string;
}

export function DataTable<TData>({ table, onRowClick, style }: DataTableProps<TData>) {
  return (
    <>
      <div className="mt-5 overflow-x-auto rounded-none">
        <table className={`${style ? style : "w-full"} dataTable`}>
          {/* Table Head */}
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

          {/* Table Body */}
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-base-200 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => {
                    onRowClick?.(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="text-center py-6">
                  <div className="flex flex-col items-center">
                    <ZeroRecord
                      imgSrc="/assets/img/graphic/data_empty.svg"
                      title="ไม่มีข้อมูล"
                      desc={<>ไม่มีข้อมูลในตาราง</>}
                      button={""}
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
