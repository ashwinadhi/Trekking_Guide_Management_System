"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users, Plus, Pencil, Trash2, Loader2,
  DollarSign, Clock, CheckCircle, AlertCircle, Calendar,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
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
  AdminFormAlert,
} from "@/components/admin/admin-form";

interface Guide {
  _id: string;
  name: string;
  profileImage: string;
  description: string;
  about: string;
  services: string[];
  yearsExperience: number;
  languages: string[];
  availabilityStatus: "available" | "on_trek" | "busy";
  unavailableFrom: string | null;
  unavailableTo: string | null;
  price: number;
  gallery: string[];
  reviews: { user: string; comment: string; rating: number }[];
  createdAt: string;
}

const EMPTY_FORM = {
  name: "", profileImage: "", description: "", about: "",
  services: "", yearsExperience: "", languages: "",
  availabilityStatus: "available", 
  unavailableFrom: "",
  unavailableTo: "",
  price: "", gallery: "",
};

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    try {
      const res = await fetch("/api/guides");
      if (res.ok) setGuides(await res.json());
    } catch (err) { console.error("Failed to fetch guides", err); }
  }, []);

  useEffect(() => { fetchGuides().finally(() => setLoading(false)); }, [fetchGuides]);

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(false); };

  const csvToArr = (s: string) => s.split(",").map(v => v.trim()).filter(Boolean);

  const handleEdit = (g: Guide) => {
    setForm({
      name: g.name, profileImage: g.profileImage, description: g.description,
      about: g.about, services: g.services.join(", "),
      yearsExperience: g.yearsExperience.toString(), languages: g.languages.join(", "),
      availabilityStatus: g.availabilityStatus,
      unavailableFrom: g.unavailableFrom ? new Date(g.unavailableFrom).toISOString().split('T')[0] : "",
      unavailableTo: g.unavailableTo ? new Date(g.unavailableTo).toISOString().split('T')[0] : "",
      price: g.price.toString(),
      gallery: g.gallery.join(", "),
    });
    setEditingId(g._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (form.availabilityStatus !== "available") {
      if (!form.unavailableFrom || !form.unavailableTo) {
        setError("Please specify both 'From' and 'To' dates for On Trek/Busy status");
        return;
      }
      if (new Date(form.unavailableFrom) > new Date(form.unavailableTo)) {
        setError("'Unavailable From' cannot be after 'Unavailable To'");
        return;
      }
    }

    setSubmitting(true); setError(""); setSuccess("");
    const payload = {
      name: form.name, profileImage: form.profileImage,
      description: form.description, about: form.about,
      services: csvToArr(form.services),
      yearsExperience: Number(form.yearsExperience),
      languages: csvToArr(form.languages),
      availabilityStatus: form.availabilityStatus,
      unavailableFrom: form.availabilityStatus !== "available" ? form.unavailableFrom : null,
      unavailableTo: form.availabilityStatus !== "available" ? form.unavailableTo : null,
      price: Number(form.price),
      gallery: csvToArr(form.gallery),
    };
    try {
      const url = editingId ? `/api/guides/${editingId}` : "/api/guides";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Something went wrong"); }
      setSuccess(editingId ? "Guide updated!" : "Guide created!");
      resetForm(); await fetchGuides();
    } catch (err: any) { setError(err.message); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/guides/${id}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSuccess("Guide deleted!"); setDeletingId(null); await fetchGuides();
    } catch (err: any) { setError(err.message); }
  };

  const toggleAvailability = async (g: Guide) => {
    const next = g.availabilityStatus === "available" ? "on_trek" : g.availabilityStatus === "on_trek" ? "busy" : "available";
    try {
      const res = await fetch(`/api/guides/${g._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilityStatus: next }),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(`Status → ${next.replace("_", " ")}`); await fetchGuides();
    } catch { setError("Failed to update status"); }
  };

  const statusColor = (s: string) =>
    s === "available" ? "bg-gold/10 text-gold border-gold/20"
    : s === "on_trek" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
        <p className="text-gray-400 text-lg font-medium">Loading guides...</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Manage guides"
        description="Add, edit, and manage trekking guide profiles."
        action={
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-gold hover:bg-gold/90">
            <Plus className="mr-2 h-4 w-4" /> New guide
          </Button>
        }
      />

      {success && <AdminFormAlert type="success" message={success} />}
      {error && <AdminFormAlert type="error" message={error} />}

      {showForm && (
        <AdminFormShell
          mode={editingId ? "edit" : "create"}
          title={editingId ? "Edit guide" : "Add guide"}
          description="Profile information shown on the guides page and booking flow."
          icon={Users}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit}>
            <AdminFormBody>
              <AdminFormSection title="Profile">
                <AdminFormGrid>
                  <AdminFormField label="Full name" required>
                    <AdminFormInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ashwin Shrestha" />
                  </AdminFormField>
                  <AdminFormField label="Profile image URL">
                    <AdminFormInput value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="https://..." />
                  </AdminFormField>
                  <AdminFormField label="Price (USD/day)" required>
                    <AdminFormInput type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="45" />
                  </AdminFormField>
                  <AdminFormField label="Years of experience" required>
                    <AdminFormInput type="number" required min="0" value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })} placeholder="15" />
                  </AdminFormField>
                  <AdminFormField label="Availability" required>
                    <AdminFormSelect
                      value={form.availabilityStatus}
                      onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value as typeof form.availabilityStatus })}
                      options={[
                        { value: "available", label: "Available" },
                        { value: "on_trek", label: "On trek" },
                        { value: "busy", label: "Busy" },
                      ]}
                    />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              {form.availabilityStatus !== "available" && (
                <AdminFormSection title="Unavailable period" description="When the guide cannot take new bookings.">
                  <AdminFormGrid>
                    <AdminFormField label="From" required>
                      <AdminFormInput type="date" required value={form.unavailableFrom} onChange={(e) => setForm({ ...form, unavailableFrom: e.target.value })} />
                    </AdminFormField>
                    <AdminFormField label="To" required>
                      <AdminFormInput type="date" required value={form.unavailableTo} onChange={(e) => setForm({ ...form, unavailableTo: e.target.value })} />
                    </AdminFormField>
                  </AdminFormGrid>
                </AdminFormSection>
              )}

              <AdminFormSection title="Skills & media">
                <AdminFormGrid cols={1}>
                  <AdminFormGrid>
                    <AdminFormField label="Languages" hint="Comma-separated.">
                      <AdminFormInput value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="English, Nepali, Hindi" />
                    </AdminFormField>
                    <AdminFormField label="Services" hint="Comma-separated.">
                      <AdminFormInput value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Trekking, Cultural tours" />
                    </AdminFormField>
                  </AdminFormGrid>
                  <AdminFormField label="Gallery URLs" hint="Comma-separated image links." fullWidth>
                    <AdminFormInput value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} placeholder="https://img1.jpg, https://img2.jpg" />
                  </AdminFormField>
                  <AdminFormField label="Short description" required fullWidth>
                    <AdminFormTextarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief bio for cards..." />
                  </AdminFormField>
                  <AdminFormField label="Detailed about" fullWidth>
                    <AdminFormTextarea rows={5} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} placeholder="Full profile bio..." />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormActions
                onCancel={resetForm}
                submitLabel={editingId ? "Update guide" : "Create guide"}
                loading={submitting}
              />
            </AdminFormBody>
          </form>
        </AdminFormShell>
      )}

      {/* Guide List */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
          <Users className="h-5 w-5 text-gold" /> All Guides
          <span className="ml-2 text-sm font-normal text-gray-400">({guides.length})</span>
        </h2>

        {guides.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No guides yet</h3>
            <p className="text-gray-500 mb-6">Add your first guide profile to get started.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-teal-600 text-white rounded-xl font-semibold">
              <Plus className="h-5 w-5" /> Add First Guide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {guides.map(g => (
              <div key={g._id} className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {g.profileImage && (
                    <div className="md:w-44 h-36 md:h-auto flex-shrink-0">
                      <img src={g.profileImage} alt={g.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    </div>
                  )}
                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{g.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{g.yearsExperience} yrs exp</span>
                            <span className="text-gray-600">•</span>
                            <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />${g.price}/day</span>
                          </div>
                        </div>
                        {/* Availability toggle */}
                        <div className="flex flex-col items-end gap-2">
                          <button onClick={() => toggleAvailability(g)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer transition-all hover:scale-105 capitalize ${statusColor(g.availabilityStatus)}`}>
                            {g.availabilityStatus.replace("_", " ")}
                          </button>
                          {g.availabilityStatus !== "available" && g.unavailableFrom && (
                            <span className="text-[10px] text-gray-500 font-medium">
                              {new Date(g.unavailableFrom).toLocaleDateString()} - {new Date(g.unavailableTo!).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Languages as badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                        {g.languages.map((lang, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">{lang}</span>
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{g.description}</p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <button onClick={() => handleEdit(g)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-all">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      {deletingId === g._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-400">Delete?</span>
                          <button onClick={() => handleDelete(g._id)} className="px-3 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg">Confirm</button>
                          <button onClick={() => setDeletingId(null)} className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 rounded-lg">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(g._id)}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
