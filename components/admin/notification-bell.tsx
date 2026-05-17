"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Calendar, Car, MessageSquare, Loader2, Circle, Users, Check, Trash2, CheckCheck } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  navigateTo: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=20");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT" });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "guide_booking": return <Users className="h-4 w-4 text-purple-500" />;
      case "car_booking": return <Car className="h-4 w-4 text-blue-500" />;
      case "trek_booking":
      case "new_booking": return <Calendar className="h-4 w-4 text-emerald-500" />;
      case "booking_approved": return <Check className="h-4 w-4 text-emerald-500" />;
      case "booking_cancelled": return <Circle className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4 text-orange-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "guide_booking": return "bg-purple-500/10";
      case "car_booking": return "bg-blue-500/10";
      case "trek_booking":
      case "new_booking":
      case "booking_approved": return "bg-emerald-500/10";
      case "booking_cancelled": return "bg-red-500/10";
      default: return "bg-orange-500/10";
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 hover:bg-red-700 text-[10px] font-black border-2 border-gray-950 rounded-full animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-gray-900 border-gray-800 text-white p-0 overflow-hidden" align="end">
        <DropdownMenuLabel className="p-4 bg-gray-800/50 border-b border-gray-800 flex justify-between items-center">
          <div>
            <span className="font-bold text-sm">Notifications</span>
            {unreadCount > 0 && <span className="ml-2 text-xs text-emerald-400 font-medium">{unreadCount} new</span>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 px-2 text-[10px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 font-bold uppercase tracking-wider">
                <CheckCheck className="h-3 w-3 mr-1" /> Read All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={fetchNotifications} className="h-7 px-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "↻"}
            </Button>
          </div>
        </DropdownMenuLabel>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs italic">No notifications yet</div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem key={n._id} className="p-0 focus:bg-transparent cursor-default">
                <Link
                  href={n.navigateTo || "/admin/dashboard"}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`flex gap-3 w-full p-4 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${!n.isRead ? "bg-emerald-500/5" : ""}`}
                >
                  <div className={`${getIconBg(n.type)} p-2 rounded-xl h-fit flex-shrink-0`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-none mb-1 ${!n.isRead ? "font-bold text-white" : "font-medium text-gray-300"}`}>
                      {n.title}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{n.message}</p>
                    <p className="text-[9px] text-gray-600 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    {!n.isRead && <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />}
                    <button
                      onClick={(e) => deleteNotification(n._id, e)}
                      className="p-1 text-gray-600 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem className="p-3 justify-center text-[10px] uppercase font-black tracking-widest text-emerald-400 hover:text-emerald-300 focus:bg-gray-800 cursor-pointer">
          <Link href="/admin/dashboard" className="w-full text-center">View Dashboard</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
