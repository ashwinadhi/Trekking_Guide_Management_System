"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Calendar, Car, MessageSquare, Loader2, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationData {
  trekBookings: any[];
  vehicleBookings: any[];
  inquiries: any[];
  totalCount: number;
}

export default function NotificationBell() {
  const [data, setData] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all">
          <Bell className="h-5 w-5" />
          {data && data.totalCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 hover:bg-red-700 text-[10px] font-black border-2 border-gray-950 rounded-full animate-pulse">
              {data.totalCount > 9 ? "9+" : data.totalCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-gray-900 border-gray-800 text-white p-0 overflow-hidden" align="end">
        <DropdownMenuLabel className="p-4 bg-gray-800/50 border-b border-gray-800 flex justify-between items-center">
          <span className="font-bold text-sm">Notifications</span>
          <Button variant="ghost" size="sm" onClick={fetchNotifications} className="h-8 px-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Refresh"}
          </Button>
        </DropdownMenuLabel>
        
        <Tabs defaultValue="treks" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-800/30 rounded-none h-10 border-b border-gray-800">
            <TabsTrigger value="treks" className="text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-gray-800 data-[state=active]:text-emerald-400">Treks</TabsTrigger>
            <TabsTrigger value="vehicles" className="text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-gray-800 data-[state=active]:text-emerald-400">Vehicles</TabsTrigger>
            <TabsTrigger value="inquiries" className="text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-gray-800 data-[state=active]:text-emerald-400">Inquiries</TabsTrigger>
          </TabsList>

          <div className="max-h-[300px] overflow-y-auto">
            <TabsContent value="treks" className="m-0">
              {data?.trekBookings.length ? data.trekBookings.map((b) => (
                <DropdownMenuItem key={b._id} className="p-4 focus:bg-gray-800 border-b border-gray-800/50 cursor-pointer">
                  <Link href="/admin/bookings" className="flex gap-3 w-full">
                    <div className="bg-emerald-500/10 p-2 rounded-xl h-fit">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none mb-1">{b.name}</p>
                      <p className="text-[10px] text-gray-500 truncate w-48">New {b.bookingType} booking</p>
                    </div>
                    <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 ml-auto self-center" />
                  </Link>
                </DropdownMenuItem>
              )) : <div className="p-8 text-center text-gray-500 text-xs italic">No new trek bookings</div>}
            </TabsContent>

            <TabsContent value="vehicles" className="m-0">
              {data?.vehicleBookings.length ? data.vehicleBookings.map((b) => (
                <DropdownMenuItem key={b._id} className="p-4 focus:bg-gray-800 border-b border-gray-800/50 cursor-pointer">
                  <Link href="/admin/vehicle-bookings" className="flex gap-3 w-full">
                    <div className="bg-blue-500/10 p-2 rounded-xl h-fit">
                      <Car className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none mb-1">{b.customerName}</p>
                      <p className="text-[10px] text-gray-500 truncate w-48">Requested {b.vehicleName}</p>
                    </div>
                    <Circle className="h-2 w-2 fill-blue-500 text-blue-500 ml-auto self-center" />
                  </Link>
                </DropdownMenuItem>
              )) : <div className="p-8 text-center text-gray-500 text-xs italic">No new vehicle requests</div>}
            </TabsContent>

            <TabsContent value="inquiries" className="m-0">
              {data?.inquiries.length ? data.inquiries.map((i) => (
                <DropdownMenuItem key={i._id} className="p-4 focus:bg-gray-800 border-b border-gray-800/50 cursor-pointer">
                  <Link href="/admin/inquiries" className="flex gap-3 w-full">
                    <div className="bg-orange-500/10 p-2 rounded-xl h-fit">
                      <MessageSquare className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none mb-1">{i.name}</p>
                      <p className="text-[10px] text-gray-500 truncate w-48">{i.subject}</p>
                    </div>
                    <Circle className="h-2 w-2 fill-orange-500 text-orange-500 ml-auto self-center" />
                  </Link>
                </DropdownMenuItem>
              )) : <div className="p-8 text-center text-gray-500 text-xs italic">No new inquiries</div>}
            </TabsContent>
          </div>
        </Tabs>

        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem className="p-3 justify-center text-[10px] uppercase font-black tracking-widest text-emerald-400 hover:text-emerald-300 focus:bg-gray-800 cursor-pointer">
          <Link href="/admin/dashboard" className="w-full text-center">View All Activity</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
