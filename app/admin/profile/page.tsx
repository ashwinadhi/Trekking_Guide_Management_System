"use client";
import { useEffect, useState } from "react";
import { UserCircle, Save, Loader2, Lock, CheckCircle, AlertCircle, Mail, Phone, Shield, Camera } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", profileImage: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile").then(r => r.ok ? r.json() : null).then(d => {
      if (d) { setProfile(d); setForm({ name: d.name || "", phone: d.phone || "", profileImage: d.profileImage || "" }); }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (success || error) { const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000); return () => clearTimeout(t); } }, [success, error]);

  const handleSaveProfile = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const updated = await res.json();
      setProfile(updated); setEditMode(false); setSuccess("Profile updated successfully!");
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { setError("Passwords do not match"); return; }
    if (pwForm.newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setPwSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/change-password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pwForm) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSuccess("Password changed successfully!"); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setShowPwForm(false);
    } catch (err: any) { setError(err.message); } finally { setPwSaving(false); }
  };

  if (loading) return (<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Admin Profile</h1><p className="text-gray-400 mt-1">Manage your account settings</p></div>

      {success && <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl"><CheckCircle className="h-4 w-4" />{success}</div>}
      {error && <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl"><AlertCircle className="h-4 w-4" />{error}</div>}

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 p-8 flex items-center gap-6">
          <div className="relative">
            <img src={profile?.profileImage || `https://ui-avatars.com/api/?name=${profile?.name || "Admin"}&size=96&background=10b981&color=fff`} alt="" className="w-24 h-24 rounded-full border-4 border-emerald-500/30 object-cover" />
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-2 border-gray-900"><Shield className="h-3 w-3 text-white" /></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile?.name || "Admin"}</h2>
            <p className="text-emerald-300/70 text-sm font-medium">Administrator</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-400"><Mail className="h-3 w-3" />{profile?.email}</span>
              {profile?.phone && <span className="flex items-center gap-1.5 text-xs text-gray-400"><Phone className="h-3 w-3" />{profile.phone}</span>}
            </div>
          </div>
        </div>

        <div className="p-6">
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-gray-300 mb-2 block">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
                <div><label className="text-sm font-semibold text-gray-300 mb-2 block">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" placeholder="+977 9800000000" /></div>
              </div>
              <div><label className="text-sm font-semibold text-gray-300 mb-2 block">Profile Image URL</label><input value={form.profileImage} onChange={e => setForm({...form, profileImage: e.target.value})} className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" placeholder="https://..." /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving..." : "Save Changes"}</button>
                <button onClick={() => setEditMode(false)} className="px-6 py-2.5 text-gray-400 hover:text-white border border-gray-700/50 rounded-xl font-medium">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-xl"><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Full Name</p><p className="text-white font-semibold">{profile?.name || "—"}</p></div>
                <div className="p-4 bg-gray-800/50 rounded-xl"><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Email</p><p className="text-white font-semibold">{profile?.email}</p></div>
                <div className="p-4 bg-gray-800/50 rounded-xl"><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Phone</p><p className="text-white font-semibold">{profile?.phone || "—"}</p></div>
                <div className="p-4 bg-gray-800/50 rounded-xl"><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Role</p><p className="text-emerald-400 font-semibold capitalize">{profile?.role}</p></div>
              </div>
              <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all"><Camera className="h-4 w-4" /> Edit Profile</button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-gray-700/50 overflow-hidden">
        <button onClick={() => setShowPwForm(!showPwForm)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-800/30 transition-colors">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Lock className="h-5 w-5 text-amber-400" /> Change Password</h3>
          <span className="text-xs text-gray-500">{showPwForm ? "▲" : "▼"}</span>
        </button>
        {showPwForm && (
          <div className="p-6 border-t border-gray-700/50 space-y-4">
            <div><label className="text-sm font-semibold text-gray-300 mb-2 block">Current Password</label><input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm font-semibold text-gray-300 mb-2 block">New Password</label><input type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" />{pwForm.newPassword && pwForm.newPassword.length < 6 && <p className="text-xs text-red-400 mt-1">Min 6 characters</p>}</div>
              <div><label className="text-sm font-semibold text-gray-300 mb-2 block">Confirm Password</label><input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" />{pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && <p className="text-xs text-red-400 mt-1">Passwords don&apos;t match</p>}</div>
            </div>
            <button onClick={handleChangePassword} disabled={pwSaving || !pwForm.currentPassword || !pwForm.newPassword || pwForm.newPassword !== pwForm.confirmPassword} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all">{pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}{pwSaving ? "Changing..." : "Change Password"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
