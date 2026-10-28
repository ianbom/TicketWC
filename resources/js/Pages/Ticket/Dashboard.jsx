"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { usePage } from "@inertiajs/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function Dashboard() {
  const { total_tickets, summaryCategories, matrix } = usePage().props;

  // Ambil gateway dari matrix secara otomatis
  const gateways = Array.from(
    new Set(
      matrix.flatMap((row) => Object.keys(row).filter((key) => key !== "category"))
    )
  );

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader
          title="Dashboard"
          description="Ringkasan aktivitas Gateway & SNT Ticket"
        />

        <div className="p-6 space-y-10">

          {/* =================== TOTAL TICKET =================== */}
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold tracking-tight text-gray-700">
                TOTAL TICKET
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-blue-700">
                {total_tickets}
              </div>
            </CardContent>
          </Card>

          {/* =================== SUMMARY GATEWAY SMT =================== */}
          <Card className="border border-gray-200 shadow-md">
            <div className="bg-blue-900 text-white px-4 py-3 rounded-t-md">
              <h2 className="text-lg font-semibold text-center tracking-wide">
                SUMMARY GATEWAY SNT TICKET
              </h2>
            </div>

            <CardContent className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
                {summaryCategories.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition text-center shadow-sm"
                  >
                    <p className="text-xs text-gray-600 tracking-wide">
                      {item.category}
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {item.total}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* =================== MATRIX GAR & SMT =================== */}
          <Card className="border border-gray-300 shadow-md overflow-hidden">
            <div className="bg-blue-900 text-white px-4 py-3 rounded-t-md">
              <h2 className="text-lg font-semibold text-center tracking-wide">
                SUMMARY GAR & SNT TICKET
              </h2>
            </div>

            <CardContent className="p-0 overflow-auto">
              <Table className="text-sm border-collapse">
                <TableHeader>
                  <TableRow className="bg-blue-800 text-white">
                    <TableHead className="border border-blue-700 px-3 py-2 text-center w-40">
                      CATEGORY
                    </TableHead>

                    {gateways.map((gw) => (
                      <TableHead
                        key={gw}
                        className="border border-blue-700 px-3 py-2 text-center"
                      >
                        {gw}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {matrix.map((row, i) => (
                    <TableRow key={i} className="even:bg-gray-50">
                      <TableCell className="border px-3 py-2 font-medium text-gray-800">
                        {row.category}
                      </TableCell>

                      {gateways.map((gw) => (
                        <TableCell
                          key={gw}
                          className="border px-3 py-2 text-center text-gray-700"
                        >
                          {row[gw] === "-" ? "-" : (
                            <span className="font-semibold text-blue-700">
                              {row[gw]}
                            </span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
