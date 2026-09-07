"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mountain, Plus, Pencil, Trash2, Loader2, Clock,
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
  AdminFormSubPanel,
} from "@/components/admin/admin-form";

interface Guide {
  _id: string;
  name: string;
}

interface Trek {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  trekInfo: { difficulty: string; maxElevation: string; accommodation: string; bestSeason: string };
  gallery: string[];
  guideId: string;
  createdAt: string;
}

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", price: "", duration: "", image: "",
    highlights: "", gallery: "", guideId: "",
    trekInfo: { difficulty: "", maxElevation: "", accommodation: "", bestSeason: "" },
    itinerary: [{ day: 1, title: "", description: "" }]
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTreks = useCallback(async () => {
    try {
      const res = await fetch("/api/treks");
      if (res.ok) setTreks(await res.json());
    } catch (err) { console.error("Failed to fetch treks", err); }
  }, []);

  const fetchGuides = useCallback(async () => {
    try {
      const res = await fetch("/api/guides");
      if (res.ok) setGuides(await res.json());
    } catch (err) { console.error("Failed to fetch guides", err); }
  }, []);

  const fetchData = useCallback(async () => {
    await Promise.all([fetchTreks(), fetchGuides()]);
  }, [fetchTreks, fetchGuides]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await fetchData();
      setLoading(false);
    }
    init();
  }, [fetchData]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const resetForm = () => {
    setForm({
      title: "", description: "", price: "", duration: "", image: "",
      highlights: "", gallery: "", guideId: "",
      trekInfo: { difficulty: "", maxElevation: "", accommodation: "", bestSeason: "" },
      itinerary: [{ day: 1, title: "", description: "" }]
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (trek: Trek) => {
    setForm({
      title: trek.title,
      description: trek.description,
      price: trek.price.toString(),
      duration: trek.duration,
      image: trek.image,
      highlights: trek.highlights?.join(", ") || "",
      gallery: trek.gallery?.join(", ") || "",
      guideId: trek.guideId || "",
      trekInfo: trek.trekInfo || { difficulty: "", maxElevation: "", accommodation: "", bestSeason: "" },
      itinerary: trek.itinerary?.length > 0 ? trek.itinerary : [{ day: 1, title: "", description: "" }]
    });
    setEditingId(trek._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addItineraryDay = () => {
    setForm(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", description: "" }]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setForm(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }))
    }));
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    setForm(prev => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setSuccess("");

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      image: form.image,
      highlights: form.highlights.split(",").map(h => h.trim()).filter(Boolean),
      gallery: form.gallery.split(",").map(g => g.trim()).filter(Boolean),
      guideId: form.guideId || null,
      trekInfo: form.trekInfo,
      itinerary: form.itinerary
    };

    try {
      const url = editingId ? `/api/treks/${editingId}` : "/api/treks";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(editingId ? "Trek updated successfully!" : "Trek created successfully!");
      resetForm();
      await fetchTreks();
    } catch (err: any) { setError(err.message || "Failed to save trek"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      setError("");
      const res = await fetch(`/api/treks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setSuccess("Trek deleted successfully!");
      setDeletingId(null);
      await fetchTreks();
    } catch (err: any) { setError(err.message || "Failed to delete trek"); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
          <p className="text-slate-500 dark:text-gray-400 text-lg font-medium">Loading trek routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <AdminPageHeader
        title="Trek Routes"
        description="Create and manage trekking packages shown on the public site."
        action={
          <Button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-gold hover:bg-gold/90"
          >
            <Plus className="h-5 w-5 mr-2" /> New Trek
          </Button>
        }
      />

      {success && <AdminFormAlert type="success" message={success} />}
      {error && <AdminFormAlert type="error" message={error} />}

      {showForm && (
        <AdminFormShell
          mode={editingId ? "edit" : "create"}
          title={editingId ? "Edit trek route" : "Create trek route"}
          description="Add package details, media, and day-by-day itinerary."
          icon={Mountain}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit}>
            <AdminFormBody>
              <AdminFormSection title="Basic information" description="Core details shown on the trek listing page.">
                <AdminFormGrid>
                  <AdminFormField label="Title" required fullWidth>
                    <AdminFormInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Everest Base Camp Trek" />
                  </AdminFormField>
                  <AdminFormField label="Price (USD)" required>
                    <AdminFormInput type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1299" />
                  </AdminFormField>
                  <AdminFormField label="Duration" required>
                    <AdminFormInput required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="14 days" />
                  </AdminFormField>
                  <AdminFormField label="Cover image URL" hint="Paste a direct link to the main trek photo." fullWidth>
                    <AdminFormInput type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                  </AdminFormField>
                  <AdminFormField label="Description" required fullWidth>
                    <AdminFormTextarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed description for trek seekers..." />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormSection title="Trek details & media" description="Difficulty, season, highlights, and assigned guide.">
                <AdminFormGrid>
                  <AdminFormField label="Difficulty">
                    <AdminFormSelect
                      value={form.trekInfo.difficulty}
                      onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, difficulty: e.target.value } })}
                      placeholder="Select difficulty"
                      options={[
                        { value: "Easy", label: "Easy" },
                        { value: "Moderate", label: "Moderate" },
                        { value: "Challenging", label: "Challenging" },
                        { value: "Difficult", label: "Difficult" },
                      ]}
                    />
                  </AdminFormField>
                  <AdminFormField label="Max elevation">
                    <AdminFormInput value={form.trekInfo.maxElevation} onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, maxElevation: e.target.value } })} placeholder="e.g. 5,364m" />
                  </AdminFormField>
                  <AdminFormField label="Accommodation">
                    <AdminFormInput value={form.trekInfo.accommodation} onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, accommodation: e.target.value } })} placeholder="Tea house / lodge" />
                  </AdminFormField>
                  <AdminFormField label="Best season">
                    <AdminFormInput value={form.trekInfo.bestSeason} onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, bestSeason: e.target.value } })} placeholder="Mar–May, Sept–Nov" />
                  </AdminFormField>
                  <AdminFormField label="Highlights" hint="Separate items with commas." fullWidth>
                    <AdminFormInput value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Everest views, Namche Bazaar..." />
                  </AdminFormField>
                  <AdminFormField label="Gallery URLs" hint="Comma-separated image links." fullWidth>
                    <AdminFormTextarea rows={2} value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} placeholder="https://img1.jpg, https://img2.jpg" />
                  </AdminFormField>
                  <AdminFormField label="Assigned guide" fullWidth>
                    <AdminFormSelect
                      value={form.guideId}
                      onChange={(e) => setForm({ ...form, guideId: e.target.value })}
                      placeholder="No guide assigned"
                      options={guides.map((g) => ({ value: g._id, label: g.name }))}
                    />
                  </AdminFormField>
                </AdminFormGrid>
              </AdminFormSection>

              <AdminFormSection
                title="Itinerary"
                description="Add each day of the trek with a title and summary."
                action={
                  <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                    <Plus className="mr-1 h-4 w-4" /> Add day
                  </Button>
                }
              >
                <div className="space-y-4">
                  {form.itinerary.map((day, index) => (
                    <AdminFormSubPanel key={index} title={`Day ${day.day}`} className="relative group">
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="space-y-3 pr-8">
                        <AdminFormField label="Day title" required>
                          <AdminFormInput value={day.title} onChange={(e) => updateItineraryDay(index, "title", e.target.value)} required placeholder="Flight to Lukla" />
                        </AdminFormField>
                        <AdminFormField label="Description" required>
                          <AdminFormTextarea value={day.description} onChange={(e) => updateItineraryDay(index, "description", e.target.value)} required rows={2} placeholder="What happens on this day..." />
                        </AdminFormField>
                      </div>
                    </AdminFormSubPanel>
                  ))}
                </div>
              </AdminFormSection>

              <AdminFormActions
                onCancel={resetForm}
                submitLabel={editingId ? "Update trek" : "Create trek"}
                loading={submitting}
              />
            </AdminFormBody>
          </form>
        </AdminFormShell>
      )}

      {/* Trek List */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mountain className="h-5 w-5 text-gold" />
            All Trek Routes ({treks.length})
          </h2>
        </div>

        {treks.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center">
            <Mountain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No trek routes yet</h3>
            <p className="text-gray-500 mb-6">Create your first trek route to get started.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-teal-600 text-white rounded-xl font-semibold">
              <Plus className="h-5 w-5" /> Create First Trek
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {treks.map((trek) => (
              <div key={trek._id} className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {trek.image && (
                    <div className="md:w-56 h-40 md:h-auto relative flex-shrink-0">
                      <img src={trek.image} alt={trek.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    </div>
                  )}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{trek.title}</h3>
                        <span className="flex-shrink-0 ml-3 px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-sm font-bold">
                          ${trek.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{trek.duration}</span>
                        <span className="text-gray-600">ΓÇó</span>
                        <span>Added {new Date(trek.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{trek.description}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <button onClick={() => handleEdit(trek)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      {deletingId === trek._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-400">Delete?</span>
                          <button onClick={() => handleDelete(trek._id)} className="px-3 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg">Confirm</button>
                          <button onClick={() => setDeletingId(null)} className="px-3 py-2 text-sm font-medium text-gray-400 border border-gray-700 rounded-lg">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(trek._id)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg">
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
