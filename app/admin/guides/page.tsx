"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users, Plus, Pencil, Trash2, X, Save, Loader2, ImagePlus,
  DollarSign, Clock, FileText, Globe, Briefcase, Camera,
  CheckCircle, AlertCircle, Calendar, Search, ChevronLeft, ChevronRight, Eye,
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const ITEMS_PER_PAGE = 6;

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
    s === "available" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : s === "on_trek" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-gray-400 text-lg font-medium">Loading guides...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Manage Guides</h1>
          <p className="text-gray-400 mt-1">Add, edit and manage trekking guide profiles</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
          <Plus className="h-5 w-5" /> New Guide
        </button>
      </div>

      {/* Alerts */}
      {success && <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl"><CheckCircle className="h-4 w-4" />{success}</div>}
      {error && <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl"><AlertCircle className="h-4 w-4" />{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5 text-amber-400" /> : <Plus className="h-5 w-5 text-emerald-400" />}
              {editingId ? "Edit Guide" : "Add New Guide"}
            </h2>
            <button onClick={resetForm} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><FileText className="h-4 w-4 text-gray-500" />Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="e.g. John Doe" />
              </div>
              {/* Profile Image */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><ImagePlus className="h-4 w-4 text-gray-500" />Profile Image URL</label>
                <input value={form.profileImage} onChange={e => setForm({...form, profileImage: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="https://..." />
              </div>
              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><DollarSign className="h-4 w-4 text-gray-500" />Price (USD/day)</label>
                <input type="number" required min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="45" />
              </div>
              {/* Years Experience */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><Clock className="h-4 w-4 text-gray-500" />Years of Experience</label>
                <input type="number" required min="0" value={form.yearsExperience} onChange={e => setForm({...form, yearsExperience: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="15" />
              </div>
              {/* Availability Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><CheckCircle className="h-4 w-4 text-gray-500" />Availability Status</label>
                <select value={form.availabilityStatus} onChange={e => setForm({...form, availabilityStatus: e.target.value as any})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
                  <option value="available">Available</option>
                  <option value="on_trek">On Trek</option>
                  <option value="busy">Busy</option>
                </select>
              </div>
              {/* Conditional Date Fields */}
              {form.availabilityStatus !== "available" && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><Calendar className="h-4 w-4 text-emerald-500" />Unavailable From</label>
                    <input type="date" required value={form.unavailableFrom} onChange={e => setForm({...form, unavailableFrom: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><Calendar className="h-4 w-4 text-emerald-500" />Unavailable To</label>
                    <input type="date" required value={form.unavailableTo} onChange={e => setForm({...form, unavailableTo: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                  </div>
                </div>
              )}
              {/* Languages */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><Globe className="h-4 w-4 text-gray-500" />Languages (comma-separated)</label>
                <input value={form.languages} onChange={e => setForm({...form, languages: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="English, Nepali, Hindi" />
              </div>
              {/* Services */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><Briefcase className="h-4 w-4 text-gray-500" />Services (comma-separated)</label>
                <input value={form.services} onChange={e => setForm({...form, services: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="Trekking, Cultural Tours, Equipment Rental" />
              </div>
              {/* Gallery */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><Camera className="h-4 w-4 text-gray-500" />Gallery URLs (comma-separated)</label>
                <input value={form.gallery} onChange={e => setForm({...form, gallery: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="https://img1.jpg, https://img2.jpg" />
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><FileText className="h-4 w-4 text-gray-500" />Short Description</label>
                <textarea required rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none" placeholder="Brief bio for card view..." />
              </div>
              {/* About */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2"><FileText className="h-4 w-4 text-gray-500" />Detailed About</label>
                <textarea rows={5} value={form.about} onChange={e => setForm({...form, about: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none" placeholder="Full bio for profile page..." />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {submitting ? "Saving..." : editingId ? "Update Guide" : "Create Guide"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600 rounded-xl font-medium transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search guides by name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
        </div>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="on_trek">On Trek</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      {/* Guide List */}
      {(() => {
        let filtered = guides;
        if (searchQuery) filtered = filtered.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filterStatus) filtered = filtered.filter(g => g.availabilityStatus === filterStatus);
        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return (
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
          <Users className="h-5 w-5 text-emerald-400" /> All Guides
          <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
        </h2>

        {filtered.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{searchQuery || filterStatus ? "No guides match your filters" : "No guides yet"}</h3>
            <p className="text-gray-500 mb-6">{searchQuery || filterStatus ? "Try adjusting your search or filters." : "Add your first guide profile to get started."}</p>
            {!searchQuery && !filterStatus && <button onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold">
              <Plus className="h-5 w-5" /> Add First Guide
            </button>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {paginated.map(g => (
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
                            <h3 className="text-lg font-bold text-white mb-1">{g.name}</h3>
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-emerald-500" /> {g.yearsExperience} yrs exp.</span>
                              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-blue-500" /> {g.languages.length} langs</span>
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
                        <p className="text-gray-400 text-sm line-clamp-2">{g.description}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        <button onClick={() => handleEdit(g)}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-all">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button onClick={() => { setShowHistory(showHistory === g._id ? null : g._id); if (showHistory !== g._id) { fetch(`/api/guide-bookings?guideId=${g._id}&limit=10`).then(r=>r.json()).then(d=>setBookingHistory(d.bookings||[])).catch(()=>{}); } }}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all">
                          <Eye className="h-3.5 w-3.5" /> History
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
                      {/* Booking History */}
                      {showHistory === g._id && (
                        <div className="mt-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700/30">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Booking History</p>
                          {bookingHistory.length === 0 ? <p className="text-xs text-gray-500 italic">No bookings for this guide</p> : (
                            <div className="space-y-2">{bookingHistory.map((bk: any) => (
                              <div key={bk._id} className="flex items-center justify-between text-xs p-2 bg-gray-800/50 rounded-lg">
                                <div><span className="text-white font-medium">{bk.customerName}</span><span className="text-gray-500 ml-2">{bk.bookingId}</span></div>
                                <div className="flex items-center gap-2"><span className="text-emerald-400 font-bold">${bk.totalAmount}</span><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${bk.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : bk.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : bk.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>{bk.status}</span></div>
                              </div>
                            ))}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
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
      })()}
    </div>
  );
}
