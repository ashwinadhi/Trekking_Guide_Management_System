"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Calendar, Loader2, Search, CheckCircle, XCircle, Clock,
  AlertCircle, Mountain, User, Download, Filter, Eye, Trash2, ChevronDown,
} from "lucide-react";

interface GuideBooking {
  _id: string;
  bookingId: string;
  guideName: string;
  serviceCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  groupSize: number;
  pickupLocation: string;
  specialNotes: string;
  pricePerDay: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: string;
  createdAt: string;
}

export default function GuideBookingsPage() {
  const [bookings, setBookings] = useState<GuideBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewDetail, setViewDetail] = useState<GuideBooking | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      let url = "/api/guide-bookings?limit=100";
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/guide-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setSuccess(`Booking ${status} successfully`);
      await fetchBookings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/guide-bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSuccess("Booking deleted");
      await fetchBookings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Booking ID", "Customer", "Guide", "Service", "Start", "End", "Days", "Group", "Amount", "Status"];
    const rows = bookings.map(b => [
      b.bookingId, b.customerName, b.guideName,
      b.serviceCategory.replace("_", " "), 
      new Date(b.startDate).toLocaleDateString(),
      new Date(b.endDate).toLocaleDateString(),
      b.numberOfDays, b.groupSize, b.totalAmount, b.status,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guide-bookings.csv";
    a.click();
  };

  const statusColor = (s: string) =>
    s === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : s === "completed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
    : s === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20"
    : "bg-amber-500/10 text-amber-400 border-amber-500/20";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-gray-400 text-lg font-medium">Loading guide bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Guide Bookings
          </h1>
          <p className="text-gray-400 mt-1">Manage all guide booking requests</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium border border-gray-700 transition-all">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {success && <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl"><CheckCircle className="h-4 w-4" />{success}</div>}
      {error && <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl"><AlertCircle className="h-4 w-4" />{error}</div>}

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, ID..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none pr-8"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No guide bookings found</h3>
            <p className="text-gray-500">Guide bookings will appear here when customers book.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-800/50 text-xs uppercase text-gray-400 border-b border-gray-700/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Booking ID</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Guide</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Dates</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-emerald-400">{b.bookingId}</td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-white">{b.customerName}</p>
                      <p className="text-xs text-gray-500">{b.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-white">{b.guideName}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">
                        {b.serviceCategory.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      <p>{new Date(b.startDate).toLocaleDateString()}</p>
                      <p className="text-gray-500">{b.numberOfDays} days • {b.groupSize} pax</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-emerald-400">${b.totalAmount}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${statusColor(b.status)}`}>
                        {b.status === "confirmed" && <CheckCircle className="h-3 w-3" />}
                        {b.status === "completed" && <CheckCircle className="h-3 w-3" />}
                        {b.status === "cancelled" && <XCircle className="h-3 w-3" />}
                        {b.status === "pending" && <Clock className="h-3 w-3" />}
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewDetail(b)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg" title="View Details">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(b._id, "confirmed")} disabled={actionLoading === b._id}
                              className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg">
                              Approve
                            </button>
                            <button onClick={() => updateStatus(b._id, "cancelled")} disabled={actionLoading === b._id}
                              className="px-2.5 py-1 text-[10px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg">
                              Reject
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button onClick={() => updateStatus(b._id, "completed")} disabled={actionLoading === b._id}
                            className="px-2.5 py-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg">
                            Complete
                          </button>
                        )}
                        <button onClick={() => deleteBooking(b._id)} disabled={actionLoading === b._id}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewDetail(null)}>
          <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-lg w-full shadow-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Booking Details</h3>
              <button onClick={() => setViewDetail(null)} className="text-gray-400 hover:text-white"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500 text-xs">Booking ID</p><p className="font-bold text-emerald-400 font-mono">{viewDetail.bookingId}</p></div>
              <div><p className="text-gray-500 text-xs">Status</p><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusColor(viewDetail.status)}`}>{viewDetail.status}</span></div>
              <div><p className="text-gray-500 text-xs">Customer</p><p className="font-semibold text-white">{viewDetail.customerName}</p></div>
              <div><p className="text-gray-500 text-xs">Email</p><p className="text-gray-300">{viewDetail.customerEmail}</p></div>
              <div><p className="text-gray-500 text-xs">Phone</p><p className="text-gray-300">{viewDetail.customerPhone}</p></div>
              <div><p className="text-gray-500 text-xs">Guide</p><p className="font-semibold text-white">{viewDetail.guideName}</p></div>
              <div><p className="text-gray-500 text-xs">Service</p><p className="text-gray-300 capitalize">{viewDetail.serviceCategory.replace("_", " ")}</p></div>
              <div><p className="text-gray-500 text-xs">Duration</p><p className="text-gray-300">{viewDetail.numberOfDays} days</p></div>
              <div><p className="text-gray-500 text-xs">Start Date</p><p className="text-gray-300">{new Date(viewDetail.startDate).toLocaleDateString()}</p></div>
              <div><p className="text-gray-500 text-xs">End Date</p><p className="text-gray-300">{new Date(viewDetail.endDate).toLocaleDateString()}</p></div>
              <div><p className="text-gray-500 text-xs">Group Size</p><p className="text-gray-300">{viewDetail.groupSize} person(s)</p></div>
              <div><p className="text-gray-500 text-xs">Total Amount</p><p className="font-bold text-emerald-400 text-lg">${viewDetail.totalAmount}</p></div>
              {viewDetail.pickupLocation && <div className="col-span-2"><p className="text-gray-500 text-xs">Pickup</p><p className="text-gray-300">{viewDetail.pickupLocation}</p></div>}
              {viewDetail.specialNotes && <div className="col-span-2"><p className="text-gray-500 text-xs">Notes</p><p className="text-gray-300">{viewDetail.specialNotes}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
