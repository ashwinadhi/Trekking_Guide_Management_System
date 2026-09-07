"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  Mountain,
  Calendar,
  Package,
  Car,
  Users,
  MapPin,
  Building2,
  Wrench,
  Mail,
  Star,
  ChevronDown,
  KeyRound,
  Menu,
  X,
  Route,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/admin/notification-bell";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import { ChangePasswordDialog } from "@/components/admin/change-password-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  exact?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Bookings",
    items: [
      { href: "/admin/bookings", label: "Guide & Hotel", icon: Calendar },
      { href: "/admin/rentals", label: "Equipment Rentals", icon: Package },
      { href: "/admin/vehicle-bookings", label: "Vehicle Requests", icon: Car },
      { href: "/admin/helicopter-bookings", label: "Helicopter Requests", icon: Plane },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/treks", label: "Trek Routes", icon: Route },
      { href: "/admin/services", label: "Services", icon: Package },
      { href: "/admin/guides", label: "Guides", icon: Users },
      { href: "/admin/destinations", label: "Destinations", icon: Mountain },
      { href: "/admin/hotels", label: "Hotels", icon: Building2 },
      { href: "/admin/equipment", label: "Equipment", icon: Wrench },
      { href: "/admin/fleet", label: "Fleet", icon: Car },
      { href: "/admin/helicopters", label: "Helicopters", icon: Plane },
      { href: "/admin/locations", label: "Locations", icon: MapPin },
    ],
  },
  {
    title: "Engagement",
    items: [
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
    ],
  },
];

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function getPageTitle(pathname: string): string {
  for (const section of navSections) {
    for (const item of section.items) {
      if (isActive(pathname, item)) return item.label;
    }
  }
  return "Admin Panel";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const sidebarContent = (
    <>
      <div className="border-b border-slate-200 px-5 py-5 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src="/images/nirvana-luxury-adventure-logo.jpg"
            alt="Nirvana Luxury Adventure"
            className="h-11 w-auto object-contain"
          />
          <div>
            <h2 className="font-display text-lg leading-tight text-ivory">Nirvana Luxury Adventure</h2>
            <p className="text-xs text-stone">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {navSections.map((section) => {
          const sectionCollapsed = collapsed[section.title] ?? false;
          const hasActive = section.items.some((item) => isActive(pathname, item));

          return (
            <div key={section.title}>
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className={cn(
                  "mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider",
                  hasActive
                    ? "text-gold"
                    : "text-stone"
                )}
              >
                {section.title}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", sectionCollapsed && "-rotate-90")}
                />
              </button>
              {!sectionCollapsed && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(pathname, item);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all",
                          active
                            ? "border border-gold/30 bg-gold/10 font-semibold text-gold"
                            : "text-stone hover:bg-secondary hover:text-ivory"
                        )}
                      >
                        <item.icon size={17} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-200 p-3 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setPasswordOpen(true)}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-all hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-white"
        >
          <KeyRound size={17} />
          Change password
        </button>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gold/20 bg-card lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-card">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gold/20 bg-card/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <p className="luxury-label">Admin</p>
              <h1 className="font-display text-base text-ivory sm:text-lg">
                {getPageTitle(pathname)}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <AdminThemeToggle />
            <NotificationBell />
            <div className="hidden h-8 w-px bg-slate-200 dark:bg-gray-800 sm:block" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-800"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.email || "Admin")}&background=C9A86A&color=070707`}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden max-w-[140px] truncate text-xs font-semibold text-slate-700 dark:text-gray-200 sm:inline">
                    {session?.user?.email || "Administrator"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPasswordOpen(true)} className="cursor-pointer">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change password
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </div>
  );
}
