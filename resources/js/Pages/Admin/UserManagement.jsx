"use client";

import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

// Layout
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// UI
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/DataTable";
import { getAdminUserColumns } from "@/components/data-table/admin-user-columns";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Select
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function UserManagement() {
  const { props } = usePage();

  // Initial data from server
  const initialUsers = props.users?.data || [];
  const initialMeta = props.users?.meta || [];

  // States
  const [users, setUsers] = useState(initialUsers);
  const [meta, setMeta] = useState(initialMeta);
  const [pageSize, setPageSize] = useState(initialMeta.per_page || 10);
  const [loading, setLoading] = useState(false);

  // DELETE states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // EDIT states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    department_id: "",
    sub_department_id: "",
    gateway_id: "",
    position_id: "",
  });

  const columns = getAdminUserColumns();

  // ===============================================================
  // FILTER HELPERS
  // ===============================================================
  useEffect(() => {
    window.userData = users;

    window.getNested = (obj, path) =>
      path.split(".").reduce((o, k) => (o ? o[k] : null), obj);

    window.getUnique = (arr, key) => {
      return [
        ...new Set(
          arr.map((item) => window.getNested(item, key)).filter(Boolean)
        ),
      ];
    };

    window.filterDepartment = (v) => runFilter("department.name", v);
    window.filterSubDept = (v) => runFilter("sub_department.name", v);
    window.filterGateway = (v) => runFilter("gateway.name", v);
    window.filterPosition = (v) => runFilter("position.name", v);
  }, [users]);

  // ===============================================================
  const runFilter = (key, value) => {
    if (value === "all") return fetchUsers({});
    fetchUsers({ filter_key: key, filter_value: value });
  };

  // ===============================================================
  const fetchUsers = async (extra = {}) => {
    setLoading(true);

    try {
      const res = await axios.get("/ticket/users/json", {
        headers: { "X-Requested-With": "XMLHttpRequest" },
        params: {
          page: extra.page || 1,
          per_page: extra.per_page || pageSize,
          filter_key: extra.filter_key || null,
          filter_value: extra.filter_value || null,
        },
      });

      setUsers(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }

    setLoading(false);
  };

  // ===============================================================
  const deleteUser = async () => {
    try {
      await axios.delete(`/ticket/users/${selectedUser}`);
      setShowDeleteDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // ===============================================================
  useEffect(() => {
    const deleteHandler = (e) => {
      setSelectedUser(e.detail);
      setShowDeleteDialog(true);
    };

    const editHandler = (e) => {
      const u = e.detail;
      setEditForm({
        id: u.id,
        name: u.name,
        email: u.email,
        department_id: u.department?.id || "",
        sub_department_id: u.sub_department?.id || "",
        gateway_id: u.gateway?.id || "",
        position_id: u.position?.id || "",
      });
      setShowEditDialog(true);
    };

    window.addEventListener("user-delete", deleteHandler);
    window.addEventListener("user-edit", editHandler);

    return () => {
      window.removeEventListener("user-delete", deleteHandler);
      window.removeEventListener("user-edit", editHandler);
    };
  }, []);

  // ===============================================================
  const updateUser = async () => {
    try {
      await axios.put(`/ticket/users/${editForm.id}`, editForm);

      toast.success("User updated successfully ⭐");

      setShowEditDialog(false);
      fetchUsers();

    } catch (err) {
      console.error("Update failed:", err);

      toast.error("Failed to update user ❌");
    }
  };


  // ===============================================================
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader
          title="User Management"
          description="Kelola user yang memiliki akses ke sistem tiket."
        />

        <div className="px-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar User</CardTitle>
            </CardHeader>

            <CardContent>
              {loading && (
                <p className="text-center text-muted-foreground py-6">
                  Loading...
                </p>
              )}

              {!loading && (
                <DataTable
                  data={users}
                  columns={columns}
                  server
                  pageCount={meta?.last_page ?? 1}
                  pagination={{
                    pageIndex: meta?.current_page
                      ? meta.current_page - 1
                      : 0,
                    pageSize,
                  }}
                  onPaginationChange={(next) => {
                    const nextPage = next.pageIndex + 1;
                    fetchUsers({ page: nextPage });
                  }}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    fetchUsers({ page: 1, per_page: size });
                  }}
                />
              )}

              {/* pagination custom */}
              <div className="flex items-center justify-end px-4 py-3 mt-4">
                <div className="flex w-full items-center gap-8 lg:w-fit">
                  <div className="items-center gap-2 lg:flex">
                    <Label className="text-sm font-normal hidden lg:block">
                      Rows per page
                    </Label>

                    <Select
                      value={String(pageSize)}
                      onValueChange={(val) => {
                        const size = Number(val);
                        setPageSize(size);
                        fetchUsers({ page: 1, per_page: size });
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder={pageSize} />
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

                  <div className="flex items-center text-sm font-normal">
                    Page {meta?.current_page ?? 1} of {meta?.last_page ?? 1}
                  </div>

                  <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      disabled={(meta?.current_page ?? 1) <= 1}
                      onClick={() => fetchUsers({ page: 1 })}
                    >
                      «
                    </Button>

                    <Button
                      variant="outline"
                      className="size-8"
                      disabled={(meta?.current_page ?? 1) <= 1}
                      onClick={() =>
                        fetchUsers({ page: (meta?.current_page ?? 1) - 1 })
                      }
                    >
                      ‹
                    </Button>

                    <Button
                      variant="outline"
                      className="size-8"
                      disabled={(meta?.current_page ?? 1) >= meta?.last_page}
                      onClick={() =>
                        fetchUsers({ page: (meta?.current_page ?? 1) + 1 })
                      }
                    >
                      ›
                    </Button>

                    <Button
                      variant="outline"
                      className="hidden size-8 lg:flex"
                      disabled={(meta?.current_page ?? 1) >= meta?.last_page}
                      onClick={() => fetchUsers({ page: meta?.last_page })}
                    >
                      »
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================================
            DELETE USER DIALOG
        ============================================================ */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus User?</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              User yang dihapus tidak dapat dikembalikan.
            </p>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Batal
              </Button>

              <Button variant="destructive" onClick={deleteUser}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ============================================================
            EDIT USER DIALOG
        ============================================================ */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* NAME */}
              <div>
                <Label>Full Name</Label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>

              {/* EMAIL */}
              <div>
                <Label>Email</Label>
                <input
                  disabled
                  className="w-full border rounded p-2 mt-1 bg-gray-100"
                  value={editForm.email}
                />
              </div>

              {/* DEPARTMENT */}
              <div>
                <Label>Department</Label>
                <select
                  className="w-full border rounded p-2 mt-1"
                  value={editForm.department_id}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      department_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Department</option>
                  {props.departments?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB DEPARTMENT */}
              <div>
                <Label>Sub Department</Label>
                <select
                  className="w-full border rounded p-2 mt-1"
                  value={editForm.sub_department_id}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      sub_department_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Sub Dept</option>
                  {props.subDepartments?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* GATEWAY */}
              <div>
                <Label>Gateway</Label>
                <select
                  className="w-full border rounded p-2 mt-1"
                  value={editForm.gateway_id}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      gateway_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Gateway</option>
                  {props.gateways?.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* POSITION */}
              <div>
                <Label>Position</Label>
                <select
                  className="w-full border rounded p-2 mt-1"
                  value={editForm.position_id}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      position_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Position</option>
                  {props.positions?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="mt-5">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>

              <Button onClick={updateUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
