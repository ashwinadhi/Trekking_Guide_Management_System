"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Loader2, Package, Star } from "lucide-react";
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold h-10 w-10" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Equipment management"
        description="Add and manage trekking gear for rental."
        action={
          !isEditing ? (
            <Button onClick={() => { setCurrentForm(initialFormState); setIsEditing(true); }} className="bg-gold hover:bg-gold/90">
              <Plus className="mr-2 h-4 w-4" /> Add gear
            </Button>
          ) : undefined
        }
      />

      {isEditing ? (
        <AdminFormShell
          mode={currentForm._id ? "edit" : "create"}
          title={currentForm._id ? "Edit equipment" : "New equipment"}
          description="Details shown on the equipment rental page."
          icon={Package}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave}>
            <AdminFormBody>
              <AdminFormSection title="Gear details">
                <AdminFormGrid>
                  <AdminFormField label="Title" required>
                    <AdminFormInput required value={currentForm.title || ""} onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })} placeholder="Carbon trekking poles" />
                  </AdminFormField>
                  <AdminFormField label="Category">
                    <AdminFormInput value={currentForm.category || ""} onChange={(e) => setCurrentForm({ ...currentForm, category: e.target.value })} placeholder="Accessories" />
                  </AdminFormField>
                  <AdminFormField label="Price per day ($)" required>
                    <AdminFormInput type="number" required min="0" value={currentForm.price || 0} onChange={(e) => setCurrentForm({ ...currentForm, price: parseFloat(e.target.value) })} />
                  </AdminFormField>
                  <AdminFormField label="Rating (1–5)">
                    <AdminFormInput type="number" step="0.1" min="1" max="5" value={currentForm.rating || 5} onChange={(e) => setCurrentForm({ ...currentForm, rating: parseFloat(e.target.value) })} />
                  </AdminFormField>
                  <AdminFormField label="Image URL" required fullWidth>
                    <AdminFormInput required value={currentForm.image || ""} onChange={(e) => setCurrentForm({ ...currentForm, image: e.target.value })} placeholder="https://..." />
                  </AdminFormField>
                  <AdminFormField label="Description" required fullWidth>
                    <AdminFormTextarea required rows={4} value={currentForm.description || ""} onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })} />
                  </AdminFormField>
                  <AdminFormField label="Features" hint="Comma-separated list." fullWidth>
                    <AdminFormInput
                      value={currentForm.features?.join(", ") || ""}
                      onChange={(e) => setCurrentForm({ ...currentForm, features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean) })}
                      placeholder="Lightweight, Durable, Adjustable"
                    />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormActions
                onCancel={() => setIsEditing(false)}
                submitLabel={currentForm._id ? "Update gear" : "Save gear"}
                loading={submitting}
              />
            </AdminFormBody>
          </form>
        </AdminFormShell>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
                  <td className="px-6 py-4 font-bold text-gold">${item.price}</td>
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
