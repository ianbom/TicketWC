"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2Icon, LoaderIcon, MoreVerticalIcon, PencilIcon, RefreshCcwIcon, Trash2Icon } from "lucide-react"
import DragHandle from "./DragHandle"
import TableCellViewer from "./TableCellViewer"

export const columns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "title",
    header: "Nama Produk",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 text-muted-foreground">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        Rp {parseInt(row.original.price).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_active ? (
        <Badge variant="outline" className="text-green-600 gap-1">
          <CheckCircle2Icon className="size-3" /> Aktif
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-600 gap-1">
          <LoaderIcon className="size-3" /> Nonaktif
        </Badge>
      ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem><PencilIcon className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
          <DropdownMenuItem><RefreshCcwIcon className="mr-2 h-4 w-4" /> Refresh</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600"><Trash2Icon className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
