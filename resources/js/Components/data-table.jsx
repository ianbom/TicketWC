"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
  FilterIcon,
  RefreshCcwIcon,
  Trash2Icon,
  PencilIcon,
} from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// 🧩 Optional Chart imports (for analytics preview)
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// 🧠 Validation schema (future API form use)
export const schema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  category: z.string(),
  price: z.string(),
  is_active: z.number(),
  preview_link: z.string(),
  created_at: z.string(),
})

// 🧾 Dummy product data
const dummyProducts = [
  {
    id: 1,
    title: "Mini E-Commerce Online",
    subtitle: "Web development service",
    description: "Sistem toko online sederhana untuk UMKM",
    price: "200000",
    category: "Web App",
    is_active: 1,
    preview_link: "https://example.com/demo1",
    created_at: "2025-11-04",
  },
  {
    id: 2,
    title: "Company Profile Website",
    subtitle: "Professional business site",
    description: "Website profil perusahaan lengkap dan elegan",
    price: "150000",
    category: "Corporate",
    is_active: 1,
    preview_link: "https://example.com/demo2",
    created_at: "2025-11-04",
  },
  {
    id: 3,
    title: "Landing Page Promo",
    subtitle: "UI/UX optimized landing",
    description: "Halaman promosi produk dengan CTA modern",
    price: "100000",
    category: "Marketing",
    is_active: 0,
    preview_link: "https://example.com/demo3",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
  {
    id: 4,
    title: "Portfolio Developer",
    subtitle: "Personal showcase",
    description: "Website portofolio modern untuk developer / freelancer",
    price: "175000",
    category: "Personal",
    is_active: 1,
    preview_link: "https://example.com/demo4",
    created_at: "2025-11-04",
  },
  {
    id: 5,
    title: "Mini Online Store",
    subtitle: "E-commerce lite",
    description: "Toko online sederhana untuk produk digital",
    price: "250000",
    category: "E-Commerce",
    is_active: 1,
    preview_link: "https://example.com/demo5",
    created_at: "2025-11-04",
  },
]

// 🧭 Chart Data Example
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--primary)" },
  mobile: { label: "Mobile", color: "var(--primary)" },
}

