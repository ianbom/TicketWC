"use client"

import * as React from "react"
import { usePage } from "@inertiajs/react"
import {
  LayoutDashboardIcon,
  ListIcon,
  FileTextIcon,
  BookOpenIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import logo from "/public/img/psn.jpg"
import wa from "/public/icon/whatsapp-svgrepo-com.svg"

export function AppSidebar({ ...props }) {
  const { auth } = usePage().props
  const user = auth?.user || {
    name: "Guest",
    email: "Not logged in",
    avatar: "/avatars/default.png",
  }

  // ====== MENU UTAMA ======
  const navMainItems = [
    {
      title: "Open Ticket",
      url: route("ticket.open"),
      icon: LayoutDashboardIcon,
    },
    {
      title: "List Ticket",
      url: route("ticket.list"),
      icon: ListIcon,
    },
    {
      title: "Report Ticket",
      url: route("ticket.report"),
      icon: FileTextIcon,
    },
    {
      title: "Work Instruction",
      url: route("ticket.wi"),
      icon: BookOpenIcon,
    },
    // {
    //   title: "Category Management",
    //   url: route("ticket.admin.categories.index"), // 🔥 FIXED
    //   icon: SettingsIcon,
    // }
  ]

  // ====== TAMBAHKAN KALAU ROLE ADMIN ======
  if (auth?.user?.role === "admin") {
    navMainItems.push({
      title: "User Management",
      url: route("ticket.users.index"), // FIX: gunakan route yg benar!
      icon: UsersIcon,
    })
    navMainItems.push({
      title: "Category Management",
      url: route("ticket.admin.categories.index"), // 🔥 FIXED
      icon: SettingsIcon,
    })

  }

  const data = {
    user,
    navMain: navMainItems,
    navSecondary: [
      {
        title: "Admin WA",
        url: "https://wa.me/6285733207709", // ganti dengan nomor WA admin +6285733207709
        icon: wa,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 flex items-center gap-2"
            >
              <a href={route("ticket.dashboard")} className="flex items-center gap-3">

                {/* LOGO */}
                <img
                  src={logo}     // ganti sesuai lokasi logo kamu
                  alt="Logo"
                  className="w-12 h-10 object-contain"
                />

                {/* TITLE */}
                <span className="text-base font-semibold">Ticketing</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      {/* Content */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
