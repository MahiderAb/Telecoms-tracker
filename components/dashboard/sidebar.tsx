"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  PlusCircle,
  Settings,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderKanban className="h-5 w-5" />,
  },
  {
    label: "Starred",
    href: "/starred",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Add New",
    href: "/new",
    icon: <PlusCircle className="h-5 w-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    label: "Help",
    href: "/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-white text-black transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-20 overflow-hidden rounded-full">
              <Image
                src="/Et.png"
                alt="ET Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-lg font-semibold">IssueTracker</span>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto relative h-8 w-8 overflow-hidden rounded-full">
            <Image src="/Et.png" alt="ET Logo" fill className="object-cover" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1 hover:bg-green-100 transition-colors",
            collapsed && "mx-auto mt-2",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-green-200 text-black"
                    : "text-black hover:bg-green-100",
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 px-3 py-4">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-green-200 text-black"
                    : "text-black hover:bg-green-100",
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
