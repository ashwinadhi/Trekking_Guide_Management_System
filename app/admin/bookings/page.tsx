"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Calendar, Trash2, Loader2, Search, CheckCircle,
  XCircle, Clock, Eye, AlertCircle, Mountain, User
} from "lucide-react";
import {
  BookingStatusDialog,
  type BookingStatusAction,
} from "@/components/admin/booking-status-dialog";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";

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
    hotelName?: string;
    roomType?: string;
    startDate?: string;
    endDate?: string;
    groupSize?: string;
  };
  isHotelBooking?: boolean;
}

interface PendingStatusAction {
  id: string;
  status: "confirmed" | "cancelled";
  action: BookingStatusAction;
  customerName: string;
  customerEmail: string;
  summary: string;
  isHotelBooking?: boolean;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingStatusAction | null>(null);
  const { toast } = useToast();

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

  const openStatusDialog = (
    booking: Booking,
    status: "confirmed" | "cancelled",
    action: BookingStatusAction
  ) => {
    const details = booking.bookingDetails || {};
    const summary = booking.isHotelBooking
      ? `Hotel: ${details.hotelName || "—"} · ${details.startDate || "—"} → ${details.endDate || "—"}`
      : [
          details.trekName && `Trek: ${details.trekName}`,
          details.guideName && `Guide: ${details.guideName}`,
          details.startDate && `Start: ${details.startDate}`,
        ]
          .filter(Boolean)
          .join(" · ") || "Booking request";

    setPendingAction({
      id: booking._id,
      status,
      action,
      customerName: booking.name,
      customerEmail: booking.email,
      summary,
      isHotelBooking: booking.isHotelBooking,
    });
  };

  const updateStatus = async (
    id: string,
    status: string,
    isHotelBooking?: boolean,
    notifyCustomer = false
  ) => {
    setActionLoading(true);
    try {
      const endpoint = isHotelBooking ? `/api/hotel-bookings/${id}` : `/api/bookings/${id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notifyCustomer }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchBookings();
      if (notifyCustomer) {
        toast({
          title: status === "confirmed" ? "Booking approved" : "Booking rejected",
          description: "Status updated and customer notified by email.",
        });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  const handleConfirmStatusChange = () => {
    if (!pendingAction) return;
    updateStatus(
      pendingAction.id,
      pendingAction.status,
      pendingAction.isHotelBooking,
      true
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
          <p className="text-gray-400 text-lg font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Guide & Hotel Bookings"
        description="Review, approve, or reject incoming guide and hotel reservation requests."
      />

      {error && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <AdminPanel className="overflow-hidden">
        <div className="border-b border-slate-200 p-6 dark:border-gray-700/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold/50 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
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
                          <div className="flex items-center gap-1.5 text-xs text-gold">
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
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gold">
                      ${booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        booking.status === 'confirmed' ? 'bg-gold/10 text-gold border-gold/20' :
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
                              onClick={() => openStatusDialog(booking, "confirmed", "approve")}
                              disabled={actionLoading}
                              className="px-3 py-1.5 text-xs font-bold text-gold bg-gold/10 hover:bg-gold/20 border border-gold/20 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openStatusDialog(booking, "cancelled", "reject")}
                              disabled={actionLoading}
                              className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(booking._id, "pending", booking.isHotelBooking)}
                            disabled={actionLoading}
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
      </AdminPanel>

      {pendingAction && (
        <BookingStatusDialog
          open={!!pendingAction}
          onOpenChange={(open) => !open && !actionLoading && setPendingAction(null)}
          action={pendingAction.action}
          customerName={pendingAction.customerName}
          customerEmail={pendingAction.customerEmail}
          summary={pendingAction.summary}
          loading={actionLoading}
          onConfirm={handleConfirmStatusChange}
        />
      )}
    </div>
  );
}
