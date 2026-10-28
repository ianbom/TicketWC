"use client"
import { TableRow, TableCell } from "@/components/ui/table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { flexRender } from "@tanstack/react-table"

export default function DraggableRow({ row }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id })
  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      className="data-[dragging=true]:opacity-70"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}
