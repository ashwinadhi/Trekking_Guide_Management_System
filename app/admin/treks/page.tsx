"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Mountain, X, Save, Loader2, Search, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface Trek {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  trekInfo: { difficulty: string; maxElevation: string; accommodation: string; bestSeason: string };
  gallery: string[];
}

const EMPTY_FORM = {
  title: "", description: "", price: "", duration: "", image: "",
  highlights: "", difficulty: "", maxElevation: "", accommodation: "", bestSeason: "",
  gallery: "", itinerary: [{ day: 1, title: "", description: "" }]
};

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      const res = await fetch("/api/treks");
      if (res.ok) {
        setTreks(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trek: Trek) => {
    setForm({
      title: trek.title,
      description: trek.description,
      price: trek.price.toString(),
      duration: trek.duration,
      image: trek.image,
      highlights: trek.highlights.join(", "),
      difficulty: trek.trekInfo?.difficulty || "",
      maxElevation: trek.trekInfo?.maxElevation || "",
      accommodation: trek.trekInfo?.accommodation || "",
      bestSeason: trek.trekInfo?.bestSeason || "",
      gallery: (trek.gallery || []).join(", "),
      itinerary: trek.itinerary?.length ? trek.itinerary : [{ day: 1, title: "", description: "" }]
    });
    setEditingId(trek._id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/treks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTreks(treks.filter(t => t._id !== id));
        setDeletingId(null);
      }
    } catch (err) {
      console.error("Failed to delete trek", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        duration: form.duration,
        image: form.image,
        highlights: form.highlights.split(",").map(s => s.trim()).filter(Boolean),
        gallery: form.gallery.split(",").map(s => s.trim()).filter(Boolean),
        itinerary: form.itinerary.map((it, idx) => ({ ...it, day: idx + 1 })),
        trekInfo: {
          difficulty: form.difficulty,
          maxElevation: form.maxElevation,
          accommodation: form.accommodation,
          bestSeason: form.bestSeason,
        }
      };

      const url = editingId ? `/api/treks/${editingId}` : "/api/treks";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save trek");
      }
      
      await fetchTreks();
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = treks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Mountain className="h-7 w-7 text-emerald-400" /> Manage Treks
          </h1>
          <p className="text-gray-400 text-sm mt-1">Add, update, or remove trekking packages.</p>
        </div>
        {!showForm && (
          <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95">
            <Plus className="h-5 w-5" /> Add New Trek
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5 text-amber-400" /> : <Plus className="h-5 w-5 text-emerald-400" />}
              {editingId ? "Edit Trek Details" : "Create New Trek"}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><X className="h-5 w-5" /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Basic Info</h3>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Trek Title *</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" placeholder="e.g. Everest Base Camp" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-300 block mb-1.5">Price (USD) *</label>
                    <input required type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="1200" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-300 block mb-1.5">Duration *</label>
                    <input required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. 14 Days" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Cover Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="https://..." />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Trek Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1.5">Difficulty</label>
                    <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50">
                      <option value="">Select...</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                      <option value="Extreme">Extreme</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1.5">Max Elevation</label>
                    <input value={form.maxElevation} onChange={e => setForm({...form, maxElevation: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. 5,364 m" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1.5">Best Season</label>
                    <input value={form.bestSeason} onChange={e => setForm({...form, bestSeason: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. Sep - Nov" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1.5">Accommodation</label>
                    <input value={form.accommodation} onChange={e => setForm({...form, accommodation: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. Tea House" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-1.5">Description *</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="Detailed trek description..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Highlights (comma separated)</label>
                  <input value={form.highlights} onChange={e => setForm({...form, highlights: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="Scenic views, Local culture..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Gallery Images (comma separated URLs)</label>
                  <input value={form.gallery} onChange={e => setForm({...form, gallery: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="https://img1.jpg, https://img2.jpg..." />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Day-wise Itinerary</h3>
                <button type="button" onClick={() => setForm({...form, itinerary: [...form.itinerary, { day: form.itinerary.length + 1, title: "", description: "" }]})} className="text-emerald-400 text-xs font-bold hover:text-emerald-300 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Day
                </button>
              </div>
              
              <div className="space-y-4">
                {form.itinerary.map((day, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-3 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-bold text-sm">Day {index + 1}</span>
                      {form.itinerary.length > 1 && (
                        <button type="button" onClick={() => { const newIt = [...form.itinerary]; newIt.splice(index, 1); setForm({...form, itinerary: newIt}); }} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input required value={day.title} onChange={e => { const newIt = [...form.itinerary]; newIt[index].title = e.target.value; setForm({...form, itinerary: newIt}); }} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 text-sm" placeholder="Day Title (e.g. Arrival in Kathmandu)" />
                    </div>
                    <div>
                      <textarea required rows={2} value={day.description} onChange={e => { const newIt = [...form.itinerary]; newIt[index].description = e.target.value; setForm({...form, itinerary: newIt}); }} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500/50 text-sm" placeholder="Activities for the day..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">Cancel</button>
              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold rounded-xl shadow-lg transition-all">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {editingId ? "Update Trek" : "Save Trek"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-900 rounded-2xl border border-gray-800 p-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search treks by title..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
          </div>

          {/* Treks List */}
          {filtered.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
              <Mountain className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No treks found</h3>
              <p className="text-gray-500 mb-6">Create your first trekking package to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {paginated.map(trek => (
                <div key={trek._id} className="group flex flex-col md:flex-row bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all overflow-hidden">
                  <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-800 shrink-0">
                    {trek.image ? (
                      <img src={trek.image} alt={trek.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImagePlus className="h-10 w-10 text-gray-700" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur rounded-lg border border-white/10">
                      <span className="text-sm font-black text-emerald-400">${trek.price}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{trek.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                            <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">{trek.duration}</span>
                            {trek.trekInfo?.difficulty && <span>• {trek.trekInfo.difficulty}</span>}
                            {trek.trekInfo?.maxElevation && <span>• {trek.trekInfo.maxElevation}</span>}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3 line-clamp-2">{trek.description}</p>
                      
                      <div className="mt-3 flex gap-4 text-xs font-medium text-gray-500">
                        <span>• {trek.gallery?.length || 0} Gallery Images</span>
                        <span>• {trek.itinerary?.length || 0} Days Itinerary</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-800/50">
                      <button onClick={() => handleEdit(trek)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-all">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      {deletingId === trek._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-400">Sure?</span>
                          <button onClick={() => handleDelete(trek._id)} className="px-3 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg">Yes</button>
                          <button onClick={() => setDeletingId(null)} className="px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 rounded-lg">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(trek._id)}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:bg-gray-800'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
