"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Report() {
  const { categories = [] } = usePage().props;

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    category: "",
    sub_category: "",
  });

  const [subCategories, setSubCategories] = useState([]);

  const handleCategoryChange = (catId) => {
    setFilters({
      ...filters,
      category: catId,
      sub_category: "",
    });

    const selected = categories.find((c) => String(c.id) === String(catId));
    setSubCategories(selected?.subcategories || []);
  };

  // FIX: DOWNLOAD MENGGUNAKAN window.location.href
  const downloadExcel = () => {
    const query = new URLSearchParams(filters).toString();
    window.location.href = route("ticket.report.excel") + "?" + query;
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader
          title="Report Ticket"
          description="Download laporan tiket berdasarkan tanggal dan kategori."
        />

        <div className="px-4 py-6 space-y-4 lg:px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Start Date */}
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={filters.start_date}
                onChange={(e) =>
                  setFilters({ ...filters, start_date: e.target.value })
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={filters.end_date}
                onChange={(e) =>
                  setFilters({ ...filters, end_date: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium">Category</label>

              <Select
                value={filters.category}
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
              <label className="text-sm font-medium">Sub Category</label>

              <Select
                disabled={!filters.category}
                value={filters.sub_category}
                onValueChange={(val) =>
                  setFilters({ ...filters, sub_category: val })
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
                    <SelectItem disabled value="none">
                      Tidak ada sub category
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="mt-4" onClick={downloadExcel}>
            Download Excel
          </Button>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
