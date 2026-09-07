"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import {
  AdminFormShell,
  AdminFormBody,
  AdminFormSection,
  AdminFormGrid,
  AdminFormField,
  AdminFormInput,
  AdminFormTextarea,
  AdminFormActions,
} from "@/components/admin/admin-form";

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
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Manage destinations"
        description="Add, update, or remove trekking regions."
        action={
          !isEditing ? (
            <Button onClick={() => { setCurrentDest({}); setIsEditing(true); }} className="bg-gold hover:bg-gold/90">
              <Plus className="mr-2 h-4 w-4" /> Add destination
            </Button>
          ) : undefined
        }
      />

      {isEditing ? (
        <AdminFormShell
          mode={currentDest._id ? "edit" : "create"}
          title={currentDest._id ? "Edit destination" : "New destination"}
          description="Region details shown on the destinations page."
          icon={MapPin}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave}>
            <AdminFormBody>
              <AdminFormSection title="Region details">
                <AdminFormGrid>
                  <AdminFormField label="Title" required>
                    <AdminFormInput required value={currentDest.title || ""} onChange={(e) => setCurrentDest({ ...currentDest, title: e.target.value })} placeholder="Annapurna Region" />
                  </AdminFormField>
                  <AdminFormField label="Slug" hint="Auto-generated if left blank.">
                    <AdminFormInput value={currentDest.slug || ""} onChange={(e) => setCurrentDest({ ...currentDest, slug: e.target.value })} placeholder="annapurna-region" />
                  </AdminFormField>
                  <AdminFormField label="Image URL" fullWidth>
                    <AdminFormInput value={currentDest.image || ""} onChange={(e) => setCurrentDest({ ...currentDest, image: e.target.value })} placeholder="https://..." />
                  </AdminFormField>
                  <AdminFormField label="Available guides">
                    <AdminFormInput type="number" min="0" value={currentDest.availableGuides || 0} onChange={(e) => setCurrentDest({ ...currentDest, availableGuides: parseInt(e.target.value) || 0 })} />
                  </AdminFormField>
                  <AdminFormField label="Price range per day" hint="e.g. $35–$50">
                    <AdminFormInput value={currentDest.priceRange || ""} onChange={(e) => setCurrentDest({ ...currentDest, priceRange: e.target.value })} />
                  </AdminFormField>
                  <AdminFormField label="Description" required fullWidth>
                    <AdminFormTextarea required rows={4} value={currentDest.description || ""} onChange={(e) => setCurrentDest({ ...currentDest, description: e.target.value })} placeholder="Engaging summary for this region..." />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormActions
                onCancel={() => setIsEditing(false)}
                submitLabel={currentDest._id ? "Update destination" : "Save destination"}
                loading={submitting}
              />
            </AdminFormBody>
          </form>
        </AdminFormShell>
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
                  <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-1 border border-gold/20">
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
