"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/src/components/dashboard/StatCard";
import { RecentBookingsTable } from "@/src/components/dashboard/RecentBookingsTable";
import { RecentListingsTable } from "@/src/components/dashboard/RecentListingsTable";
import { Users, Home, MapPin, Loader2, UserCheck, FileText } from "lucide-react";
import { 
  DashboardStats, 
  RecentBooking, 
  RecentListing,
  getDashboardStats,
  getRecentBookings,
  getRecentListings
} from "@/src/services/dashboard/getDashboardStats";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentListings, setRecentListings] = useState<RecentListing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [statsData, bookingsData, listingsData] = await Promise.all([
          getDashboardStats(),
          getRecentBookings(8),
          getRecentListings(5),
        ]);
        
        setStats(statsData);
        setRecentBookings(bookingsData);
        setRecentListings(listingsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#11009E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Hosts" 
          value={stats.totalHosts.toLocaleString()} 
          icon={<UserCheck className="w-6 h-6" />}
          colorClass="bg-indigo-100 text-indigo-700"
        />
        <StatCard 
          title="Total Customer" 
          value={stats.totalUsers.toLocaleString()} 
          icon={<Users className="w-6 h-6" />}
          colorClass="bg-blue-100 text-blue-700"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings.toLocaleString()} 
          icon={<Home className="w-6 h-6" />}
          colorClass="bg-purple-100 text-purple-700"
          description={`${stats.confirmedBookings} upcoming`}
        />
        <StatCard 
          title="Total Listings" 
          value={stats.totalListings.toLocaleString()} 
          icon={<MapPin className="w-6 h-6" />}
          colorClass="bg-amber-100 text-amber-700"
          description={`${stats.activeListings} active`}
        />
      </div>

      {/* Action Needed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-rose-100 text-rose-700 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-rose-800 font-semibold mb-0.5">Host Applications</h3>
              <p className="text-rose-600/80 text-sm">{stats.pendingHostRequests} requests pending review</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/hosts')}
            className="bg-white border border-rose-200 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Review
          </button>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-amber-800 font-semibold mb-0.5">Pending Listings</h3>
              <p className="text-amber-600/80 text-sm">{stats.pendingListings} properties awaiting approval</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/listings')}
            className="bg-white border border-amber-200 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Review
          </button>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentBookingsTable bookings={recentBookings} />
        </div>
        <div className="lg:col-span-1">
          <RecentListingsTable listings={recentListings} />
        </div>
      </div>
    </div>
  );
}
