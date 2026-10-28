"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { BellIcon, RefreshCcwIcon, DownloadIcon } from "lucide-react"

export function SiteHeader({
  title = "Dashboard",
  description = "Overview of your system",
  actions,
}) {
  return (
    <header
      className="
        flex flex-wrap items-center justify-between gap-3
        border-b bg-background/60 px-4 py-3
        backdrop-blur supports-[backdrop-filter]:bg-background/80
        transition-all md:px-6
      "
    >
      {/* 🔹 Left section: Title & description */}
      <div className="flex flex-1 min-w-0 items-center gap-2">
        {/* Sidebar trigger for mobile */}
        <SidebarTrigger className="-ml-1" />

        {/* Separator on large screens */}
        <Separator orientation="vertical" className="mx-2 hidden h-5 md:block" />

        <div className="min-w-0">
          <h1 className="text-lg font-semibold leading-tight truncate sm:text-xl">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* 🔹 Right section: Actions */}
      <div
        className="
          flex w-full flex-wrap items-center justify-start gap-2 pt-2
          border-t md:w-auto md:justify-end md:pt-0 md:border-0
        "
      >
        {actions ? (
          actions
        ) : (
          <>
            {/* <Button variant="outline" size="icon">
              <RefreshCcwIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <DownloadIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <BellIcon className="h-4 w-4" />
            </Button> */}
          </>
        )}
      </div>
    </header>
  )
}
