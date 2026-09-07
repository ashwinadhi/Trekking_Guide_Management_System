"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Trash2, CheckCircle, Loader2, AlertCircle, Mail, User, Clock, Phone } from "lucide-react";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      const data = await res.json();
      setInquiries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, currentStatus: boolean) => {
    setActionLoading(`read-${id}`);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchInquiries();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    setActionLoading(`delete-${id}`);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete inquiry");
      await fetchInquiries();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
          <p className="text-gray-400 text-lg font-medium">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ivory">
            Inquiries
          </h1>
          <p className="text-gray-400 mt-1">Manage contact form submissions</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No inquiries yet</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-800/50 text-xs uppercase text-gray-400 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold">Subject & Message</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className={`hover:bg-gray-800/30 transition-colors ${inquiry.isRead ? "opacity-75" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inquiry.isRead ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          <CheckCircle className="h-3.5 w-3.5" /> Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                          <AlertCircle className="h-3.5 w-3.5" /> New
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-medium text-white">
                          <User className="h-4 w-4 text-gray-500" />
                          {inquiry.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${inquiry.email}`} className="hover:text-gold transition-colors">
                            {inquiry.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{inquiry.phone ?? "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(inquiry.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="font-semibold text-white mb-1">{inquiry.subject}</div>
                        <p className="text-gray-400 line-clamp-2" title={inquiry.message}>
                          {inquiry.message}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => markAsRead(inquiry._id, inquiry.isRead)}
                          disabled={actionLoading === `read-${inquiry._id}`}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            inquiry.isRead
                              ? "text-gray-400 bg-gray-800 hover:bg-gray-700 border border-gray-700"
                              : "text-gold bg-gold/10 hover:bg-gold/20 border border-gold/20"
                          }`}
                        >
                          {actionLoading === `read-${inquiry._id}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          {inquiry.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={() => deleteInquiry(inquiry._id)}
                          disabled={actionLoading === `delete-${inquiry._id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                        >
                          {actionLoading === `delete-${inquiry._id}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
