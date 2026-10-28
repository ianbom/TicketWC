"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { router } from "@inertiajs/react";
import StatusBadge from "@/components/status-badge";
import { toast } from "sonner";

export default function ViewTicket() {
  const { ticket, updates } = usePage().props;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader
          title={`Ticket Detail - ${ticket.ticket_number}`}
          description="Detail informasi dan riwayat update ticket."
        />

        <div className="p-6 space-y-8">

          {/* ====================== TICKET INFORMATION ====================== */}
          <div className="border rounded-md bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold">Ticket Information</h2>

              <div className="flex items-center gap-3">

                {/* BUTTON UPDATE (sembunyikan jika status = close) */}
                {ticket.status && !ticket.status.toLowerCase().startsWith("close") ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.visit(
                        route("ticket.update", {
                          ticket_number: ticket.ticket_number,
                        })
                      )
                    }
                    className="flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" />
                    Update Ticket
                  </Button>
                ) : (
                  <span className="text-xs text-red-500 italic">
                    Ticket sudah ditutup – update tidak tersedia
                  </span>
                )}

              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {/* ================= IDENTITAS TICKET ================= */}
              <p><strong>Ticket Number:</strong> {ticket.ticket_number}</p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <StatusBadge status={ticket.status} />
              </p>

              {/* ================= KLASIFIKASI ================= */}
              <p><strong>Gateway:</strong> {ticket.gateway}</p>
              <p><strong>Category:</strong> {ticket.category}</p>

              <p><strong>Sub Category:</strong> {ticket.subcategory}</p>
              <p><strong>Flag:</strong> {ticket.flag}</p>

              {/* ================= WAKTU ================= */}
              <p><strong>Ticket Date:</strong> {ticket.ticket_date}</p>
              <p><strong>Start Date:</strong> {ticket.start_date}</p>

              <p><strong>End Date:</strong> {ticket.end_date ?? "-"}</p>
              <p><strong>Duration:</strong> {ticket.duration ?? "-"}</p>
              {/* ================= TEKNIS ================= */}
              <p><strong>Serial Number:</strong> {ticket.serial_number}</p>
              <p><strong>Alarm:</strong> {ticket.alarm}</p>

              {/* ================= PENANGANAN ================= */}
              <p><strong>PIC:</strong> {ticket.pic ?? "-"}</p>
              <p><strong>Indication:</strong> {ticket.indication ?? "-"}</p>

              <p><strong>Action:</strong> {ticket.action ?? "-"}</p>

              {/* ================= DESKRIPSI ================= */}
              <p className="col-span-1 sm:col-span-2">
                <strong>Description:</strong> {ticket.description ?? "-"}
              </p>
            </div>
          </div>

          {/* ====================== REAL UPDATE HISTORY ====================== */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Update History</h2>

            {updates.length === 0 && (
              <p className="text-sm text-gray-500">Belum ada update untuk ticket ini.</p>
            )}

            {updates.map((u, index) => (
              <div
                key={index}
                className="border rounded-md bg-blue-50 p-4 text-sm"
              >
                <p><strong>Date:</strong> {u.date}</p>
                <p><strong>Updated By:</strong> {u.updated_by}</p>
                <p><strong>Flag:</strong> {u.flag}</p>
                <p><strong>Indication:</strong> {u.indication}</p>
                <p><strong>Action:</strong> {u.action}</p>
                <p className="mt-1"><strong>Description:</strong> {u.description}</p>
              </div>
            ))}
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
