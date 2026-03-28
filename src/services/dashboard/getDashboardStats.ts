import { supabase } from "@/lib/supabase";

export interface DashboardStats {
  totalUsers: number;
  totalHosts: number;
  totalListings: number;
  pendingListings: number;
  activeListings: number;
  bannedListings: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  pendingHostRequests: number;
}

export interface RecentBooking {
  id: number;
  user_id: string;
  listing_id: number;
  listing_title: string | null;
  guest_name: string | null;
  guest_email: string | null;
  total_price: number;
  status: string;
  payment_status: string;
  check_in_date: string | null;
  check_out_date: string | null;
  created_at: string;
}

export interface RecentListing {
  id: number;
  title: string;
  status: string;
  listing_type: string;
  host_name: string | null;
  created_at: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    usersRes,
    hostsRes,
    listingsRes,
    bookingsRes,
    hostRequestsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "USER").eq("is_host", false),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_host", true),
    supabase.from("listings").select("id, status"),
    supabase.from("bookings").select("id, status, total_price, payment_status"),
    supabase.from("host_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const listings = listingsRes.data ?? [];
  const bookings = (bookingsRes.data ?? []).filter((b) => b.status !== "DRAFT");

  return {
    totalUsers: usersRes.count ?? 0,
    totalHosts: hostsRes.count ?? 0,
    totalListings: listings.length,
    pendingListings: listings.filter((l) => l.status === "PENDING").length,
    activeListings: listings.filter((l) => l.status === "ACTIVE").length,
    bannedListings: listings.filter((l) => l.status === "BANNED").length,
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "CONFIRMED").length,
    cancelledBookings: bookings.filter((b) => b.status === "CANCELLED").length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    pendingHostRequests: hostRequestsRes.count ?? 0,
  };
}

export async function getRecentBookings(limit = 8): Promise<RecentBooking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      user_id,
      listing_id,
      total_price,
      status,
      payment_status,
      check_in_date,
      check_out_date,
      created_at,
      profiles!bookings_user_id_fkey (
        full_name,
        email
      ),
      listings!bookings_listing_id_fkey (
        title
      )
    `)
    .order("created_at", { ascending: false })
    .neq("status", "DRAFT")
    .limit(limit);

  if (error) {
    console.error("getRecentBookings error:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((b: any) => ({
    id: b.id,
    user_id: b.user_id,
    listing_id: b.listing_id,
    listing_title: b.listings?.title ?? null,
    guest_name: b.profiles?.full_name ?? null,
    guest_email: b.profiles?.email ?? null,
    total_price: b.total_price,
    status: b.status,
    payment_status: b.payment_status,
    check_in_date: b.check_in_date,
    check_out_date: b.check_out_date,
    created_at: b.created_at,
  }));
}

export async function getRecentListings(limit = 5): Promise<RecentListing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(`
      id,
      title,
      status,
      listing_type,
      created_at,
      profiles!listings_host_id_fkey (
        full_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentListings error:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((l: any) => ({
    id: l.id,
    title: l.title,
    status: l.status,
    listing_type: l.listing_type,
    host_name: l.profiles?.full_name ?? null,
    created_at: l.created_at,
  }));
}
