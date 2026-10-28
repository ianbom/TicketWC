import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ===========================================================
   HEADER FILTER (model list ticket)
=========================================================== */
function HeaderFilter({ label, keyName, action }) {
  return (
    <div className="flex items-center gap-1">
      <span>{label}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-accent rounded">
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">

          {/* ALL */}
          <DropdownMenuItem onClick={() => window[action]?.("all")}>
            All
          </DropdownMenuItem>

          {/* Dynamic list */}
          {window.getUnique?.(window.userData || [], keyName)?.map((value) => (
            <DropdownMenuItem
              key={value}
              onClick={() => window[action]?.(value)}
            >
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


/* ===========================================================
   MAIN COLUMNS
=========================================================== */
export const getAdminUserColumns = () => [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "default" : "outline"}>
        {row.original.role}
      </Badge>
    ),
  },

  {
    header: (
      <HeaderFilter
        label="Department"
        keyName="department.name"
        action="filterDepartment"
      />
    ),
    accessorKey: "department.name",
    cell: ({ row }) => row.original.department?.name || "-",
  },

  {
    header: (
      <HeaderFilter
        label="Sub Dept"
        keyName="sub_department.name"
        action="filterSubDept"
      />
    ),
    accessorKey: "sub_department.name",
    cell: ({ row }) => row.original.sub_department?.name || "-",
  },

  {
    header: (
      <HeaderFilter
        label="Gateway"
        keyName="gateway.name"
        action="filterGateway"
      />
    ),
    accessorKey: "gateway.name",
    cell: ({ row }) => row.original.gateway?.name || "-",
  },

  {
    header: (
      <HeaderFilter
        label="Position"
        keyName="position.name"
        action="filterPosition"
      />
    ),
    accessorKey: "position.name",
    cell: ({ row }) => row.original.position?.name || "-",
  },

  /* ===========================================================
       ACTION DROPDOWN
  ============================================================ */
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">

            {/* Edit User */}
            <DropdownMenuItem
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("user-edit", { detail: user })
                )
              }
            >
              Edit User
            </DropdownMenuItem>

            {/* Change Role */}
            <DropdownMenuItem
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("user-change-role", { detail: user })
                )
              }
            >
              Ubah Role
            </DropdownMenuItem>

            {/* Delete */}
            <DropdownMenuItem
              className="text-red-600"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("user-delete", { detail: user.id })
                )
              }
            >
              Hapus User
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
