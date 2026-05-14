"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Calendar, Trash2, Loader2, Search, CheckCircle,
  XCircle, Clock, Eye, AlertCircle, Mountain, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bookingType: string;
  status: "pending" | "confirmed" | "cancelled";
  totalPrice: number;
  createdAt: string;
  bookingDetails: {
    guideName?: string;
    trekName?: string;
    startDate?: string;
    groupSize?: string;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const [res1, res2] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/hotel-bookings")
      ]);

      if (!res1.ok || !res2.ok) throw new Error("Failed to fetch bookings");

      const data1 = await res1.json();
      const data2 = await res2.json();

      // Map hotel bookings to match the unified booking interface
      const hotelBookingsMapped = data2.map((hb: any) => ({
        ...hb,
        name: hb.guestName,
        email: hb.guestEmail,
        phone: hb.guestPhone || "—",
        bookingType: "hotel",
        isHotelBooking: true,
        totalPrice: hb.totalPrice || 0,
        bookingDetails: {
          hotelName: hb.hotelId?.name || "Unknown Hotel",
          roomType: hb.roomType,
          startDate: hb.checkIn,
          endDate: hb.checkOut,
        }
      }));

      const combined = [...data1, ...hotelBookingsMapped].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setBookings(combined);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string, isHotelBooking?: boolean) => {
    setActionLoading(id);
    try {
      const endpoint = isHotelBooking ? `/api/hotel-bookings/${id}` : `/api/bookings/${id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchBookings();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-gray-400 text-lg font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Bookings Management
          </h1>
          <p className="text-gray-400 mt-1">Review and manage all incoming booking requests</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-700/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No bookings found</h3>
            <p className="text-gray-500">When customers book, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-800/50 text-xs uppercase text-gray-400 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{booking.name}</span>
                        <span className="text-gray-400 text-xs">{booking.email}</span>
                        {booking.phone && <span className="text-gray-500 text-xs">{booking.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {booking.bookingDetails?.trekName && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <Mountain className="h-3.5 w-3.5" /> {booking.bookingDetails.trekName}
                          </div>
                        )}
                        {booking.bookingDetails?.guideName && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-400">
                            <User className="h-3.5 w-3.5" /> Guide: {booking.bookingDetails.guideName}
                          </div>
                        )}
                        {booking.bookingDetails?.startDate && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                            <Calendar className="h-3.5 w-3.5" /> Starts: {booking.bookingDetails.startDate}
                            {booking.bookingDetails?.groupSize && ` (${booking.bookingDetails.groupSize} pax)`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-400">
                      ${booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle className="h-3.5 w-3.5" />}
                        {booking.status === 'cancelled' && <XCircle className="h-3.5 w-3.5" />}
                        {booking.status === 'pending' && <Clock className="h-3.5 w-3.5" />}
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(booking._id, 'confirmed', (booking as any).isHotelBooking)}
                              disabled={actionLoading === booking._id}
                              className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(booking._id, 'cancelled', (booking as any).isHotelBooking)}
                              disabled={actionLoading === booking._id}
                              className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(booking._id, 'pending', (booking as any).isHotelBooking)}
                            disabled={actionLoading === booking._id}
                            className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all"
                          >
                            Revert to Pending
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
