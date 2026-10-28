import React, { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TicketTable } from "@/components/ticket-table"
import { ticketColumns } from "@/components/data-table/ticket-columns"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { usePage, router } from "@inertiajs/react"


import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner";



export default function List() {

    const [selectedRow, setSelectedRow] = useState(null)

    const { tickets } = usePage().props
    const [status, setStatus] = useState("all")
    const [category, setCategory] = useState("all")
    const [subcategory, setSubcategory] = useState("all")
    const [serial, setSerial] = useState("all")
    const [flag, setFlag] = useState("all")
    const [alarm, setAlarm] = useState("all")
    const [indication, setIndication] = useState("all")
    const [pic, setPic] = useState("all")
    const [search, setSearch] = useState("")

    // === FILTER DATA ===
    // Ambil unique values dari kolom tertentu
    const getUnique = (data, key) => {
        return [...new Set(data.map((item) => item[key]).filter(Boolean))]
    }
    window.filterStatus = (value) => {
        setStatus(value)
    }
    window.ticketData = tickets.data;

    window.filterCategory = (v) => setCategory(v);
    window.filterSub = (v) => setSubcategory(v);
    window.filterSerial = (v) => setSerial(v);
    window.filterFlag = (v) => setFlag(v);
    window.filterAlarm = (v) => setAlarm(v);
    window.filterIndication = (v) => setIndication(v);
    window.filterPIC = (v) => setPic(v);


    const filteredData = useMemo(() => {
        const searchValue = search.toLowerCase();

        return tickets.data.filter((t) => {

            if (status !== "all" && t.status.toLowerCase() !== status) return false
            if (category !== "all" && t.category !== category) return false
            if (subcategory !== "all" && t.subcategory !== subcategory) return false
            if (serial !== "all" && t.serial_number !== serial) return false
            if (flag !== "all" && t.flag !== flag) return false
            if (alarm !== "all" && t.alarm !== alarm) return false
            if (indication !== "all" && t.indication !== indication) return false

            // === SEARCH (FIXED) ===
            if (
                search &&
                !(
                    t.ticket_number?.toLowerCase().includes(searchValue) ||
                    t.serial_number?.toLowerCase().includes(searchValue) ||
                    t.pic?.toLowerCase().includes(searchValue) ||
                    t.status?.toLowerCase().includes(searchValue) ||
                    t.gateway?.toLowerCase().includes(searchValue) ||
                    t.category?.toLowerCase().includes(searchValue)
                )
            ) return false

            return true
        })
    }, [
        tickets.data,
        status,
        category,
        subcategory,
        serial,
        flag,
        alarm,
        indication,
        pic,
        search // ← WAJIB ADA!
    ])


    // === PAGINATION ===
    const pagination = {
        page: tickets.current_page,
        totalPages: tickets.last_page,
        pageSize: tickets.per_page,

        onPageChange: (page) =>
            router.visit(route("ticket.list", { page, per_page: pagination.pageSize })),

        onPageSizeChange: (size) =>
            router.visit(route("ticket.list", { per_page: size, page: 1 })),
    }

    // Kolom action-only untuk tabel kanan
    const actionOnlyColumn = [
        {
            header: "Action",
            id: "action_only",
            cell: ({ row }) => {
                const ticket = row.original;

                const isClosed = ticket.status?.toLowerCase() === "closed";

                return (
                    <div className="flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-5 w-5 p-2">
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="center">

                                {/* VIEW */}
                                <DropdownMenuItem
                                    onClick={() =>
                                        window.location.href = route("ticket.view", ticket.ticket_number)
                                    }
                                >
                                    View Ticket
                                </DropdownMenuItem>

                                {/* UPDATE */}
                                {!isClosed && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            router.visit(
                                                route("ticket.update", { ticket_number: ticket.ticket_number })
                                            )
                                        }
                                    >
                                        Update Ticket
                                    </DropdownMenuItem>
                                )}

                                {/* DELETE */}
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleDelete(ticket.ticket_number)}
                                >
                                    Delete Ticket
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        }
    ];

    const handleDelete = (ticket_number) => {
        if (!confirm("Are you sure you want to delete this ticket?")) return;

        router.delete(route("ticket.delete", ticket_number), {
            onSuccess: () => {
                toast.success("Ticket deleted successfully", {
                    description: `Ticket ${ticket_number} has been removed.`,
                });
            },

            onError: () => {
                toast.error("Delete failed", {
                    description: "Something went wrong while deleting ticket.",
                });
            },
        });
    };



    window.ticketData = tickets.data;

    // Ambil data unik dari kolom tertentu
    window.getUnique = (arr, key) =>
        [...new Set(arr.map((x) => x[key]).filter(Boolean))];



    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />

            <SidebarInset className="overflow-x-hidden">
                <SiteHeader
                    title="List Ticket"
                    description="Daftar tiket yang Anda buat."
                />

                <div className="flex flex-col flex-1 px-4 md:px-6 py-4 gap-4">

                    <div className="border border-foreground/10 rounded-lg shadow-sm bg-white p-4">

                        {/* Header */}
                        <div className="px-2 mb-6">
                            <h1 className="text-xl font-semibold">Your Ticket Records</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Total Tickets:{" "}
                                <span className="font-semibold text-foreground">
                                    {filteredData.length}
                                </span>{" "}
                                • Showing status:{" "}
                                <span className="capitalize">{status}</span>
                            </p>
                        </div>

                        {/* Search Dummy */}
                        <div className="mb-4 flex md:justify-end items-center gap-3 px-2">
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="border rounded-md px-3 py-2 text-sm w-64"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>


                        {/* === TABLES SIDE BY SIDE === */}
                        <div className="flex flex-row w-full gap-2">

                            {/* === TABLE WRAPPER (Desktop) === */}
                            <div className="flex flex-row w-full gap-2">

                                {/* LEFT TABLE (Scrollable) */}
                                <div className="flex-1 overflow-x-hidden border border-gray-200 rounded-lg">
                                    <div className="w-full">
                                        <TicketTable
                                            columns={ticketColumns}
                                            data={filteredData}
                                            pagination={pagination}
                                            rowClassName="h-12"
                                            onRowSelect={setSelectedRow}
                                            selectedRow={selectedRow}
                                        />

                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* === PAGINATION === */}
                        <div className="flex items-center justify-end px-4 py-3 mt-4">

                            <div className="flex w-full items-center gap-8 lg:w-fit">

                                {/* ROWS PER PAGE */}
                                <div className="items-center gap-2 lg:flex">
                                    <Label className="text-sm font-normal hidden">
                                        Rows per page
                                    </Label>

                                    <Select
                                        value={String(pagination.pageSize)}
                                        onValueChange={pagination.onPageSizeChange}
                                    >
                                        <SelectTrigger className="w-20">
                                            <SelectValue placeholder={pagination.pageSize} />
                                        </SelectTrigger>

                                        <SelectContent side="top">
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="30">30</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* PAGE TEXT */}
                                <div className="flex items-center text-sm font-normal">
                                    Page {pagination.page} of {pagination.totalPages}
                                </div>

                                {/* ARROWS */}
                                <div className="ml-auto flex items-center gap-2 lg:ml-0">

                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        disabled={pagination.page <= 1}
                                        onClick={() => pagination.onPageChange(1)}
                                    >
                                        «
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        disabled={pagination.page <= 1}
                                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                                    >
                                        ‹
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        disabled={pagination.page >= pagination.totalPages}
                                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                                    >
                                        ›
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="hidden size-8 lg:flex"
                                        disabled={pagination.page >= pagination.totalPages}
                                        onClick={() => pagination.onPageChange(pagination.totalPages)}
                                    >
                                        »
                                    </Button>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}
