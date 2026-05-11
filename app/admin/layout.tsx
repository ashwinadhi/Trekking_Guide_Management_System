"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Package, Calendar, Mountain, Users, MessageSquare, Car, MapPin } from "lucide-react";
import { signOut } from "next-auth/react";
import NotificationBell from "@/components/admin/notification-bell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session) return null;

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/services", label: "Services", icon: Package },
    { href: "/admin/guides", label: "Manage Guides", icon: Users },
    { href: "/admin/destinations", label: "Destinations", icon: Mountain },
    { href: "/admin/hotels", label: "Hotels", icon: Package }, 
    { href: "/admin/equipment", label: "Equipment", icon: Package },
    { href: "/admin/fleet", label: "Manage Fleet", icon: Car },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/rentals", label: "Rentals", icon: Package },
    { href: "/admin/vehicle-bookings", label: "Vehicle Requests", icon: Calendar },
    { href: "/admin/reviews", label: "Manage Reviews", icon: MessageSquare },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Mountain className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Technie Trek</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-9">Admin Panel</p>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium w-full transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-950">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur-md">
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-widest">
              {navItems.find(item => pathname.startsWith(item.href))?.label || "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-8 w-px bg-gray-800 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">{session.user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Administrator</p>
              </div>
              <img 
                src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}`} 
                alt="" 
                className="w-8 h-8 rounded-full border border-gray-800"
              />
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
