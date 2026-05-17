"use client";
import { useEffect, useState, useCallback } from "react";
import { Calendar, Loader2, Search, CheckCircle, XCircle, Clock, AlertCircle, Mountain, Download } from "lucide-react";

export default function TrekBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings?type=guide");
      if (res.ok) {
        let data = await res.json();
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          data = data.filter((b: any) => b.name?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q));
        }
        if (statusFilter) data = data.filter((b: any) => b.status === statusFilter);
        setBookings(data);
      }
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, [searchQuery, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { if (success || error) { const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000); return () => clearTimeout(t); } }, [success, error]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error("Failed"); setSuccess(`Booking ${status}`); await fetchBookings();
    } catch (err: any) { setError(err.message); } finally { setActionLoading(null); }
  };

  const exportCSV = () => {
    const rows = bookings.map(b => [b.name, b.email, b.bookingType, b.status, b.totalPrice, new Date(b.createdAt).toLocaleDateString()]);
    const csv = ["Name,Email,Type,Status,Price,Date", ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "trek-bookings.csv"; a.click();
  };

  if (loading) return (<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Trek Bookings</h1><p className="text-gray-400 mt-1">Manage trek booking requests</p></div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700"><Download className="h-4 w-4" /> Export</button>
      </div>
      {success && <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl"><CheckCircle className="h-4 w-4" />{success}</div>}
      {error && <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl"><AlertCircle className="h-4 w-4" />{error}</div>}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"><option value="">All</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select>
        </div>
        {bookings.length === 0 ? (<div className="p-12 text-center"><Mountain className="h-16 w-16 text-gray-600 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-300">No trek bookings</h3></div>) : (
          <div className="overflow-x-auto"><table className="w-full text-left text-sm text-gray-300"><thead className="bg-gray-800/50 text-xs uppercase text-gray-400 border-b border-gray-700/50"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Details</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-700/50">{bookings.map((b) => (<tr key={b._id} className="hover:bg-gray-800/30"><td className="px-5 py-3"><p className="font-bold text-white">{b.name}</p><p className="text-xs text-gray-500">{b.email}</p></td><td className="px-5 py-3 text-xs">{b.bookingDetails?.trekName && <p className="text-emerald-400">{b.bookingDetails.trekName}</p>}{b.bookingDetails?.startDate && <p className="text-gray-500">Start: {b.bookingDetails.startDate}</p>}</td><td className="px-5 py-3 font-bold text-emerald-400">${b.totalPrice || 0}</td><td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : b.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{b.status}</span></td><td className="px-5 py-3 text-right"><div className="flex items-center justify-end gap-1.5">{b.status === "pending" && (<><button onClick={() => updateStatus(b._id, "confirmed")} className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">Approve</button><button onClick={() => updateStatus(b._id, "cancelled")} className="px-2.5 py-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">Reject</button></>)}{b.status !== "pending" && (<button onClick={() => updateStatus(b._id, "pending")} className="px-2.5 py-1 text-[10px] font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-lg">Revert</button>)}</div></td></tr>))}</tbody></table></div>
        )}
      </div>
    </div>
  );
}
