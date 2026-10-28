"use client";

import { useState } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";

// Layout
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Icons
import { Plus, Trash2 } from "lucide-react";

// Dropdown
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CategoryManagement() {
  const { props } = usePage();

  const initialCategories = props.categories || [];
  const [categories, setCategories] = useState(initialCategories);

  const [newCategory, setNewCategory] = useState("");
  const [newType, setNewType] = useState("general");

  const [subInputs, setSubInputs] = useState({});

  // ADD CATEGORY
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await axios.post("/ticket/categories", {
        name: newCategory,
        type: newType,
      });

      setCategories([...categories, res.data.category]);
      setNewCategory("");
      setNewType("general");
    } catch (error) {
      console.error(error);
    }
  };

  // ADD SUBCATEGORY
  const addSubCategory = async (categoryId) => {
    const name = subInputs[categoryId];
    if (!name.trim()) return;

    try {
      const res = await axios.post(`/ticket/categories/${categoryId}/sub`, {
        name,
      });

      const updated = categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subcategories: [...cat.subcategories, res.data.sub] }
          : cat
      );

      setCategories(updated);
      setSubInputs({ ...subInputs, [categoryId]: "" });
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (categoryId) => {
    if (!confirm("Hapus kategori ini?")) return;

    try {
      await axios.delete(`/ticket/categories/${categoryId}`);
      setCategories(categories.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE SUBCATEGORY
  const deleteSub = async (subId, categoryId) => {
    try {
      await axios.delete(`/ticket/subcategories/${subId}`);

      const updated = categories.map((cat) =>
        cat.id === categoryId
          ? {
            ...cat,
            subcategories: cat.subcategories.filter((s) => s.id !== subId),
          }
          : cat
      );

      setCategories(updated);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader
          title="Category Management"
          description="Kelola Category & Sub Category"
        />

        <div className="px-6 py-6 space-y-10">

          {/* ==================================== */}
          {/* FORM TAMBAH CATEGORY */}
          {/* ==================================== */}
          <Card>
            <CardHeader>
              <CardTitle>Add Category</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col md:flex-row gap-4">

              <div className="flex-1">
                <Label>Category Name</Label>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Masukkan nama category..."
                />
              </div>

              <div className="w-40">
                <Label>Type</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="kb">KB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="mt-6 md:mt-7" onClick={addCategory}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </CardContent>
          </Card>

          {/* ==================================== */}
          {/* LIST CATEGORY */}
          {/* ==================================== */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Sub Category List</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">

              {categories.map((cat) => (
                <div key={cat.id} className="border rounded-lg p-5">

                  {/* CATEGORY HEADER */}
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg">{cat.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Type: {cat.type}
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* SUBCATEGORY LIST */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                      >
                        {sub.name}
                        <Trash2
                          size={14}
                          className="cursor-pointer text-red-500"
                          onClick={() => deleteSub(sub.id, cat.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* ADD SUB CATEGORY */}
                  <div className="flex gap-3">
                    <Input
                      placeholder="New Sub Category"
                      value={subInputs[cat.id] || ""}
                      onChange={(e) =>
                        setSubInputs({ ...subInputs, [cat.id]: e.target.value })
                      }
                    />
                    <Button onClick={() => addSubCategory(cat.id)}>
                      Add
                    </Button>
                  </div>
                </div>
              ))}

            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
