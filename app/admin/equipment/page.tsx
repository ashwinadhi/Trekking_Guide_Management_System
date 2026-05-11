"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Loader2, Save, X, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EquipmentItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  features: string[];
  slug: string;
}

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const initialFormState: Partial<EquipmentItem> = {
    title: "",
    description: "",
    price: 0,
    image: "",
    category: "General",
    rating: 5,
    features: [],
  };

  const [currentForm, setCurrentForm] = useState<Partial<EquipmentItem>>(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const fetchEquipment = useCallback(async () => {
    try {
      const res = await fetch("/api/equipment");
      if (res.ok) {
        const data = await res.json();
        setEquipment(data);
      }
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isNew = !currentForm._id;
      const url = isNew ? "/api/equipment" : `/api/equipment/${currentForm._id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast({ title: `Equipment ${isNew ? 'added' : 'updated'} successfully!` });
      setIsEditing(false);
      setCurrentForm(initialFormState);
      fetchEquipment();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;
    try {
      const res = await fetch(`/api/equipment/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Equipment deleted" });
      fetchEquipment();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openEdit = (item: EquipmentItem) => {
    setCurrentForm(item);
    setIsEditing(true);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 h-10 w-10" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8 bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Equipment Management
          </h1>
          <p className="text-gray-400 mt-1">Add and manage trekking gear for rental</p>
        </div>
        {!isEditing && (
          <Button onClick={() => { setCurrentForm(initialFormState); setIsEditing(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New Gear
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-400" />
              {currentForm._id ? "Edit Equipment" : "New Equipment"}
            </h2>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Title *</label>
                <input required value={currentForm.title || ""} onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Carbon Trekking Poles" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Category</label>
                <input value={currentForm.category || ""} onChange={(e) => setCurrentForm({ ...currentForm, category: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Accessories" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Price per Day ($) *</label>
                  <input type="number" required min="0" value={currentForm.price || 0} onChange={(e) => setCurrentForm({ ...currentForm, price: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Rating (1-5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={currentForm.rating || 5} onChange={(e) => setCurrentForm({ ...currentForm, rating: parseFloat(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Image URL *</label>
                <input required value={currentForm.image || ""} onChange={(e) => setCurrentForm({ ...currentForm, image: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Description *</label>
                <textarea required rows={4} value={currentForm.description || ""} onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Short summary of the gear..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Features (comma separated)</label>
                <input value={currentForm.features?.join(", ") || ""} onChange={(e) => setCurrentForm({ ...currentForm, features: e.target.value.split(",").map(f => f.trim()).filter(Boolean) })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Lightweight, Durable, Adjustable" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-gray-700 text-gray-400 hover:text-white">Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save</>}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Gear</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price/Day</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {equipment.map((item) => (
                <tr key={item._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover bg-gray-800" />
                      <span className="font-medium text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.category}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">${item.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-white transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {equipment.length === 0 && (
            <div className="p-12 text-center text-gray-500">No equipment found. Add some to get started!</div>
          )}
        </div>
      )}
    </div>
  );
}
