"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, MapPin, Loader2, Save, X, Building, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Destination {
  _id: string;
  title: string;
}

interface Room {
  type: "Standard" | "Deluxe";
  price: number;
  features: string[];
  amenities: string[];
  roomImages: string[];
  totalRooms: number;
  soldOutDates: string[]; // Keep string format YYYY-MM-DD
}

interface Hotel {
  _id: string;
  name: string;
  description: string;
  images: string[];
  amenities: string[];
  destinationId: Destination | string;
  rooms: Room[];
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialHotelState: Partial<Hotel> = {
    images: [],
    amenities: [],
    rooms: [
      { type: "Standard", price: 0, features: [], amenities: [], roomImages: [], totalRooms: 1, soldOutDates: [] },
      { type: "Deluxe", price: 0, features: [], amenities: [], roomImages: [], totalRooms: 1, soldOutDates: [] }
    ],
  };
  const [currentHotel, setCurrentHotel] = useState<Partial<Hotel>>(initialHotelState);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchHotels = useCallback(async () => {
    try {
      const res = await fetch("/api/hotels");
      if (res.ok) setHotels(await res.json());
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch("/api/destinations");
      if (res.ok) setDestinations(await res.json());
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchHotels(), fetchDestinations()]).finally(() => setLoading(false));
  }, [fetchHotels, fetchDestinations]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isNew = !currentHotel._id;
      const url = isNew ? "/api/hotels" : `/api/hotels/${currentHotel._id}`;
      const method = isNew ? "POST" : "PUT";

      const payload = {
        ...currentHotel,
        destinationId: typeof currentHotel.destinationId === 'object' ? (currentHotel.destinationId as any)._id : currentHotel.destinationId
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      toast({ title: `Hotel ${isNew ? 'created' : 'updated'} successfully!` });
      setIsEditing(false);
      setCurrentHotel(initialHotelState);
      fetchHotels();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hotel?")) return;
    try {
      const res = await fetch(`/api/hotels/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Hotel deleted" });
      fetchHotels();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updateRoom = (type: "Standard" | "Deluxe", field: keyof Room, value: any) => {
    setCurrentHotel((prev) => {
      const rooms = [...(prev.rooms || [])];
      const index = rooms.findIndex((r) => r.type === type);
      if (index !== -1) {
        rooms[index] = { ...rooms[index], [field]: value };
      }
      return { ...prev, rooms };
    });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 h-10 w-10" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-gray-950 min-h-[calc(100vh-4rem)] p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Manage Hotels
          </h1>
          <p className="text-gray-400 mt-1">Add, update, or remove accommodations</p>
        </div>
        {!isEditing && (
          <Button onClick={() => { setCurrentHotel(initialHotelState); setIsEditing(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-emerald-500/20">
            <Plus className="mr-2 h-4 w-4" /> Add Hotel
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl text-gray-300">
          <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-emerald-400" />
              {currentHotel._id ? "Edit Hotel" : "New Hotel"}
            </h2>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Hotel Level Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hotel Name *</label>
                <input required value={currentHotel.name || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination *</label>
                <select required value={typeof currentHotel.destinationId === 'object' ? currentHotel.destinationId._id : currentHotel.destinationId || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, destinationId: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                  <option value="">Select a Destination</option>
                  {destinations.map(d => <option key={d._id} value={d._id}>{d.title}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea required rows={3} value={currentHotel.description || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hotel Images (comma separated)</label>
                <input value={currentHotel.images?.join(", ") || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, images: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Global Amenities (comma separated)</label>
                <input value={currentHotel.amenities?.join(", ") || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, amenities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" />
              </div>
            </div>

            {/* Room Level Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-gray-800 pt-6">
              {["Standard", "Deluxe"].map((type) => {
                const room = currentHotel.rooms?.find(r => r.type === type) || { type: type as any, price: 0, totalRooms: 1, features: [], amenities: [], roomImages: [], soldOutDates: [] };
                return (
                  <div key={type} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 space-y-4">
                    <h3 className="font-bold text-emerald-400 text-xl border-b border-gray-700 pb-2">{type} Room</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Price/Night ($)</label>
                        <input type="number" required min="0" value={room.price} onChange={(e) => updateRoom(type as any, "price", parseFloat(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Total Rooms</label>
                        <input type="number" required min="1" value={room.totalRooms} onChange={(e) => updateRoom(type as any, "totalRooms", parseInt(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Room Images (comma separated URLs)</label>
                      <input value={room.roomImages.join(", ")} onChange={(e) => updateRoom(type as any, "roomImages", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1" placeholder="https://..." />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Features (comma separated)</label>
                      <input value={room.features.join(", ")} onChange={(e) => updateRoom(type as any, "features", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1" placeholder="King Bed, AC, Mountain View" />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Room Amenities (comma separated)</label>
                      <input value={room.amenities.join(", ")} onChange={(e) => updateRoom(type as any, "amenities", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white mt-1" placeholder="Free WiFi, Breakfast Included" />
                    </div>

                    <div className="pt-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Block Sold Out Dates</label>
                      <div className="bg-gray-900 rounded-xl border border-gray-700 p-2 flex justify-center">
                        <Calendar
                          mode="multiple"
                          selected={room.soldOutDates.map(d => new Date(d))}
                          onSelect={(dates) => {
                            const formattedDates = dates?.map(d => format(d, 'yyyy-MM-dd')) || [];
                            updateRoom(type as any, "soldOutDates", formattedDates);
                          }}
                          className="rounded-md"
                          classNames={{
                            day_selected: "bg-red-500 text-white hover:bg-red-600 hover:text-white",
                            day_today: "bg-gray-800 text-white",
                          }}
                        />
                      </div>
                      {room.soldOutDates.length > 0 && (
                        <p className="text-xs text-red-400 mt-2">{room.soldOutDates.length} date(s) blocked.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Hotel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:border-gray-700 transition-all flex flex-col">
              <div className="h-48 bg-gray-800 relative">
                {hotel.images?.[0] ? <img src={hotel.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">No Image</div>}
                <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                  {typeof hotel.destinationId === 'object' ? (hotel.destinationId as any).title : 'Destination'}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">{hotel.name}</h3>
                <div className="flex gap-4 mb-4 text-sm text-gray-400">
                  <span>Standard: ${hotel.rooms?.find(r=>r.type==='Standard')?.price || 0}</span>
                  <span>Deluxe: ${hotel.rooms?.find(r=>r.type==='Deluxe')?.price || 0}</span>
                </div>
                <div className="flex items-center gap-2 pt-4 mt-auto border-t border-gray-800">
                  <Button onClick={() => { setCurrentHotel(hotel); setIsEditing(true); }} variant="outline" className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(hotel._id)} variant="outline" className="flex-1 bg-red-500/10 border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {hotels.length === 0 && <div className="col-span-full py-20 text-center text-gray-500">No hotels found.</div>}
        </div>
      )}
    </div>
  );
}
