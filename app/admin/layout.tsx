"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LogOut, LayoutDashboard, Package, Calendar, Mountain, Users,
  MessageSquare, Car, ChevronDown, ChevronRight, UserCircle,
  Search, X, Loader2, Compass, MapPin,
} from "lucide-react";
import { signOut } from "next-auth/react";
import NotificationBell from "@/components/admin/notification-bell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session) return null;

  // Auto-open bookings submenu if on a bookings page
  const isOnBookingsPage = pathname.startsWith("/admin/bookings");

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/treks", label: "Manage Treks", icon: Mountain },
    { href: "/admin/services", label: "Services", icon: Package },
    { href: "/admin/guides", label: "Manage Guides", icon: Users },
    { href: "/admin/destinations", label: "Destinations", icon: MapPin },
    { href: "/admin/hotels", label: "Hotels", icon: Package },
    { href: "/admin/equipment", label: "Equipment", icon: Package },
    { href: "/admin/fleet", label: "Manage Fleet", icon: Car },
  ];

  const bookingSubItems = [
    { href: "/admin/bookings", label: "All Bookings", exact: true },
    { href: "/admin/bookings/trek-bookings", label: "Trek Bookings" },
    { href: "/admin/bookings/guide-bookings", label: "Guide Bookings" },
    { href: "/admin/bookings/car-bookings", label: "Car Bookings" },
    { href: "/admin/bookings/mountaineering", label: "Mountaineering" },
  ];

  const bottomNavItems = [
    { href: "/admin/rentals", label: "Rentals", icon: Package },
    { href: "/admin/vehicle-bookings", label: "Vehicle Requests", icon: Calendar },
    { href: "/admin/reviews", label: "Manage Reviews", icon: MessageSquare },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/profile", label: "Admin Profile", icon: UserCircle },
  ];

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  const totalResults = searchResults
    ? (searchResults.guides?.length || 0) +
      (searchResults.bookings?.length || 0) +
      (searchResults.guideBookings?.length || 0) +
      (searchResults.vehicleBookings?.length || 0) +
      (searchResults.notifications?.length || 0)
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Mountain className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Technie Trek</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-9">Admin Panel</p>
        </div>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
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

          {/* Collapsible Bookings Section */}
          <div>
            <button
              onClick={() => setBookingsOpen(!bookingsOpen)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isOnBookingsPage
                  ? "bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/60"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calendar size={18} />
                <span className="text-sm">Bookings</span>
              </div>
              {(bookingsOpen || isOnBookingsPage) ? (
                <ChevronDown size={14} className="transition-transform" />
              ) : (
                <ChevronRight size={14} className="transition-transform" />
              )}
            </button>
            {(bookingsOpen || isOnBookingsPage) && (
              <div className="ml-5 mt-1 space-y-0.5 border-l border-gray-800 pl-3">
                {bookingSubItems.map((sub) => {
                  const isActive = sub.exact
                    ? pathname === sub.href
                    : pathname === sub.href;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/40"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {bottomNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
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
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-sm font-bold text-white uppercase tracking-widest">
              {pathname.includes("/bookings/") 
                ? bookingSubItems.find(s => pathname === s.href)?.label || "Bookings"
                : pathname === "/admin/profile" 
                ? "Admin Profile"
                : navItems.find(item => pathname.startsWith(item.href))?.label || 
                  bottomNavItems.find(item => pathname.startsWith(item.href))?.label || 
                  "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search guides, bookings..."
                      className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                      autoFocus
                    />
                    {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 animate-spin" />}
                  </div>
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults(null); }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {searchOpen && searchResults && searchQuery.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {totalResults} Results
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.guides?.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800/50">Guides</p>
                        {searchResults.guides.map((g: any) => (
                          <Link
                            key={g._id}
                            href="/admin/guides"
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults(null); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/60 transition-colors"
                          >
                            <Users className="h-4 w-4 text-emerald-400" />
                            <div>
                              <p className="text-sm font-semibold text-white">{g.name}</p>
                              <p className="text-xs text-gray-500">${g.price}/day • {g.yearsExperience} yrs</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.bookings?.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800/50">Bookings</p>
                        {searchResults.bookings.map((b: any) => (
                          <Link
                            key={b._id}
                            href="/admin/bookings"
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults(null); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/60 transition-colors"
                          >
                            <Calendar className="h-4 w-4 text-blue-400" />
                            <div>
                              <p className="text-sm font-semibold text-white">{b.name}</p>
                              <p className="text-xs text-gray-500">{b.bookingType} • {b.status}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.guideBookings?.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800/50">Guide Bookings</p>
                        {searchResults.guideBookings.map((b: any) => (
                          <Link
                            key={b._id}
                            href="/admin/bookings/guide-bookings"
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults(null); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/60 transition-colors"
                          >
                            <Compass className="h-4 w-4 text-purple-400" />
                            <div>
                              <p className="text-sm font-semibold text-white">{b.customerName}</p>
                              <p className="text-xs text-gray-500">{b.bookingId} • {b.guideName}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.vehicleBookings?.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800/50">Vehicle Bookings</p>
                        {searchResults.vehicleBookings.map((b: any) => (
                          <Link
                            key={b._id}
                            href="/admin/vehicle-bookings"
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults(null); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/60 transition-colors"
                          >
                            <Car className="h-4 w-4 text-amber-400" />
                            <div>
                              <p className="text-sm font-semibold text-white">{b.customerName}</p>
                              <p className="text-xs text-gray-500">{b.vehicleName}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {totalResults === 0 && (
                      <div className="p-8 text-center text-gray-500 text-sm italic">
                        No results found for &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <NotificationBell />
            <div className="h-8 w-px bg-gray-800 mx-2" />
            <Link href="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">{session.user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Administrator</p>
              </div>
              <img 
                src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}`} 
                alt="" 
                className="w-8 h-8 rounded-full border border-gray-800"
              />
            </Link>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
