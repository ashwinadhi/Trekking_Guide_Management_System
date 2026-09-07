"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Calendar, MapPin, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookingStatusDialog, type BookingStatusAction } from "@/components/admin/booking-status-dialog";
import { AdminPageHeader } from "@/components/admin/admin-ui";

interface HelicopterBooking {
  _id: string;
  helicopterName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureHelipad: string;
  landingHelipad: string;
  startDate: string;
  endDate: string;
  passengers: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

interface PendingStatusAction {
  id: string;
  status: "confirmed" | "cancelled";
  action: BookingStatusAction;
  customerName: string;
  customerEmail: string;
  summary: string;
}

export default function AdminHelicopterBookingsPage() {
  const [bookings, setBookings] = useState<HelicopterBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingStatusAction | null>(null);
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/helicopter-bookings");
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const openStatusDialog = (
    booking: HelicopterBooking,
    status: "confirmed" | "cancelled",
    action: BookingStatusAction
  ) => {
    setPendingAction({
      id: booking._id,
      status,
      action,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      summary: `${booking.helicopterName} · ${booking.startDate} → ${booking.endDate}`,
    });
  };

  const updateStatus = async (id: string, newStatus: string, notifyCustomer = false) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/helicopter-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notifyCustomer }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast({
        title: notifyCustomer ? (newStatus === "confirmed" ? "Charter approved" : "Charter rejected") : "Updated",
        description: notifyCustomer ? "Customer notified by email." : `Marked as ${newStatus}`,
      });
      fetchBookings();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader title="Helicopter requests" description="Approve or reject private air charters." />

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="border border-gold/20 bg-card p-6">
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 ${
                      booking.status === "confirmed"
                        ? "bg-gold/10 text-gold"
                        : booking.status === "cancelled"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {booking.status === "confirmed" ? <CheckCircle size={20} /> : booking.status === "cancelled" ? <XCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-ivory">{booking.customerName}</h3>
                    <p className="text-sm text-stone">
                      {booking.customerEmail} · {booking.customerPhone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div className="border border-gold/15 bg-secondary p-3">
                    <p className="luxury-label">Aircraft</p>
                    <p className="mt-1 text-ivory">{booking.helicopterName}</p>
                  </div>
                  <div className="border border-gold/15 bg-secondary p-3">
                    <Calendar size={14} className="mb-1 text-gold" />
                    <p className="text-ivory">
                      {booking.startDate} → {booking.endDate}
                    </p>
                    <p className="text-xs text-stone">{booking.passengers} passengers</p>
                  </div>
                  <div className="border border-gold/15 bg-secondary p-3">
                    <MapPin size={14} className="mb-1 text-gold" />
                    <p className="luxury-label">Departure</p>
                    <p className="text-ivory">{booking.departureHelipad}</p>
                  </div>
                  <div className="border border-gold/15 bg-secondary p-3">
                    <MapPin size={14} className="mb-1 text-gold" />
                    <p className="luxury-label">Landing</p>
                    <p className="text-ivory">{booking.landingHelipad}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between border-t border-gold/15 pt-6 lg:w-64 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div>
                  <p className="luxury-label">Total</p>
                  <p className="font-display text-4xl text-gold">${booking.totalPrice}</p>
                </div>
                <div className="space-y-2 pt-6">
                  {booking.status === "pending" && (
                    <>
                      <Button onClick={() => openStatusDialog(booking, "confirmed", "approve")} disabled={actionLoading} className="w-full">
                        Approve
                      </Button>
                      <Button
                        onClick={() => openStatusDialog(booking, "cancelled", "reject")}
                        disabled={actionLoading}
                        variant="outline"
                        className="w-full border-gold/20 text-red-400"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {booking.status !== "pending" && (
                    <Button onClick={() => updateStatus(booking._id, "pending")} disabled={actionLoading} variant="ghost" className="w-full">
                      Reset to pending
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="border border-gold/15 p-20 text-center">
            <Search size={48} className="mx-auto mb-4 text-gold/40" />
            <h3 className="font-display text-xl text-ivory">No helicopter requests yet</h3>
          </div>
        )}
      </div>

      {pendingAction && (
        <BookingStatusDialog
          open={!!pendingAction}
          onOpenChange={(open) => !open && !actionLoading && setPendingAction(null)}
          action={pendingAction.action}
          customerName={pendingAction.customerName}
          customerEmail={pendingAction.customerEmail}
          summary={pendingAction.summary}
          loading={actionLoading}
          onConfirm={() => updateStatus(pendingAction.id, pendingAction.status, true)}
        />
      )}
    </div>
  );
}
