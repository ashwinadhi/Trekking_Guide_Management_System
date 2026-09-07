"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, MapPin, Loader2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import {
  AdminFormShell,
  AdminFormBody,
  AdminFormSection,
  AdminFormGrid,
  AdminFormField,
  AdminFormInput,
  AdminFormTextarea,
  AdminFormSelect,
  AdminFormActions,
  AdminFormSubPanel,
} from "@/components/admin/admin-form";

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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold h-10 w-10" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Manage hotels"
        description="Add, update, or remove accommodations."
        action={
          !isEditing ? (
            <Button onClick={() => { setCurrentHotel(initialHotelState); setIsEditing(true); }} className="bg-gold hover:bg-gold/90">
              <Plus className="mr-2 h-4 w-4" /> Add hotel
            </Button>
          ) : undefined
        }
      />

      {isEditing ? (
        <AdminFormShell
          mode={currentHotel._id ? "edit" : "create"}
          title={currentHotel._id ? "Edit hotel" : "New hotel"}
          description="Hotel details, amenities, and room configuration."
          icon={Building}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave}>
            <AdminFormBody>
              <AdminFormSection title="Hotel information">
                <AdminFormGrid>
                  <AdminFormField label="Hotel name" required>
                    <AdminFormInput required value={currentHotel.name || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, name: e.target.value })} />
                  </AdminFormField>
                  <AdminFormField label="Destination" required>
                    <AdminFormSelect
                      required
                      value={typeof currentHotel.destinationId === "object" ? currentHotel.destinationId._id : currentHotel.destinationId || ""}
                      onChange={(e) => setCurrentHotel({ ...currentHotel, destinationId: e.target.value })}
                      placeholder="Select a destination"
                      options={destinations.map((d) => ({ value: d._id, label: d.title }))}
                    />
                  </AdminFormField>
                  <AdminFormField label="Description" required fullWidth>
                    <AdminFormTextarea required rows={3} value={currentHotel.description || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, description: e.target.value })} />
                  </AdminFormField>
                  <AdminFormField label="Hotel images" hint="Comma-separated URLs." fullWidth>
                    <AdminFormInput value={currentHotel.images?.join(", ") || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  </AdminFormField>
                  <AdminFormField label="Global amenities" hint="Comma-separated." fullWidth>
                    <AdminFormInput value={currentHotel.amenities?.join(", ") || ""} onChange={(e) => setCurrentHotel({ ...currentHotel, amenities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormSection title="Room types" description="Configure Standard and Deluxe rooms.">
                <AdminFormGrid cols={1}>
              {["Standard", "Deluxe"].map((type) => {
                const room = currentHotel.rooms?.find(r => r.type === type) || { type: type as Room["type"], price: 0, totalRooms: 1, features: [], amenities: [], roomImages: [], soldOutDates: [] };
                return (
                  <AdminFormSubPanel key={type} title={`${type} room`}>
                    <AdminFormGrid>
                      <AdminFormField label="Price per night ($)">
                        <AdminFormInput type="number" required min="0" value={room.price} onChange={(e) => updateRoom(type as Room["type"], "price", parseFloat(e.target.value))} />
                      </AdminFormField>
                      <AdminFormField label="Total rooms">
                        <AdminFormInput type="number" required min="1" value={room.totalRooms} onChange={(e) => updateRoom(type as Room["type"], "totalRooms", parseInt(e.target.value))} />
                      </AdminFormField>
                      <AdminFormField label="Room images" hint="Comma-separated URLs." fullWidth>
                        <AdminFormInput value={room.roomImages.join(", ")} onChange={(e) => updateRoom(type as Room["type"], "roomImages", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="https://..." />
                      </AdminFormField>
                      <AdminFormField label="Features" hint="Comma-separated." fullWidth>
                        <AdminFormInput value={room.features.join(", ")} onChange={(e) => updateRoom(type as Room["type"], "features", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="King bed, AC, Mountain view" />
                      </AdminFormField>
                      <AdminFormField label="Room amenities" hint="Comma-separated." fullWidth>
                        <AdminFormInput value={room.amenities.join(", ")} onChange={(e) => updateRoom(type as Room["type"], "amenities", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="Free WiFi, Breakfast" />
                      </AdminFormField>
                      <AdminFormField label="Block sold-out dates" fullWidth>
                        <div className="flex justify-center rounded-xl border border-slate-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950/50">
                          <Calendar
                            mode="multiple"
                            selected={room.soldOutDates.map(d => new Date(d))}
                            onSelect={(dates) => {
                              const formattedDates = dates?.map(d => format(d, 'yyyy-MM-dd')) || [];
                              updateRoom(type as Room["type"], "soldOutDates", formattedDates);
                            }}
                            className="rounded-md"
                            classNames={{
                              day_selected: "bg-red-500 text-white hover:bg-red-600 hover:text-white",
                            }}
                          />
                        </div>
                        {room.soldOutDates.length > 0 && (
                          <p className="mt-2 text-xs text-red-500 dark:text-red-400">{room.soldOutDates.length} date(s) blocked.</p>
                        )}
                      </AdminFormField>
                    </AdminFormGrid>
                  </AdminFormSubPanel>
                );
              })}
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormActions
                onCancel={() => setIsEditing(false)}
                submitLabel={currentHotel._id ? "Update hotel" : "Save hotel"}
                loading={submitting}
              />
            </AdminFormBody>
          </form>
        </AdminFormShell>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:border-gray-700 transition-all flex flex-col">
              <div className="h-48 bg-gray-800 relative">
                {hotel.images?.[0] ? <img src={hotel.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">No Image</div>}
                <div className="absolute top-4 left-4 bg-gold/90 text-ink text-xs font-bold px-2 py-1">
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
