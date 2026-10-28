"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { usePage, router } from "@inertiajs/react";

export default function UpdateTicket() {
    const { ticket } = usePage().props;

    // State
    const [flag, setFlag] = useState(ticket.flag ?? "");
    const [status, setStatus] = useState(ticket.status ?? "Open");
    const [description, setDescription] = useState("");
    const [action, setAction] = useState("");
    const [indication, setIndication] = useState("");
    const [endDate, setEndDate] = useState("");
    const [assignTo, setAssignTo] = useState("");

    // Submit update
    const handleSubmit = () => {
        router.post(route("ticket.update.submit", ticket.ticket_number), {
            flag,
            indication,
            action,
            description,
            status,
            end_date: status === "Close" ? endDate : null,
            assign_to: status === "Assign" ? assignTo : null,
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />

            <SidebarInset>
                <SiteHeader
                    title="Update Ticket"
                    description="Update tiket yang sudah dibuat."
                />

                <div className="px-4 py-6 lg:px-6">
                    <div className="border rounded-xl p-6 bg-card shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Ticket Number */}
                            <div>
                                <Label>Ticket Number</Label>
                                <Input value={ticket.ticket_number} disabled />
                            </div>

                            {/* Gateway */}
                            <div>
                                <Label>Gateway</Label>
                                <Input value={ticket.gateway} disabled />
                            </div>

                            {/* Ticket Date */}
                            <div>
                                <Label>Ticket Date</Label>
                                <Input value={ticket.ticket_date} disabled />
                            </div>

                            {/* Start Date */}
                            <div>
                                <Label>Start Date</Label>
                                <Input value={ticket.start_date} disabled />
                            </div>

                            {/* Category */}
                            <div>
                                <Label>Category</Label>
                                <Input value={ticket.category ?? "-"} disabled />
                            </div>

                            {/* Sub Category */}
                            <div>
                                <Label>Sub Category</Label>
                                <Input value={ticket.subcategory ?? "-"} disabled />
                            </div>

                            {/* Serial Number */}
                            <div>
                                <Label>Serial Number</Label>
                                <Input value={ticket.serial_number} disabled />
                            </div>

                            {/* Flag */}
                            <div>
                                <Label>Flag</Label>
                                <Select value={flag} onValueChange={setFlag}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Flag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Event">Event</SelectItem>
                                        <SelectItem value="PM">PM</SelectItem>
                                        <SelectItem value="CM">CM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Alarm */}
                            <div className="md:col-span-2">
                                <Label>Alarm</Label>
                                <Input value={ticket.alarm} disabled />
                            </div>

                            {/* Indication */}
                            <div className="md:col-span-2">
                                <Label>Indication</Label>
                                <Textarea
                                    rows={3}
                                    value={indication}
                                    onChange={(e) => setIndication(e.target.value)}
                                    placeholder="Tulis indikasi di sini..."
                                />
                            </div>

                            {/* Action */}
                            <div className="md:col-span-2">
                                <Label>Action</Label>
                                <Textarea
                                    rows={3}
                                    value={action}
                                    onChange={(e) => setAction(e.target.value)}
                                    placeholder="Tulis aksi di sini..."
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tulis update di sini..."
                                />
                            </div>

                            {/* Update By */}
                            <div>
                                <Label>Update By</Label>
                                <Input value={ticket.updated_by} disabled />
                            </div>

                            {/* Ticket PIC */}
                            <div>
                                <Label>Ticket PIC</Label>
                                <Input value={ticket.pic} disabled />
                            </div>

                            {/* ================= STATUS + SLOT KANAN ================= */}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

                                {/* STATUS — kiri */}
                                <div className="w-full">
                                    <Label>Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* <SelectItem value="Open">Open</SelectItem> */}
                                            <SelectItem value="Update">Update</SelectItem>
                                            <SelectItem value="Assign">Assign</SelectItem>
                                            <SelectItem value="Close">Close</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* FIELD KANAN — End Date / Assign To */}
                                <div className="w-full">
                                    {status === "Close" && (
                                        <>
                                            <Label>End Date</Label>
                                            <Input
                                                type="datetime-local"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </>
                                    )}

                                    {status === "Assign" && (
                                        <>
                                            <Label>Assign To</Label>
                                            <Select value={assignTo} onValueChange={setAssignTo}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih departemen tujuan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GSM">GSM</SelectItem>
                                                    <SelectItem value="UOM">UOM</SelectItem>
                                                    <SelectItem value="SNT">SNT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-6 flex justify-end">
                            <Button className="px-6" onClick={handleSubmit}>
                                Update Ticket
                            </Button>
                        </div>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
