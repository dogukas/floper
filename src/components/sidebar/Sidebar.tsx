"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  Package,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  BarChart,
  Settings,
  LogOut,
  Moon,
  Sun,
  Box,
  ClipboardList
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()

  // Simple dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      title: "Stok Sorgula",
      icon: <Package size={20} />,
      href: "/stock",
    },
    {
      title: "Stok Sayım",
      icon: <ClipboardList size={20} />,
      href: "/stock-counting",
    },
    {
      title: "3D Depo",
      icon: <Box size={20} />,
      href: "/warehouse-3d",
    },
    {
      title: "Operasyon",
      isHeader: true,
    },
    {
      title: "Ürün Planlama",
      icon: <ClipboardList size={20} />,
      href: "/operations/planning",
    },
    {
      title: "Satış Analiz",
      icon: <TrendingUp size={20} />,
      href: "/sales",
    },
    {
      title: "Personel Analiz",
      icon: <Users size={20} />,
      href: "/personnel-analysis",
    },
    {
      title: "Personel Ciro ve KPI",
      icon: <BarChart size={20} />,
      href: "/personnel-kpi",
    }
  ]

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className={cn("flex items-center gap-2 overflow-hidden", isCollapsed && "hidden")}>
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-1 rounded-md">
            <HomeIcon size={18} />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white truncate">
            Flope
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          if (item.isHeader) {
            if (isCollapsed) return <div key={index} className="h-px bg-slate-200 dark:bg-slate-800 my-2" />;
            return (
              <div key={index} className="px-3 py-2 mt-2 mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.title}
              </div>
            );
          }

          const isActive = item.href ? pathname === item.href : false;

          return (
            <Link
              key={item.href || index}
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isCollapsed && "justify-center px-2",
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <div className={cn(
                isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900"
              )}>
                {item.icon}
              </div>

              {!isCollapsed && (
                <span className="truncate text-sm">
                  {item.title}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / User Profile */}

    </div>
  )
}
