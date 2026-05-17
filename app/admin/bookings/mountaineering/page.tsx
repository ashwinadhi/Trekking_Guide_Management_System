"use client";
import { Mountain } from "lucide-react";

export default function MountaineeringBookingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div><h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Mountaineering Bookings</h1><p className="text-gray-400 mt-1">Manage mountaineering expedition requests</p></div>
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center">
        <Mountain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Coming Soon</h3>
        <p className="text-gray-500">Mountaineering bookings module will be available here once expedition packages are added.</p>
      </div>
    </div>
  );
}
