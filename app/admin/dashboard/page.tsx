"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  BarChart3, TrendingUp, DollarSign, Users, Calendar, Mountain,
  Loader2, ArrowUpRight, ArrowDownRight, Activity, Zap,
  CheckCircle, Clock, XCircle, Eye,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

interface DashboardData {
  kpi: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    activeGuides: number;
    totalGuides: number;
    totalTreks: number;
  };
  monthlyStats: {
    month: string;
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    revenue: number;
  }[];
  bookingTypeBreakdown: Record<string, number>;
  insights: {
    mostActiveGuide: { name: string; count: number } | null;
    mostBookedService: { name: string; count: number } | null;
    highestRevenueCategory: string;
    peakBookingMonth: string;
  };
  recentBookings: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-gray-400 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { kpi, monthlyStats, bookingTypeBreakdown, insights, recentBookings } = data;

  const kpiCards = [
    { label: "Total Bookings", value: kpi.totalBookings, icon: Calendar, color: "emerald", trend: "+12%" },
    { label: "Pending Bookings", value: kpi.pendingBookings, icon: Clock, color: "amber", trend: null },
    { label: "Confirmed", value: kpi.confirmedBookings, icon: CheckCircle, color: "blue", trend: "+8%" },
    { label: "Revenue", value: `$${kpi.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "purple", trend: "+15%" },
    { label: "Active Guides", value: `${kpi.activeGuides}/${kpi.totalGuides}`, icon: Users, color: "teal", trend: null },
    { label: "Active Treks", value: kpi.totalTreks, icon: Mountain, color: "orange", trend: null },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "bg-emerald-500/5" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "bg-amber-500/5" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "bg-blue-500/5" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", glow: "bg-purple-500/5" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20", glow: "bg-teal-500/5" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", glow: "bg-orange-500/5" },
  };

  const pieData = Object.entries(bookingTypeBreakdown)
    .filter(([_, v]) => v > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));

  const statusData = [
    { name: "Confirmed", value: kpi.confirmedBookings, color: "#10b981" },
    { name: "Pending", value: kpi.pendingBookings, color: "#f59e0b" },
    { name: "Cancelled", value: kpi.cancelledBookings, color: "#ef4444" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-1">Real-time business analytics & insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card, idx) => {
          const colors = colorMap[card.color];
          return (
            <div
              key={idx}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${colors.glow} rounded-full blur-2xl group-hover:scale-150 transition-all duration-500`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 ${colors.bg} rounded-xl`}>
                    <card.icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  {card.trend && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                      <ArrowUpRight className="h-3 w-3" />
                      {card.trend}
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                <p className="text-sm text-gray-400 font-medium">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Revenue Trend
            </h3>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyStats}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#fff" }}
                labelStyle={{ color: "#9ca3af" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Booking Stats */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Monthly Bookings
            </h3>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Confirmed vs Pending</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyStats} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#fff" }}
                labelStyle={{ color: "#9ca3af" }}
              />
              <Bar dataKey="confirmed" fill="#10b981" radius={[4, 4, 0, 0]} name="Confirmed" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Donut */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            Booking Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#fff" }}
              />
              <Legend
                formatter={(value) => <span className="text-gray-300 text-xs font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Type Breakdown */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-400" />
            Service Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#fff" }}
              />
              <Legend
                formatter={(value) => <span className="text-gray-300 text-xs font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Business Insights */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-400" />
            Business Insights
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Most Active Guide</p>
              <p className="text-sm font-bold text-white">
                {insights.mostActiveGuide ? `${insights.mostActiveGuide.name} (${insights.mostActiveGuide.count} bookings)` : "No data yet"}
              </p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Most Booked Service</p>
              <p className="text-sm font-bold text-white capitalize">
                {insights.mostBookedService ? `${insights.mostBookedService.name.replace("_", " ")} (${insights.mostBookedService.count})` : "No data yet"}
              </p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Peak Booking Month</p>
              <p className="text-sm font-bold text-white">{insights.peakBookingMonth}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Top Revenue Category</p>
              <p className="text-sm font-bold text-white capitalize">{insights.highestRevenueCategory.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Recent Activity
          </h3>
          <Link
            href="/admin/bookings"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1"
          >
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800/50 text-xs uppercase text-gray-400 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">No recent bookings</td>
                </tr>
              ) : (
                recentBookings.map((b: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        b.source === "guide_booking"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : b.source === "vehicle_booking"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {b.source === "guide_booking" ? "Guide" : b.source === "vehicle_booking" ? "Vehicle" : (b.bookingType || "Booking")}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-bold text-emerald-400">${b.totalPrice || 0}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        b.status === "confirmed" || b.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : b.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {b.status === "confirmed" || b.status === "completed" ? <CheckCircle className="h-3 w-3" /> : b.status === "cancelled" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
