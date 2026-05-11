"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Car, Loader2, Pencil, Calendar, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  driverName: string;
  pricePerDay: number;
  features: string[];
  soldOutDates: string[];
  pickupLocation: string;
  dropOffLocation: string;
}

export default function AdminFleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", type: "Jeep", image: "", description: "", 
    driverName: "", pricePerDay: "", features: [] as string[],
    soldOutDates: [] as string[],
    pickupLocation: "",
    dropOffLocation: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch("/api/vehicles");
      if (res.ok) setVehicles(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm({ ...form, features: [...form.features, featureInput.trim()] });
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  };

  const addDate = () => {
    if (!dateInput || form.soldOutDates.includes(dateInput)) return;
    setForm({ ...form, soldOutDates: [...form.soldOutDates, dateInput].sort() });
    setDateInput("");
  };

  const removeDate = (idx: number) => {
    setForm({ ...form, soldOutDates: form.soldOutDates.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/vehicles/${editingId}` : "/api/vehicles";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pricePerDay: Number(form.pricePerDay) }),
      });
      if (res.ok) {
        toast({ title: "Success", description: `Vehicle ${editingId ? "updated" : "added"}` });
        setShowForm(false);
        setEditingId(null);
        setForm({ name: "", type: "Jeep", image: "", description: "", driverName: "", pricePerDay: "", features: [], soldOutDates: [], pickupLocation: "", dropOffLocation: "" });
        fetchVehicles();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save vehicle");
      }
    } catch (err: any) { 
      console.error(err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = (v: Vehicle) => {
    setForm({
      name: v.name,
      type: v.type,
      image: v.image,
      description: v.description,
      driverName: v.driverName,
      pricePerDay: v.pricePerDay.toString(),
      features: v.features || [],
      soldOutDates: v.soldOutDates?.map(d => new Date(d).toISOString().split('T')[0]) || [],
      pickupLocation: v.pickupLocation || "",
      dropOffLocation: v.dropOffLocation || "",
    });
    setEditingId(v._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Deleted", description: "Vehicle removed" });
        fetchVehicles();
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 h-10 w-10" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Manage Fleet
          </h1>
          <p className="text-gray-400 mt-1">Vehicle inventory and availability</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="bg-emerald-600 hover:bg-emerald-700">
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? "Cancel" : "Add Vehicle"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Vehicle Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-gray-800 border-gray-700 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Vehicle Type</Label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2">
                  <option value="Jeep">Jeep</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Driver Name</Label>
                <Input value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})} className="bg-gray-800 border-gray-700 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Price Per Day ($)</Label>
                <Input type="number" value={form.pricePerDay} onChange={e => setForm({...form, pricePerDay: e.target.value})} className="bg-gray-800 border-gray-700 text-white" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-white">Image URL</Label>
                <Input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="bg-gray-800 border-gray-700 text-white" required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="bg-gray-800 border-gray-700 text-white" required />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Available Pickup Locations (Comma separated)</Label>
                <Input value={form.pickupLocation} onChange={e => setForm({...form, pickupLocation: e.target.value})} className="bg-gray-800 border-gray-700 text-white" placeholder="e.g. Kathmandu, Pokhara, Airport" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Available Drop-off Locations (Comma separated)</Label>
                <Input value={form.dropOffLocation} onChange={e => setForm({...form, dropOffLocation: e.target.value})} className="bg-gray-800 border-gray-700 text-white" placeholder="e.g. Pokhara, Lakeside, Hotel" />
              </div>

              <div className="space-y-4">
                <Label className="text-white">Features</Label>
                <div className="flex gap-2">
                  <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="AC, 4WD, etc." className="bg-gray-800 border-gray-700 text-white" />
                  <Button type="button" onClick={addFeature} variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <Badge key={i} variant="secondary" className="bg-gray-800 text-emerald-400 gap-1 pr-1">
                      {f} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => removeFeature(i)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white">Sold Out Dates (Blocked)</Label>
                <div className="flex gap-2">
                  <Input type="date" value={dateInput} onChange={e => setDateInput(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
                  <Button type="button" onClick={addDate} variant="secondary">Block</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.soldOutDates.map((d, i) => (
                    <Badge key={i} variant="outline" className="text-red-400 border-red-500/30 gap-1 pr-1">
                      {d} <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => removeDate(i)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-bold">
              <Save className="mr-2 h-5 w-5" /> {editingId ? "Update Vehicle" : "Save Vehicle"}
            </Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v._id} className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img src={v.image} alt={v.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                ${v.pricePerDay}/day
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{v.name}</h3>
                  <p className="text-sm text-gray-500">{v.type} • Driver: {v.driverName}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(v)} className="h-8 w-8 p-0 text-amber-400"><Pencil size={16} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(v._id)} className="h-8 w-8 p-0 text-red-400"><Trash2 size={16} /></Button>
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">{v.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                <div>
                  <p className="font-bold uppercase text-emerald-500">Pickup</p>
                  <p className="truncate">{v.pickupLocation || "Not set"}</p>
                </div>
                <div>
                  <p className="font-bold uppercase text-teal-500">Drop-off</p>
                  <p className="truncate">{v.dropOffLocation || "Not set"}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {v.features?.map((f, i) => (
                  <span key={i} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{f}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