// 🧩 Drag handle button
function DragHandle({ id }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent">
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// 🪟 Detail Sheet
function TableCellViewer({ item }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="px-0 text-left text-foreground">
          {item.title}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{item.title}</SheetTitle>
          <SheetDescription>{item.subtitle}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4 text-sm">
          <div><b>Kategori:</b> {item.category}</div>
          <div><b>Harga:</b> Rp {parseInt(item.price).toLocaleString("id-ID")}</div>
          <div><b>Status:</b> {item.is_active ? "Aktif" : "Nonaktif"}</div>
          <div><b>Preview:</b>{" "}
            <a href={item.preview_link} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Lihat Produk</a>
          </div>
          <div><b>Dibuat:</b> {item.created_at}</div>
          <Separator />
          <div className="text-muted-foreground">{item.description}</div>
          <Separator />

          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="mobile"
                type="natural"
                fill="var(--color-mobile)"
                fillOpacity={0.6}
                stroke="var(--color-mobile)"
                stackId="a" />
              <Area
                dataKey="desktop"
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
                stackId="a" />
            </AreaChart>
          </ChartContainer>
        </div>

        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button variant="outline">Tutup</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// 🧱 Kolom tabel produk
const columns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
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
    header: () => <div className="text-right">Harga</div>,
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
    accessorKey: "preview_link",
    header: "Preview",
    cell: ({ row }) => (
      <a
        href={row.original.preview_link}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:underline">
        Lihat
      </a>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.original.created_at).toLocaleDateString("id-ID")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem>
            <PencilIcon className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RefreshCcwIcon className="mr-2 size-4" /> Refresh
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash2Icon className="mr-2 size-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// 🪄 Draggable row
function DraggableRow({ row }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// 🧩 Main DataTable
export function DataTable() {
  const [data, setData] = React.useState(dummyProducts)
  const [search, setSearch] = React.useState("")
  const [sorting, setSorting] = React.useState([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [visibleColumns, setVisibleColumns] = React.useState({})
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const filteredData = React.useMemo(() => {
    if (!search) return data
    return data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, data])

  const dataIds = React.useMemo(() => filteredData.map((d) => d.id), [filteredData])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, rowSelection, columnVisibility: visibleColumns },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setVisibleColumns,
  })

  function handleDragEnd(event) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs defaultValue="outline" className="flex flex-col gap-6">
      {/* 🔍 Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              className="pl-8 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setSearch("")}>
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="mr-2 h-4 w-4" /> Kolom
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table.getAllColumns().filter(c => c.getCanHide()).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}>
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          {/* 🔧 Filter + Tambah Produk */}
          <div className="flex items-center gap-2">
            {/* Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="mr-2 h-4 w-4" /> Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px]">
                <SheetHeader>
                  <SheetTitle>Filter Produk</SheetTitle>
                  <SheetDescription>
                    Gunakan filter untuk menyaring daftar produk.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 flex flex-col gap-4">
                  <div>
                    <Label>Kategori</Label>
                    <Select>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web App">Web App</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Harga Minimum</Label>
                    <Input type="number" placeholder="Rp 100.000" className="mt-1" />
                  </div>

                  <div>
                    <Label>Harga Maksimum</Label>
                    <Input type="number" placeholder="Rp 1.000.000" className="mt-1" />
                  </div>
                </div>
                <SheetFooter className="mt-auto">
                  <Button className="w-full">
                    Terapkan Filter
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Tambah Produk */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" size="sm" className="bg-primary text-white hover:bg-primary/90">
                  <PlusIcon className="mr-2 h-4 w-4" /> Tambah Produk
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[450px]">
                <SheetHeader>
                  <SheetTitle>Tambah Produk Baru</SheetTitle>
                  <SheetDescription>
                    Isi data produk baru di bawah ini lalu klik <b>Simpan</b>.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 flex flex-col gap-4">
                  <div>
                    <Label>Nama Produk</Label>
                    <Input placeholder="Masukkan nama produk" className="mt-1" />
                  </div>
                  <div>
                    <Label>Deskripsi Singkat</Label>
                    <Input placeholder="Masukkan deskripsi singkat" className="mt-1" />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Select>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web App">Web App</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Harga</Label>
                      <Input type="number" placeholder="Rp" className="mt-1" />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Aktif</SelectItem>
                          <SelectItem value="0">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Link Preview</Label>
                    <Input type="url" placeholder="https://example.com" className="mt-1" />
                  </div>
                </div>
                <SheetFooter>
                  <Button className="w-full" onClick={() => toast.success("Produk berhasil ditambahkan!")}>
                    Simpan Produk
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full">Batal</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* 📦 Table */}
      <TabsContent value="outline" className="overflow-auto px-4">
        <div className="overflow-hidden rounded-lg border bg-background">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            onDragEnd={handleDragEnd}>
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-6">
                        Tidak ada data produk.
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Pagination + Rows per page */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-4 gap-3">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} produk dipilih.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="rowsPerPage" className="text-sm font-medium">Rows per page</Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}>
                <SelectTrigger id="rowsPerPage" className="w-20">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled={!table.getCanPreviousPage()} onClick={() => table.setPageIndex(0)}><ChevronsLeftIcon /></Button>
              <Button variant="outline" size="icon" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeftIcon /></Button>
              <span className="text-sm font-medium">Hal {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}</span>
              <Button variant="outline" size="icon" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRightIcon /></Button>
              <Button variant="outline" size="icon" disabled={!table.getCanNextPage()} onClick={() => table.setPageIndex(table.getPageCount() - 1)}><ChevronsRightIcon /></Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
