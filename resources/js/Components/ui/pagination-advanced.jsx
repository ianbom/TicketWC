import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function PaginationAdvanced({
  page,
  totalPages,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
  totalData,
}) {
  return (
    <div className="flex items-center justify-between py-4">

      {/* LEFT: info rows */}
      <p className="text-sm text-muted-foreground">
        0 of {totalData} row(s) selected.
      </p>

      {/* RIGHT: pagination controls */}
      <div className="flex items-center gap-4">

        {/* ROWS PER PAGE */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>

          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* PAGE INFO */}
        <p className="text-sm">
          Page {page} of {totalPages}
        </p>

        {/* BUTTON GROUP */}
        <div className="flex items-center gap-2">

          {/* FIRST PAGE */}
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* PREVIOUS PAGE */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 border rounded disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {/* NEXT PAGE */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>

          {/* LAST PAGE */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="p-2 border rounded disabled:opacity-40"
          >
            <ChevronsRight size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}
