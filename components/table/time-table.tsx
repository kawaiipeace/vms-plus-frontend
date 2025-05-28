"use client";

import { flexRender, Table as TableType } from "@tanstack/react-table";

interface DataTableProps<TData> {
    table: TableType<TData>;
    onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({ table, onRowClick }: DataTableProps<TData>) {
    const renderSortingIcon = (isSorted: string | false, canSort: boolean) => {
        if (isSorted === "asc") {
            return <i className="material-symbols-outlined text-black select-none">arrow_upward_alt</i>;
        }
        if (isSorted === "desc") {
            return <i className="material-symbols-outlined text-black select-none">arrow_downward_alt</i>;
        }
        if (canSort) {
            return <i className="material-symbols-outlined select-none">import_export</i>;
        }
        return null;
    };

    const renderTableHead = () => (
        <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-sm sm:text-base font-semibold">
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            className={(header.column.columnDef.meta as {className?: string})?.className}
                            onClick={header.column.getToggleSortingHandler()}
                        >
                            <div className="flex items-center gap-3">
                                {!header.isPlaceholder &&
                                    flexRender(header.column.columnDef.header, header.getContext())}
                                <span>
                                    {renderSortingIcon(header.column.getIsSorted(), header.column.getCanSort())}
                                </span>
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );

    const renderTableBody = () => (
        <tbody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <tr
                        key={row.id}
                        className={`hover:bg-base-200 ${onRowClick ? "cursor-pointer" : ""}`}
                        onClick={() => onRowClick?.(row.original)}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className={(cell.column.columnDef.meta as {className?: string})?.className} >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={table.getAllColumns().length} className="text-center py-6">
                        <div className="flex flex-col items-center">
                            <div className="bg-base-300 p-5 rounded-full">📄</div>
                            <span className="mt-2 text-base-content">No Data Available</span>
                        </div>
                    </td>
                </tr>
            )}
        </tbody>
    );

    return (
        <div className="mt-5 overflow-x-auto rounded-none">
            <table className="w-full dataTable">
                {renderTableHead()}
                {renderTableBody()}
            </table>
        </div>
    );
}

