"use client"

import React, { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { usePage, router } from "@inertiajs/react"
import { toast } from "sonner";


// ============================================================
// Helper: generate datetime-local now()
// ============================================================
const getLocalDateTime = () => {
  const d = new Date()
  const pad = (n) => n.toString().padStart(2, "0")

  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  )
}

export default function Open() {
  const { gateway, categories } = usePage().props

  const now = getLocalDateTime()

  // ============================================================
  // FORM STATE
  // ============================================================
  const [form, setForm] = useState({
    gateway_id: gateway?.id ?? null,
    start_date: now,
    category_id: "",
    sub_category_id: "",
    serial_number: "",
    flag: "",
    alarm: "",
    indication: "",
    action: "",
    description: "",
  })

  // ============================================================
  // CATEGORY → SUBCATEGORY
  // ============================================================
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [subCategories, setSubCategories] = useState([])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId)

    const selected = categories.find((c) => String(c.id) === String(categoryId))

    setSubCategories(selected?.subcategories || [])

    setForm((prev) => ({
      ...prev,
      category_id: categoryId,
      sub_category_id: "",
    }))
  }

  const validateForm = () => {
    if (!form.category_id)
      return "Category tidak boleh kosong";

    if (!form.sub_category_id)
      return "Sub Category tidak boleh kosong";

    if (!form.flag)
      return "Flag wajib dipilih";

    if (!form.serial_number.trim())
      return "Serial Number wajib diisi";

    if (!form.alarm.trim())
      return "Alarm wajib diisi";

    if (!form.indication.trim())
      return "Indication wajib diisi";

    if (!form.action.trim())
      return "Action wajib diisi";

    if (!form.description.trim())
      return "Description wajib diisi";

    return null; // valid semua
  };


  // ============================================================
  // SUBMIT TICKET
  // ============================================================
  const submitTicket = () => {
    const error = validateForm();

    if (error) {
      toast.error("Form tidak lengkap", {
        description: error,
      });
      return;
    }

    router.post("/ticket/open", form, {
      onSuccess: () => {
        toast.success("Ticket berhasil dibuat!", {
          description: "Tiket kamu sudah masuk ke sistem.",
        });

        setForm({
          gateway_id: gateway?.id ?? null,
          start_date: getLocalDateTime(),
          category_id: "",
          sub_category_id: "",
          serial_number: "",
          flag: "",
          alarm: "",
          indication: "",
          action: "",
          description: "",
        });
      },

      onError: (err) => {
        toast.error("Gagal membuat ticket", {
          description: "Pastikan semua field sudah benar.",
        });
        console.error("Error submit:", err);
      },
    });
  };


  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader
          title="Open Ticket"
          description="Buat tiket baru untuk pelaporan event, alarm, atau PM/CM."
        />

        <div className="px-4 py-6 lg:px-6 space-y-8">
          <div className="border rounded-xl p-6 shadow-sm bg-card">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Gateway */}
              <div>
                <Label>Gateway</Label>
                <Input
                  value={gateway ? gateway.code + " " + gateway.name : "-"}
                  readOnly
                  className="bg-muted text-black"
                />
                <small className="text-xs text-muted-foreground">
                  * Auto Generate
                </small>
              </div>

              {/* Start Date */}
              <div>
                <Label>Start Date</Label>
                <Input
                  type="datetime-local"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>

                <Select
                  value={form.category_id}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Category */}
              <div>
                <Label>Sub Category</Label>

                <Select
                  disabled={!selectedCategoryId}
                  value={form.sub_category_id}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, sub_category_id: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Sub Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {subCategories.length > 0 ? (
                      subCategories.map((sub) => (
                        <SelectItem key={sub.id} value={String(sub.id)}>
                          {sub.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        Tidak ada sub category
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Serial Number */}
              <div>
                <Label>Serial Number</Label>
                <Input
                  placeholder="Contoh : GS-123456"
                  value={form.serial_number}
                  onChange={(e) =>
                    setForm({ ...form, serial_number: e.target.value })
                  }
                />
              </div>

              {/* Flag */}
              <div>
                <Label>Flag</Label>

                <Select
                  value={form.flag}
                  onValueChange={(v) => setForm({ ...form, flag: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Flag" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="pm">PM</SelectItem>
                    <SelectItem value="cm">CM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Alarm */}
              <div className="md:col-span-2">
                <Label>Alarm</Label>
                <Input
                  value={form.alarm}
                  onChange={(e) =>
                    setForm({ ...form, alarm: e.target.value })
                  }
                />
              </div>

              {/* Indication */}
              <div className="md:col-span-2">
                <Label>Indication</Label>
                <Input
                  value={form.indication}
                  onChange={(e) =>
                    setForm({ ...form, indication: e.target.value })
                  }
                />
              </div>

              {/* Action */}
              <div className="md:col-span-2">
                <Label>Action</Label>
                <Input
                  value={form.action}
                  onChange={(e) =>
                    setForm({ ...form, action: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <Button className="px-6" onClick={submitTicket}>
                Submit Ticket
              </Button>
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
