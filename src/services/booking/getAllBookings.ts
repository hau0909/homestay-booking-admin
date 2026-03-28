import { supabase } from "@/lib/supabase";

export interface BookingWithDetails {
  id: number;
  user_id: string;
  listing_id: number;
  total_price: number;
  status: string;
  payment_status: string;
  check_in_date: string | null;
  check_out_date: string | null;
  created_at: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  listing_title: string | null;
  host_name: string | null;
  host_phone: string | null;
}

export async function getAllBookings(): Promise<BookingWithDetails[]> {
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
      guest:profiles!bookings_user_id_fkey (
        full_name,
        email,
        phone
      ),
      listings!bookings_listing_id_fkey (
        title,
        host:profiles!listings_host_id_fkey (
          full_name,
          phone
        )
      )
    `)
    .order("created_at", { ascending: false })
    .neq("status", "DRAFT");

  if (error) {
    console.error("Error fetching all bookings:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((b: any) => ({
    id: b.id,
    user_id: b.user_id,
    listing_id: b.listing_id,
    total_price: b.total_price,
    status: b.status,
    payment_status: b.payment_status,
    check_in_date: b.check_in_date,
    check_out_date: b.check_out_date,
    created_at: b.created_at,
    guest_name: b.guest?.full_name ?? null,
    guest_email: b.guest?.email ?? null,
    guest_phone: b.guest?.phone ?? null,
    listing_title: b.listings?.title ?? null,
    host_name: b.listings?.host?.full_name ?? null,
    host_phone: b.listings?.host?.phone ?? null,
  }));
}
