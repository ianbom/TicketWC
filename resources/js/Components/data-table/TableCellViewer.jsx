"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--primary)" },
  mobile: { label: "Mobile", color: "var(--primary)" },
}

export default function TableCellViewer({ item }) {
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
            <a href={item.preview_link} className="text-blue-600 hover:underline" target="_blank">Lihat Produk</a>
          </div>
          <div><b>Dibuat:</b> {item.created_at}</div>
          <Separator />
          <div className="text-muted-foreground">{item.description}</div>
          <Separator />

          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="mobile" fill="var(--color-mobile)" stroke="var(--color-mobile)" stackId="a" />
              <Area dataKey="desktop" fill="var(--color-desktop)" stroke="var(--color-desktop)" stackId="a" />
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
