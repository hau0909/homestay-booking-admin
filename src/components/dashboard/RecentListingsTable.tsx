import React from "react";
import { RecentListing } from "@/src/services/dashboard/getDashboardStats";
import Link from "next/link";

interface RecentListingsTableProps {
  listings: RecentListing[];
}

export function RecentListingsTable({ listings }: RecentListingsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>;
      case "PENDING":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Pending</span>;
      case "BANNED":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">Banned</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Recent Listings</h2>
        <Link href="/listings" className="text-sm font-medium text-[#11009E] hover:underline">
  View All
</Link>
      </div>
      <div className="divide-y divide-slate-100">
        {listings.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500">
            No recent listings found.
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 text-sm">{listing.title}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Host: <span className="text-slate-700">{listing.host_name || "Unknown"}</span> • {formatDate(listing.created_at)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(listing.status)}
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                  {listing.listing_type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
