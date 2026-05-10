"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mountain, Plus, Pencil, Trash2, X, Save, Loader2, ImagePlus,
  DollarSign, Clock, FileText, BarChart3, Package, Calendar, TrendingUp, Users, List, MapPin, Camera
} from "lucide-react";

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ services: 0, bookings: 0, treks: 0 });
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

  const fetchStats = useCallback(async () => {
    try {
      const [servicesRes, bookingsRes, treksRes, hotelBookingsRes] = await Promise.all([
        fetch("/api/services"), fetch("/api/bookings"), fetch("/api/treks"), fetch("/api/hotel-bookings")
      ]);
      const services = servicesRes.ok ? await servicesRes.json() : [];
      const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
      const hotelBookings = hotelBookingsRes.ok ? await hotelBookingsRes.json() : [];
      const treksData = treksRes.ok ? await treksRes.json() : [];
      
      const totalBookings = (Array.isArray(bookings) ? bookings.length : 0) + (Array.isArray(hotelBookings) ? hotelBookings.length : 0);
      
      setStats({
        services: Array.isArray(services) ? services.length : 0,
        bookings: totalBookings,
        treks: Array.isArray(treksData) ? treksData.length : 0,
      });
    } catch (err) { console.error("Failed to fetch stats", err); }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchStats(), fetchTreks(), fetchGuides()]);
      setLoading(false);
    }
    init();
  }, [fetchStats, fetchTreks, fetchGuides]);

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
      await Promise.all([fetchTreks(), fetchStats()]);
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
      await Promise.all([fetchTreks(), fetchStats()]);
    } catch (err: any) { setError(err.message || "Failed to delete trek"); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-gray-400 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage your trekking routes and monitor activity</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
        >
          <Plus className="h-5 w-5" /> New Trek
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl animate-in slide-in-from-top-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-red-400" />{error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl"><Mountain className="h-6 w-6 text-emerald-400" /></div>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-4xl font-bold text-white mb-1">{stats.treks}</p>
            <p className="text-sm text-gray-400 font-medium">Trek Routes</p>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl"><Package className="h-6 w-6 text-blue-400" /></div>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-4xl font-bold text-white mb-1">{stats.services}</p>
            <p className="text-sm text-gray-400 font-medium">Total Services</p>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-purple-500/10 rounded-xl"><Calendar className="h-6 w-6 text-purple-400" /></div>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-4xl font-bold text-white mb-1">{stats.bookings}</p>
            <p className="text-sm text-gray-400 font-medium">Total Bookings</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5 text-amber-400" /> : <Plus className="h-5 w-5 text-emerald-400" />}
              {editingId ? "Edit Trek Route" : "Create New Trek Route"}
            </h2>
            <button onClick={resetForm} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400 border-b border-gray-700/50 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Title</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="Everest Base Camp Trek" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Price (USD)</label>
                  <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="1299" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Duration</label>
                  <input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="14 days" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 resize-none" placeholder="Detailed description..." />
                </div>
              </div>
            </div>

            {/* Trek Info & Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400 border-b border-gray-700/50 pb-2">Trek Details & Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Difficulty</label>
                  <select value={form.trekInfo.difficulty} onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, difficulty: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50">
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Difficult">Difficult</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Max Elevation</label>
                  <input value={form.trekInfo.maxElevation} onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, maxElevation: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. 5,364m" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Accommodation</label>
                  <input value={form.trekInfo.accommodation} onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, accommodation: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. Tea House / Lodge" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Best Season</label>
                  <input value={form.trekInfo.bestSeason} onChange={(e) => setForm({ ...form, trekInfo: { ...form.trekInfo, bestSeason: e.target.value } })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. Mar-May, Sept-Nov" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Highlights (comma separated)</label>
                  <input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="Stand at Mt. Everest, Explore Namche..." />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Gallery Image URLs (comma separated)</label>
                  <textarea rows={2} value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 resize-none" placeholder="https://img1.jpg, https://img2.jpg..." />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Assigned Guide</label>
                  <select value={form.guideId} onChange={(e) => setForm({ ...form, guideId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50">
                    <option value="">No Guide Assigned</option>
                    {guides.map(guide => (
                      <option key={guide._id} value={guide._id}>{guide.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Itinerary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-700/50 pb-2">
                <h3 className="text-lg font-semibold text-emerald-400">Dynamic Itinerary</h3>
                <button type="button" onClick={addItineraryDay} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="h-4 w-4" /> Add Day
                </button>
              </div>
              <div className="space-y-4">
                {form.itinerary.map((day, index) => (
                  <div key={index} className="p-4 bg-gray-900/40 border border-gray-700/50 rounded-xl relative group">
                    <button type="button" onClick={() => removeItineraryDay(index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex flex-col gap-3 pr-8">
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20">Day {day.day}</span>
                        <input value={day.title} onChange={(e) => updateItineraryDay(index, "title", e.target.value)} required
                          className="flex-1 px-3 py-1.5 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50" placeholder="Day Title (e.g. Flight to Lukla)" />
                      </div>
                      <textarea value={day.description} onChange={(e) => updateItineraryDay(index, "description", e.target.value)} required rows={2}
                        className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/50 resize-none text-sm" placeholder="Day's description..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-700/50">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {submitting ? "Saving..." : editingId ? "Update Trek" : "Create Trek"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600 rounded-xl font-medium transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trek List */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mountain className="h-5 w-5 text-emerald-400" />
            All Trek Routes ({treks.length})
          </h2>
        </div>

        {treks.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center">
            <Mountain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No trek routes yet</h3>
            <p className="text-gray-500 mb-6">Create your first trek route to get started.</p>
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold">
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
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{trek.title}</h3>
                        <span className="flex-shrink-0 ml-3 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-bold">
                          ${trek.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{trek.duration}</span>
                        <span className="text-gray-600">•</span>
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
