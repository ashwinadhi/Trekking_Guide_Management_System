"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Car, Loader2, Pencil, Calendar } from "lucide-react";
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold h-10 w-10" /></div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Manage fleet"
        description="Vehicle inventory, pricing, and availability."
        action={
          !showForm ? (
            <Button onClick={() => { setShowForm(true); setEditingId(null); }} className="bg-gold hover:bg-gold/90">
              <Plus className="mr-2 h-4 w-4" /> Add vehicle
            </Button>
          ) : undefined
        }
      />

      {showForm && (
        <AdminFormShell
          mode={editingId ? "edit" : "create"}
          title={editingId ? "Edit vehicle" : "Add vehicle"}
          description="Configure vehicle details, locations, features, and blocked dates."
          icon={Car}
          onClose={() => { setShowForm(false); setEditingId(null); }}
        >
          <form onSubmit={handleSubmit}>
            <AdminFormBody>
              <AdminFormSection title="Vehicle information">
                <AdminFormGrid>
                  <AdminFormField label="Vehicle name" required>
                    <AdminFormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Vehicle type" required>
                    <AdminFormSelect
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      options={[
                        { value: "Jeep", label: "Jeep" },
                        { value: "Van", label: "Van" },
                        { value: "Bus", label: "Bus" },
                      ]}
                    />
                  </AdminFormField>
                  <AdminFormField label="Driver name" required>
                    <AdminFormInput value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Price per day ($)" required>
                    <AdminFormInput type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Image URL" required fullWidth>
                    <AdminFormInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
                  </AdminFormField>
                  <AdminFormField label="Description" required fullWidth>
                    <AdminFormTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormSection title="Locations" description="Comma-separated pickup and drop-off options.">
                <AdminFormGrid>
                  <AdminFormField label="Pickup locations" hint="e.g. Kathmandu, Pokhara, Airport">
                    <AdminFormInput value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} />
                  </AdminFormField>
                  <AdminFormField label="Drop-off locations" hint="e.g. Pokhara, Lakeside, Hotel">
                    <AdminFormInput value={form.dropOffLocation} onChange={(e) => setForm({ ...form, dropOffLocation: e.target.value })} />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormSection title="Features & availability">
                <AdminFormGrid cols={1}>
                  <AdminTagInput
                    label="Features"
                    placeholder="AC, 4WD, WiFi..."
                    tags={form.features}
                    inputValue={featureInput}
                    onInputChange={setFeatureInput}
                    onAdd={addFeature}
                    onRemove={removeFeature}
                    addLabel="Add"
                  />
                  <AdminTagInput
                    label="Sold-out dates"
                    hint="Dates when this vehicle cannot be booked."
                    tags={form.soldOutDates}
                    inputValue={dateInput}
                    onInputChange={setDateInput}
                    onAdd={addDate}
                    onRemove={removeDate}
                    addLabel="Block"
                    variant="danger"
                    inputType="date"
                  />
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormActions
                onCancel={() => { setShowForm(false); setEditingId(null); }}
                submitLabel={editingId ? "Update vehicle" : "Save vehicle"}
              />
            </AdminFormBody>
          </form>
        </AdminFormShell>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v._id} className="group bg-card border border-gold/20 overflow-hidden hover:border-gold/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img src={v.image} alt={v.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
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
                  <p className="font-bold uppercase text-gold">Pickup</p>
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
