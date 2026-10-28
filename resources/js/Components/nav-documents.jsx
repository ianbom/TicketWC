"use client"

import { cn } from "@/lib/utils"
import { usePage } from "@inertiajs/react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

/**
 * Komponen NavDocuments
 * Untuk menampilkan group menu di sidebar (Users, Orders, Media, System, dll)
 */
export function NavDocuments({ label = "Documents", items = [] }) {
  const { url } = usePage() // Untuk menandai item aktif berdasarkan URL

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* 🔹 Label Section */}
      <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-1">
        {label}
      </SidebarGroupLabel>

      {/* 🔹 Menu List */}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = url.startsWith(item.url)
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  "hover:bg-lime-400/60 hover:text-black",
                  isActive
                    ? "bg-lime-400/80 text-black font-semibold"
                    : "text-sidebar-foreground/90"
                )}
              >
                <a href={item.url || "#"}>
                  <item.icon
                    className={cn(
                      "mr-2 h-4 w-4 transition-colors",
                      isActive ? "text-black" : "text-muted-foreground"
                    )}
                  />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
