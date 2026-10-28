"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function DataTable({
  columns,
  data,
  server = false,
  pageCount,
  pagination,
  onPaginationChange,
  onPageSizeChange,
}) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: server,
    state: {
      pagination,
    },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-muted-foreground"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ❌ REMOVE pagination default
          Pagination handled in parent (UserManagement)
      */}
    </div>
  )
}
