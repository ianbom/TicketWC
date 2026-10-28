"use client";

import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { auth } = usePage().props;
  const user = auth?.user ?? {};

  const [isEditing, setIsEditing] = useState(false);

  // ------------------------------
  // AUTO FILL FIELD
  // ------------------------------
  const { data, setData, put, processing } = useForm({
    name: user.name || "",
    email: user.email || "",
    position: user.position?.name || "",
    department: user.department?.name || "",
    sub_department: user.sub_department?.name || "-",
    gateway: user.gateway?.name || "-",
  });

  const handleSubmit = () => {
    put("/ticket/account/update", {
      preserveScroll: true,

      onSuccess: () => {
        toast.success("Profile updated successfully!", {
          description: "Your changes have been saved.",
        });
        setIsEditing(false);
      },

      onError: (errors) => {
        toast.error("Update failed!", {
          description: Object.values(errors)[0] || "Something went wrong.",
        });
      },
    });
  };


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader
          title="My Account"
          description="View and edit your profile information."
        />

        <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">

          <div className="border rounded-xl bg-white shadow p-6 space-y-6">

            {/* Header + Edit Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-lg font-semibold">{data.name}</p>
                  <p className="text-gray-500 text-sm">
                    {user.role === "admin" ? "Admin" : user.position?.name}
                  </p>
                </div>
              </div>

              {!isEditing && (
                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={16} />
                  Edit
                </Button>
              )}
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name (only editable field) */}
              <div>
                <Label>Full Name</Label>
                <Input
                  disabled={!isEditing}
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className={!isEditing ? "bg-gray-100" : ""}
                />
              </div>

              {/* Email (locked) */}
              <div>
                <Label>Email</Label>
                <Input disabled value={user.email} className="bg-gray-100" />
              </div>

              {/* Position (locked) */}
              <div>
                <Label>Position</Label>
                <Input
                  disabled
                  value={user.role === "admin" ? "Admin" : user.position?.name}
                  className="bg-gray-100"
                />
              </div>

              {/* Department (locked) */}
              <div>
                <Label>Department</Label>
                <Input
                  disabled
                  value={user.department?.name || ""}
                  className="bg-gray-100"
                />
              </div>

              {/* Sub Department */}
              <div>
                <Label>Sub Department</Label>
                <Input
                  disabled
                  value={user.sub_department?.name || "-"}
                  className="bg-gray-100"
                />
              </div>

              {/* Gateway */}
              <div>
                <Label>Gateway</Label>
                <Input
                  disabled
                  value={user.gateway?.name || "-"}
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* SAVE ONLY NAME */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>

                <Button onClick={handleSubmit} disabled={processing}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
