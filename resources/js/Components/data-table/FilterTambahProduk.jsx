"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function FilterTambahProduk({ onFilter }) {
  return (
    <div className="flex gap-3 p-4 bg-muted/30 rounded-lg mb-4 flex-wrap">

      {/* Search */}
      <Input
        placeholder="Cari produk..."
        className="w-60"
        onChange={(e) => onFilter({ q: e.target.value })}
      />

      {/* Kategori */}
      <Select onValueChange={(v) => onFilter({ category: v })}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua</SelectItem>
          <SelectItem value="gamis">Gamis</SelectItem>
          <SelectItem value="hijab">Hijab</SelectItem>
          <SelectItem value="dress">Dress</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      <Button variant="outline" onClick={() => onFilter({ reset: true })}>
        Reset
      </Button>
    </div>
  )
}
