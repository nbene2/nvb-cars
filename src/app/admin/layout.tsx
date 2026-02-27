"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, MessageSquare, Settings, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: Home, label: "Pipeline" },
  { href: "/admin/leads", icon: Users, label: "Leads" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/scoring", icon: Settings, label: "Scoring" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="glass-card flex w-56 flex-col border-r">
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            AE
          </div>
          <div>
            <p className="text-sm font-semibold">AutoElite</p>
            <p className="text-[10px] text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-sm",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                  size="sm"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3 space-y-1">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Site
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              Demo Mode
            </Button>
          </Link>
          <div className="flex justify-center pt-2">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
