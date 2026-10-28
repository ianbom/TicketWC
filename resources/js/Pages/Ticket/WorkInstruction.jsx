"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePage, router } from "@inertiajs/react";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

// ============================================================
// CATEGORY DATA
// ============================================================
const CATEGORY_DATA = {
  RF: [
    "BDC", "BDC Controller", "BUC", "BUC Controller", "LNA Controller",
    "LNA Switch", "LNA", "LNA Tracking", "Switch Box BUC", "Switch Box BDC",
    "BDC CSM", "Monopulse Plate", "TRU", "TWTA", "TWTA RCU"
  ],
  Utility: ["Panel", "PAC", "Genset", "AC NWIEE", "UPS", "ATS"],
  Ancillary: [
    "Dehidrator", "Rain Blower", "Lampu AWL", "Lampu Kingpost",
    "Lampu HUB", "TFCU/GPS", "10 MHz Distribution"
  ],
  Activity: ["Belum ada sub kategori"],
  "Antenna Issue": ["Belum ada sub kategori"],
  Antenna: ["ACU", "ADU", "Motorize", "Tracking", "KVM"],
  "Diesel Refill": ["Belum ada sub kategori"],
  "Electrical Report": ["Belum ada sub kategori"],
  Guest: ["10 MHz Distribution"],
  PM: [
    "Warming Up Genset", "Cleaning Genset, PKG, Tangki BBM & Sum Pit",
    "Cleaning Filter UPS", "PM UPS + Battery Testing & Test Discharge Battery",
    "Maintenance Cleaning AC Split & AC Antenna",
    "Cleaning Filter Indoor PAC & Cuci Outdoor PAC",
    "Maintenance PAC", "Cleaning Panel Listrik",
    "Load & Temperature Measurement", "Grounding Measurement",
    "N-G Voltage Measurement", "Maintenance Genset",
    "Electrical Power Quality Measurement",
    "Capture/Setting Parameter RF & Utility",
    "Check Ancillary System", "Test Redundancy",
    "PM Antenna Tracking System", "PM Antenna Structure",
    "Inspection & Cleaning Rain Blower", "PM Antenna Structure TTC",
    "Neutral to Grounding Measurement"
  ],
  CM: [
    "Dehydrator", "Rain Blower", "Lampu AWL", "Lampu Kingpost",
    "Lampu HUB", "10 MHz Distribution", "ACU", "ADU", "Motorize",
    "Tracking", "KVM", "BDC", "BDC Controller", "BUC", "BUC Controller",
    "LNA Controller", "LNA Switch", "LNA", "LNA Tracking",
    "Switch Box BUC", "Switch Box BDC", "BDC CSM", "Monopulse Plate",
    "TRU", "TWTA", "TWTA RCU", "Panel", "PAC", "Genset", "AC NWIEE",
    "UPS", "ATS"
  ],
  Weather: ["Belum ada sub kategori"],
  Monitoring: ["Belum ada sub kategori"],
  Panel: ["Belum ada sub kategori"],
  HUB: ["Belum ada sub kategori"],
  TTC: ["Activity", "PM", "CM", "RF", "Ancillary", "Utility"],
};

export default function WorkInstruction() {
  const { wi } = usePage().props;
  const { role } = usePage().props;

  // Form state

  const [form, setForm] = useState({
    category: "",
    sub_category: "",
    description: "",
    tags: "",
    file: null,
  });

  // Submit form WI
  const submitWI = () => {
    router.post(
      route("ticket.wi.upload"),
      { ...form },
      { forceFormData: true }
    );
  };

  // Delete WI
  const deleteWI = (id) => {
    if (!confirm("Hapus WI ini?")) return;

    router.delete(route("ticket.wi.delete", id));
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader
          title="Work Instruction"
          description="Kelola dokumen WI untuk kebutuhan teknis lapangan."
        />

        <div className="px-4 py-6 space-y-8 lg:px-6">

          {/* Upload WI */}
          <div className="space-y-3 border p-4 rounded-lg bg-white">
            <h2 className="font-semibold text-lg">Upload WI Baru</h2>

            {/* Category */}
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm({ ...form, category: value, sub_category: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Category" />
              </SelectTrigger>

              <SelectContent>
                {Object.keys(CATEGORY_DATA).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sub Category */}
            <Label>Sub Category</Label>
            <Select
              disabled={!form.category}
              value={form.sub_category}
              onValueChange={(value) =>
                setForm({ ...form, sub_category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Sub Category" />
              </SelectTrigger>

              <SelectContent>
                {form.category &&
                  CATEGORY_DATA[form.category].map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Description */}
            <Input
              placeholder="Description"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* Tags */}
            <Input
              placeholder="Tags (pisahkan dengan koma)"
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />

            {/* File */}
            <Input
              type="file"
              onChange={(e) =>
                setForm({ ...form, file: e.target.files[0] })
              }
            />

            {/* Submit */}
            <Button className="mt-2" onClick={submitWI}>
              Upload
            </Button>
          </div>

          {/* List WI */}
          <div>
            <h2 className="font-semibold text-lg mb-2">List Work Instruction</h2>

            <table className="w-full text-sm border bg-white">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Sub</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Tags</th>
                  <th className="p-2 border">Document</th>

                  {/* SHOW ACTIONS ONLY FOR ADMIN */}
                  {role === "admin" && (
                    <th className="p-2 border">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {wi.map((item, index) => (
                  <tr key={item.id}>
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">{item.category}</td>
                    <td className="p-2 border">{item.sub_category}</td>
                    <td className="p-2 border">{item.description}</td>
                    <td className="p-2 border">{item.tags}</td>

                    <td className="p-2 border text-center">
                      <a href={`/storage/${item.file_path}`} target="_blank">
                        <Button size="sm">View</Button>
                      </a>
                    </td>

                    {/* DELETE BUTTON ONLY FOR ADMIN */}
                    {role === "admin" && (
                      <td className="p-2 border text-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteWI(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
