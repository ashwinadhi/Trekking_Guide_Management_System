"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Calendar,
  CheckCircle2,
  Clock3,
  DollarSign,
  Car,
  Package,
  Mountain,
  ArrowRight,
  XCircle,
  Plane,
} from "lucide-react";
import { AdminPageHeader, AdminPanel, AdminPanelHeader, AdminStatCard } from "@/components/admin/admin-ui";
import { BookingsMonthlyChart, type MonthlyChartPoint } from "@/components/admin/bookings-monthly-chart";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  counts: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    guide: number;
    hotel: number;
    equipment: number;
    vehicle: number;
    helicopter: number;
  };
  revenueConfirmed: number;
  monthlyChart: MonthlyChartPoint[];
  recent: Array<{
    id: number;
    label: string;
    type: string;
    status: string;
    totalPrice: number;
    createdAt: string;
  }>;
}

const bookingLinks = [
  { href: "/admin/bookings", label: "Guide & Hotel", icon: Calendar, countKey: "guide" as const },
  { href: "/admin/rentals", label: "Equipment", icon: Package, countKey: "equipment" as const },
  { href: "/admin/vehicle-bookings", label: "Vehicles", icon: Car, countKey: "vehicle" as const },
  { href: "/admin/helicopter-bookings", label: "Helicopters", icon: Plane, countKey: "helicopter" as const },
];

const typeLabels: Record<string, string> = {
  guide: "Guide",
  hotel: "Hotel",
  equipment: "Equipment",
  vehicle: "Vehicle",
  car: "Vehicle",
  helicopter: "Helicopter",
  service: "Service",
};

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase text-gold dark:text-gold">
        <CheckCircle2 className="h-3 w-3" /> Confirmed
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
        <XCircle className="h-3 w-3" /> Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
      <Clock3 className="h-3 w-3" /> Pending
    </span>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      if (!res.ok) throw new Error("Failed to load dashboard");
      setStats(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
          <p className="text-slate-500 dark:text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
        {error || "Unable to load dashboard data"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of bookings, revenue, and activity across Nirvana Luxury Adventure."
        action={
          <Button asChild className="bg-gold hover:bg-gold/90">
            <Link href="/admin/bookings">
              Review bookings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total bookings"
          value={stats.counts.total}
          hint={`${stats.counts.pending} awaiting action`}
          icon={Calendar}
          accent="gold"
        />
        <AdminStatCard
          label="Pending review"
          value={stats.counts.pending}
          hint="Requires admin approval"
          icon={Clock3}
          accent="amber"
        />
        <AdminStatCard
          label="Confirmed"
          value={stats.counts.confirmed}
          hint={`${stats.counts.cancelled} cancelled`}
          icon={CheckCircle2}
          accent="gold"
        />
        <AdminStatCard
          label="Confirmed revenue"
          value={`$${stats.revenueConfirmed.toLocaleString()}`}
          hint="From approved bookings"
          icon={DollarSign}
          accent="gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <AdminPanel className="xl:col-span-2 overflow-hidden">
          <AdminPanelHeader
            title="Bookings by month"
            description="Confirmed vs pending requests over the last 6 months"
          />
          <div className="p-4 sm:p-6">
            <BookingsMonthlyChart data={stats.monthlyChart} />
          </div>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Booking channels" description="Open each queue to manage requests" />
          <div className="divide-y divide-slate-200 dark:divide-gray-800">
            {bookingLinks.map((link) => {
              const Icon = link.icon;
              const count =
                link.countKey === "guide"
                  ? stats.counts.guide + stats.counts.hotel
                  : stats.counts[link.countKey];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gold/10 p-2 text-gold dark:text-gold">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{link.label}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-500">{count} total</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              );
            })}
          </div>
        </AdminPanel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminPanel>
          <AdminPanelHeader
            title="Recent activity"
            description="Latest booking requests across all channels"
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/bookings">View all</Link>
              </Button>
            }
          />
          <div className="divide-y divide-slate-200 dark:divide-gray-800">
            {stats.recent.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-500 dark:text-gray-500">
                No bookings yet.
              </p>
            ) : (
              stats.recent.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {typeLabels[item.type] || item.type} ·{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <p className="font-bold text-gold dark:text-gold">${item.totalPrice}</p>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Quick actions" description="Common admin tasks" />
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {[
              { href: "/admin/bookings", label: "Approve bookings", icon: Calendar },
              { href: "/admin/treks", label: "Manage treks", icon: Mountain },
              { href: "/admin/guides", label: "Manage guides", icon: Mountain },
              { href: "/admin/inquiries", label: "Read inquiries", icon: Package },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 border border-gold/20 bg-secondary px-4 py-3 text-sm font-medium text-ivory transition-all hover:border-gold/40 hover:bg-gold/10"
              >
                <action.icon className="h-4 w-4 text-gold dark:text-gold" />
                {action.label}
              </Link>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
