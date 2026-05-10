"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, MapPin, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Destination {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  availableGuides?: number;
  priceRange?: string;
  trekCount?: number;
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDest, setCurrentDest] = useState<Partial<Destination>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch("/api/destinations");
      if (res.ok) {
        setDestinations(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isNew = !currentDest._id;
      const url = isNew ? "/api/destinations" : `/api/destinations/${currentDest._id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentDest),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save destination");
      }

      toast({ title: `Destination ${isNew ? 'created' : 'updated'} successfully!` });
      setIsEditing(false);
      setCurrentDest({});
      fetchDestinations();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete destination");
      toast({ title: "Destination deleted successfully" });
      fetchDestinations();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-gray-950 min-h-[calc(100vh-4rem)] p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Manage Destinations
          </h1>
          <p className="text-gray-400 mt-1">Add, update, or remove trekking regions</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => {
              setCurrentDest({});
              setIsEditing(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-emerald-500/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Destination
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-400" />
              {currentDest._id ? "Edit Destination" : "New Destination"}
            </h2>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Title *</label>
                <input
                  required
                  value={currentDest.title || ""}
                  onChange={(e) => setCurrentDest({ ...currentDest, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                  placeholder="e.g., Annapurna Region"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Slug (Auto-generated if left blank)</label>
                <input
                  value={currentDest.slug || ""}
                  onChange={(e) => setCurrentDest({ ...currentDest, slug: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                  placeholder="e.g., annapurna-region"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Image URL</label>
              <input
                value={currentDest.image || ""}
                onChange={(e) => setCurrentDest({ ...currentDest, image: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Available Guides</label>
                <input
                  type="number"
                  min="0"
                  value={currentDest.availableGuides || 0}
                  onChange={(e) => setCurrentDest({ ...currentDest, availableGuides: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Price Range Per Day</label>
                <input
                  value={currentDest.priceRange || ""}
                  onChange={(e) => setCurrentDest({ ...currentDest, priceRange: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                  placeholder="e.g., $35-$50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Description *</label>
              <textarea
                required
                rows={4}
                value={currentDest.description || ""}
                onChange={(e) => setCurrentDest({ ...currentDest, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="Write a short, engaging description for this region..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Destination
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div key={dest._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:border-gray-700 transition-all flex flex-col group">
              <div className="h-48 bg-gray-800 relative overflow-hidden">
                {dest.image ? (
                  <img src={dest.image} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-lg font-bold text-white drop-shadow-md">{dest.title}</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded border border-emerald-500/20 backdrop-blur-sm">
                    {dest.trekCount} Treks
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{dest.description}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                  <Button
                    onClick={() => {
                      setCurrentDest(dest);
                      setIsEditing(true);
                    }}
                    variant="outline"
                    className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(dest._id)}
                    variant="outline"
                    className="flex-1 bg-red-500/10 border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {destinations.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 bg-gray-900/50 border border-gray-800 border-dashed rounded-2xl">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium text-gray-400">No destinations added yet</p>
              <p className="text-sm mt-1">Click the "Add Destination" button to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
