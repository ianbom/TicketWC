import { Link, usePage } from "@inertiajs/react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({ items }) {
  const { url } = usePage()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = url.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.title} className="relative">

                {/* GARIS KUNING KIRI */}
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 rounded-r transition-all",
                    isActive ? "bg-secondary" : "bg-transparent"
                  )}
                />

                <Link href={item.url} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "w-full justify-start transition-all rounded-md",

                      // 🔥 ACTIVE UNDERGROUND BLOCK
                      isActive &&
                        "bg-secondary/25 text-sidebar-primary font-semibold shadow-sm",

                      // Default
                      !isActive &&
                        "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "h-4 w-4 mr-2",
                          isActive
                            ? "text-sidebar-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    )}

                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
