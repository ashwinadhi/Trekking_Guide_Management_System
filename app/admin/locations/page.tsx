"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Location {
  _id: string;
  name: string;
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch("/api/locations");
      if (res.ok) setLocations(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Location added" });
        setNewName("");
        fetchLocations();
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Deleted", description: "Location removed" });
        fetchLocations();
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 h-10 w-10" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Manage Locations
        </h1>
        <p className="text-gray-400 mt-1">Official Pickup & Drop-off points</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
        <form onSubmit={handleAdd} className="flex gap-4">
          <Input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            placeholder="Enter location name (e.g. Kathmandu)" 
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
          <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
            {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Location
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div key={loc._id} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3">
              <MapPin className="text-emerald-400 h-5 w-5" />
              <span className="text-white font-medium">{loc.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(loc._id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
