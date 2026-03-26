"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full">
            <Sidebar />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-2 top-2 rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
