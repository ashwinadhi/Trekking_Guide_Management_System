"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Calendar, User, MapPin, Car, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VehicleBooking {
  _id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropOffLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function AdminVehicleBookingsPage() {
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/vehicle-bookings");
      if (res.ok) setBookings(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // For now, I'll assume we have a PUT [id] route or just update the main route
      // Let's quickly create the individual route logic in a separate step or handle it here
      const res = await fetch(`/api/vehicle-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast({ title: "Updated", description: `Booking marked as ${newStatus}` });
        fetchBookings();
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 h-10 w-10" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Vehicle Requests
        </h1>
        <p className="text-gray-400 mt-1">Review and manage car rental logistics</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all shadow-xl">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {booking.status === 'confirmed' ? <CheckCircle size={20} /> :
                     booking.status === 'cancelled' ? <XCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{booking.customerName}</h3>
                    <p className="text-sm text-gray-500">{booking.customerEmail} • {booking.customerPhone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                    <Car size={16} className="text-emerald-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Vehicle</p>
                      <p className="font-semibold">{booking.vehicleName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                    <Calendar size={16} className="text-emerald-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Rental Dates</p>
                      <p className="font-semibold">{booking.startDate} to {booking.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                    <MapPin size={16} className="text-blue-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Pickup</p>
                      <p className="font-semibold">{booking.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                    <MapPin size={16} className="text-red-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Drop-off</p>
                      <p className="font-semibold">{booking.dropOffLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Price</p>
                  <p className="text-4xl font-extrabold text-emerald-400">${booking.totalPrice}</p>
                  <p className="text-xs text-gray-500 mt-1">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="space-y-2 pt-6">
                  {booking.status === 'pending' && (
                    <>
                      <Button onClick={() => updateStatus(booking._id, 'confirmed')} className="w-full bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                      <Button onClick={() => updateStatus(booking._id, 'cancelled')} variant="outline" className="w-full border-gray-700 text-red-400 hover:bg-red-500/10">Reject</Button>
                    </>
                  )}
                  {booking.status !== 'pending' && (
                    <Button onClick={() => updateStatus(booking._id, 'pending')} variant="ghost" className="w-full text-gray-500 hover:text-white">Reset to Pending</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="p-20 text-center bg-gray-900 border border-gray-800 rounded-3xl">
            <Search size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No vehicle requests yet</h3>
          </div>
        )}
      </div>
    </div>
  );
}
