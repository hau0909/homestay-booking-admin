"use client";

import { StatCard } from "@/src/components/common/StatCard";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="1,240" />
        <StatCard title="Bookings" value="320" />
        <StatCard title="Revenue" value="$12,400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-semibold mb-4">Recent Bookings</h2>
        <div className="h-40 flex items-center justify-center text-muted-foreground">
          Table goes here
        </div>
      </div>
    </div>
  );
}
