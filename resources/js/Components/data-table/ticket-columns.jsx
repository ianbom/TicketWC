import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import ActionDropdown from "@/components/ActionDropdown"
import StatusBadge from "@/components/status-badge"

export const ticketColumns = [

  { accessorKey: "ticket_number", header: "Ticket Number" },
  { accessorKey: "gateway", header: "Gateway" },
  { accessorKey: "ticket_date", header: "Ticket Date" },
  { accessorKey: "start_date", header: "Start Date" },

  // =============================
  // CATEGORY
  // =============================
  {
    accessorKey: "category",
    header: (
      <HeaderFilter
        label="Category"
        keyName="category"
        onSelect="filterCategory"
      />
    ),
  },

  // =============================
  // SUB CATEGORY
  // =============================
  {
    accessorKey: "subcategory",
    header: (
      <HeaderFilter
        label="Sub Category"
        keyName="subcategory"
        onSelect="filterSub"
      />
    ),
  },

  // =============================
  // SERIAL NUMBER
  // =============================
  {
    accessorKey: "serial_number",
    header: (
      <HeaderFilter
        label="Serial Number"
        keyName="serial_number"
        onSelect="filterSerial"
      />
    ),
  },

  // =============================
  // FLAG
  // =============================
  {
    accessorKey: "flag",
    header: (
      <HeaderFilter
        label="Flag"
        keyName="flag"
        onSelect="filterFlag"
      />
    ),
  },

  // =============================
  // ALARM
  // =============================
  {
    accessorKey: "alarm",
    header: (
      <HeaderFilter
        label="Alarm"
        keyName="alarm"
        onSelect="filterAlarm"
      />
    ),
  },

  // =============================
  // INDICATION
  // =============================
  {
    accessorKey: "indication",
    header: (
      <HeaderFilter
        label="Indication"
        keyName="indication"
        onSelect="filterIndication"
      />
    ),
  },

  { accessorKey: "updated_by", header: "Updated By" },

  // =============================
  // PIC
  // =============================
  {
    accessorKey: "pic",
    header: (
      <HeaderFilter
        label="Ticket PIC"
        keyName="pic"
        onSelect="filterPIC"
      />
    ),
  },

  // =============================
  // STATUS
  // =============================
  {
    accessorKey: "status",
    header: (
      <HeaderFilter
        label="Status"
        keyName="status"
        onSelect="filterStatus"
      />
    ),
    cell: ({ row }) => {
      const v = row.getValue("status");
      return <StatusBadge status={v} />;
    },
  },

  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "assigned_by", header: "Assigned By" },
  { accessorKey: "assigned_date", header: "Assigned Date" },
  { accessorKey: "end_date", header: "End Date" },

  // =============================
  // ACTIONS
  // =============================
  {
    header: "Actions",
    id: "actions",
    meta: { sticky: true },
    cell: ({ row }) => {
      const ticket = row.original
      return <ActionDropdown ticket={ticket} />
    },
  },
]

/* ============================================================================
   COMPONENT: Header with Dropdown Filter
============================================================================ */
function HeaderFilter({ label, keyName, onSelect }) {
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
          <DropdownMenuItem onClick={() => window[onSelect]?.("all")}>
            All
          </DropdownMenuItem>

          {/* DYNAMIC ITEMS */}
          {window.getUnique?.(window.ticketData || [], keyName)?.map((c) => (
            <DropdownMenuItem
              key={c}
              onClick={() => window[onSelect]?.(c)}
            >
              {c}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
