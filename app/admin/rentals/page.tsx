"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Calendar, User, MapPin, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  BookingStatusDialog,
  type BookingStatusAction,
} from "@/components/admin/booking-status-dialog";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { format } from "date-fns";

interface RentalItem {
  equipmentId: string;
  name: string;
  quantity: number;
  dailyPrice: number;
}

interface RentalRequest {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  deliveryLocation: string;
  items: RentalItem[];
  totalPrice: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
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

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingStatusAction | null>(null);
  const { toast } = useToast();

  const fetchRentals = useCallback(async () => {
    try {
      const res = await fetch("/api/rentals");
      if (res.ok) {
        const data = await res.json();
        setRentals(data);
      }
    } catch (error) {
      console.error("Failed to fetch rentals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const openStatusDialog = (
    rental: RentalRequest,
    status: "confirmed" | "cancelled",
    action: BookingStatusAction
  ) => {
    const itemSummary =
      rental.items.length > 0
        ? rental.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")
        : "Equipment rental";
    setPendingAction({
      id: rental._id,
      status,
      action,
      customerName: rental.customerName,
      customerEmail: rental.customerEmail,
      summary: `${itemSummary} · ${rental.startDate} → ${rental.endDate}`,
    });
  };

  const updateStatus = async (id: string, newStatus: string, notifyCustomer = false) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/rentals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notifyCustomer }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      if (notifyCustomer) {
        toast({
          title: newStatus === "confirmed" ? "Rental approved" : "Rental rejected",
          description: "Status updated and customer notified by email.",
        });
      } else {
        toast({ title: "Status updated", description: `Rental marked as ${newStatus}` });
      }
      fetchRentals();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  const handleConfirmStatusChange = () => {
    if (!pendingAction) return;
    updateStatus(pendingAction.id, pendingAction.status, true);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold h-10 w-10" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Equipment Rentals"
        description="Review and approve gear rental requests from customers."
      />

      <div className="grid grid-cols-1 gap-6">
        {rentals.map((rental) => (
          <div key={rental._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Customer Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    rental.status === 'confirmed' ? 'bg-gold/10 text-gold' :
                    rental.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {rental.status === 'confirmed' ? <CheckCircle size={20} /> :
                     rental.status === 'cancelled' ? <XCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{rental.customerName}</h3>
                    <p className="text-sm text-gray-400">{rental.customerEmail} • {rental.customerPhone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gold" />
                    <span>{rental.startDate} to {rental.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gold" />
                    <span>{rental.deliveryLocation}</span>
                  </div>
                </div>

                {rental.specialRequests && (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest mb-1">Special Requests</p>
                    <p className="text-sm text-gray-300 italic">"{rental.specialRequests}"</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rented Gear</p>
                  <div className="space-y-2">
                    {rental.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <Package size={16} className="text-gold" />
                          <span className="text-white font-medium">{item.name}</span>
                        </div>
                        <span className="text-gray-400">Qty: {item.quantity} • ${item.dailyPrice}/day</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Price */}
              <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Rental Price</p>
                  <p className="text-4xl font-extrabold text-gold">${rental.totalPrice}</p>
                  <p className="text-xs text-gray-400 mt-1">Order Date: {new Date(rental.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="space-y-2 pt-6">
                  {rental.status === 'pending' && (
                    <>
                      <Button onClick={() => openStatusDialog(rental, "confirmed", "approve")} disabled={actionLoading} className="w-full bg-gold hover:bg-gold/90 text-white">Approve</Button>
                      <Button onClick={() => openStatusDialog(rental, "cancelled", "reject")} disabled={actionLoading} variant="outline" className="w-full border-gray-700 text-red-400 hover:bg-red-500/10 hover:text-red-300">Reject</Button>
                    </>
                  )}
                  {rental.status !== 'pending' && (
                    <Button onClick={() => updateStatus(rental._id, "pending")} disabled={actionLoading} variant="ghost" className="w-full text-gray-400 hover:text-white">Revert to Pending</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {rentals.length === 0 && (
          <div className="p-20 text-center bg-gray-900 border border-gray-800 rounded-3xl">
            <Clock size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-300">No rental requests yet</h3>
            <p className="text-gray-500">When users rent gear, their requests will appear here.</p>
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
          onConfirm={handleConfirmStatusChange}
        />
      )}
    </div>
  );
}
