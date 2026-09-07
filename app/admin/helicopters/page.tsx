"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
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
  AdminFormSelect,
  AdminFormActions,
  AdminTagInput,
} from "@/components/admin/admin-form";

interface Helicopter {
  _id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  pilotName: string;
  pricePerFlight: number;
  capacity: number;
  features: string[];
  soldOutDates: string[];
  departureHelipad: string;
  landingHelipad: string;
}

const emptyForm = {
  name: "",
  type: "Sightseeing",
  image: "",
  description: "",
  pilotName: "",
  pricePerFlight: "",
  capacity: "5",
  features: [] as string[],
  soldOutDates: [] as string[],
  departureHelipad: "",
  landingHelipad: "",
};

export default function AdminHelicoptersPage() {
  const [helicopters, setHelicopters] = useState<Helicopter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  const fetchHelicopters = useCallback(async () => {
    try {
      const res = await fetch("/api/helicopters");
      if (res.ok) setHelicopters(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHelicopters();
  }, [fetchHelicopters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/helicopters/${editingId}` : "/api/helicopters";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerFlight: Number(form.pricePerFlight),
          capacity: Number(form.capacity),
        }),
      });
      if (res.ok) {
        toast({ title: "Success", description: `Helicopter ${editingId ? "updated" : "added"}` });
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchHelicopters();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = (h: Helicopter) => {
    setForm({
      name: h.name,
      type: h.type,
      image: h.image,
      description: h.description,
      pilotName: h.pilotName,
      pricePerFlight: h.pricePerFlight.toString(),
      capacity: String(h.capacity || 5),
      features: h.features || [],
      soldOutDates: h.soldOutDates?.map((d) => new Date(d).toISOString().split("T")[0]) || [],
      departureHelipad: h.departureHelipad || "",
      landingHelipad: h.landingHelipad || "",
    });
    setEditingId(h._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this aircraft?")) return;
    const res = await fetch(`/api/helicopters/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted" });
      fetchHelicopters();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Helicopter fleet"
        description="Charter aircraft, pilots, and helipad options."
        action={
          !showForm ? (
            <Button onClick={() => { setShowForm(true); setEditingId(null); }}>
              <Plus className="mr-2 h-4 w-4" /> Add aircraft
            </Button>
          ) : undefined
        }
      />

      {showForm && (
        <AdminFormShell
          mode={editingId ? "edit" : "create"}
          title={editingId ? "Edit aircraft" : "Add aircraft"}
          description="Helipads are comma-separated options shown on the public booking form."
          onClose={() => { setShowForm(false); setEditingId(null); }}
        >
          <form onSubmit={handleSubmit}>
            <AdminFormBody>
              <AdminFormSection title="Aircraft">
                <AdminFormGrid>
                  <AdminFormField label="Name" required>
                    <AdminFormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Type" required>
                    <AdminFormSelect
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      options={[
                        { value: "Sightseeing", label: "Sightseeing" },
                        { value: "Heli-Trek", label: "Heli-Trek" },
                        { value: "Charter", label: "Charter" },
                        { value: "Rescue", label: "Rescue" },
                      ]}
                    />
                  </AdminFormField>
                  <AdminFormField label="Pilot name" required>
                    <AdminFormInput value={form.pilotName} onChange={(e) => setForm({ ...form, pilotName: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Price per flight day ($)" required>
                    <AdminFormInput type="number" value={form.pricePerFlight} onChange={(e) => setForm({ ...form, pricePerFlight: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Passenger capacity" required>
                    <AdminFormInput type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Image URL" required fullWidth>
                    <AdminFormInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Description" required fullWidth>
                    <AdminFormTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>
              <AdminFormSection title="Helipads">
                <AdminFormGrid>
                  <AdminFormField label="Departure helipads" hint="e.g. Kathmandu TIA, Pokhara">
                    <AdminFormInput value={form.departureHelipad} onChange={(e) => setForm({ ...form, departureHelipad: e.target.value })} />
                  </AdminFormField>
                  <AdminFormField label="Landing helipads" hint="e.g. Everest View, Lukla, Kalapathar">
                    <AdminFormInput value={form.landingHelipad} onChange={(e) => setForm({ ...form, landingHelipad: e.target.value })} />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>
              <AdminFormSection title="Features & availability">
                <AdminFormGrid cols={1}>
                  <AdminTagInput
                    label="Features"
                    placeholder="Oxygen, mountain view..."
                    tags={form.features}
                    inputValue={featureInput}
                    onInputChange={setFeatureInput}
                    onAdd={() => {
                      if (!featureInput.trim()) return;
                      setForm({ ...form, features: [...form.features, featureInput.trim()] });
                      setFeatureInput("");
                    }}
                    onRemove={(idx) => setForm({ ...form, features: form.features.filter((_, i) => i !== idx) })}
                    addLabel="Add"
                  />
                  <AdminTagInput
                    label="Sold-out dates"
                    tags={form.soldOutDates}
                    inputValue={dateInput}
                    onInputChange={setDateInput}
                    onAdd={() => {
                      if (!dateInput || form.soldOutDates.includes(dateInput)) return;
                      setForm({ ...form, soldOutDates: [...form.soldOutDates, dateInput].sort() });
                      setDateInput("");
                    }}
                    onRemove={(idx) => setForm({ ...form, soldOutDates: form.soldOutDates.filter((_, i) => i !== idx) })}
                    addLabel="Block"
                    variant="danger"
                    inputType="date"
                  />
                </AdminFormGrid>
              </AdminFormSection>
              <AdminFormActions
                onCancel={() => { setShowForm(false); setEditingId(null); }}
                submitLabel={editingId ? "Update aircraft" : "Save aircraft"}
              />
            </AdminFormBody>
          </form>
        </AdminFormShell>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {helicopters.map((h) => (
          <div key={h._id} className="overflow-hidden border border-gold/20 bg-card">
            <div className="relative aspect-video">
              <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 bg-gold px-2 py-1 text-xs text-ink">${h.pricePerFlight}/day</div>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl text-ivory">{h.name}</h3>
                  <p className="text-sm text-stone">{h.type} · {h.pilotName}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(h)} className="h-8 w-8 p-0 text-amber-400">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(h._id)} className="h-8 w-8 p-0 text-red-400">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <p className="line-clamp-2 text-sm text-stone">{h.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
