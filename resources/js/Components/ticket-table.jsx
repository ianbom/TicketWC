"use client"

import React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ArrowUpRight } from "lucide-react"

export function TicketTable({ columns = [], data = [], onRowSelect, selectedRow }) {
  return (
    <div className="w-full overflow-x-auto border rounded-md relative">

      <Table className="min-w-max border-separate border-spacing-0">

        {/* HEADER */}
        <TableHeader className="bg-white sticky top-0 z-30">
          <TableRow className="bg-white">
            {columns.map((col) => (
              <TableHead
                key={col.accessorKey ?? col.id}
                className={`
                  text-xs whitespace-nowrap px-4 py-2 border-b bg-white
                  ${col.id === "actions" ? "sticky right-0 z-40 bg-white shadow-left" : ""}
                `}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.ticket_number}
              className={`relative cursor-pointer 
                ${selectedRow?.ticket_number === row.ticket_number ? "bg-blue-50" : ""}
              `}
              onClick={() => onRowSelect && onRowSelect(row)}
            >

              {columns.map((col) => {
                const value = row[col.accessorKey]
                const uniqueKey = `${row.ticket_number}-${col.accessorKey || col.id}`

                // ===== ACTION COLUMN (STICKY) =====
                if (col.id === "actions") {
                  return (
                    <TableCell
                      key={uniqueKey}
                      className={`
  text-xs px-2 py-2 border-b whitespace-nowrap 
  md:w-[60px] w-[50px] text-center
  sticky right-0 bg-white z-30 shadow-left 
`}

                    >
                      <div className="flex items-center justify-center w-full">
                        {col.cell({
                          row: {
                            original: row,
                            getValue: (key) => row[key],
                          },
                        })}
                      </div>
                    </TableCell>
                  )
                }

                // ===== CLICKABLE TICKET NUMBER =====
                if (col.accessorKey === "ticket_number") {
                  return (
                    <TableCell
                      key={uniqueKey}
                      className="text-xs px-4 py-2 border-b whitespace-nowrap cursor-pointer text-blue-600 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.href = `/ticket/view/${value}`
                      }}
                    >
                      <span className="underline">{value}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </TableCell>
                  )
                }

                // ===== CUSTOM CELL =====
                if (col.cell) {
                  return (
                    <TableCell
                      key={uniqueKey}
                      className="text-xs px-4 py-2 border-b whitespace-nowrap"
                    >
                      {col.cell({
                        row: {
                          original: row,
                          getValue: (key) => row[key],
                        },
                      })}
                    </TableCell>
                  )
                }

                // ===== DEFAULT =====
                return (
                  <TableCell
                    key={uniqueKey}
                    className="text-xs px-4 py-2 border-b whitespace-nowrap"
                  >
                    {value}
                  </TableCell>
                )
              })}

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
  )
}
