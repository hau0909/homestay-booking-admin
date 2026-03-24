import { supabase } from "@/lib/supabase";
import { BookingLog } from "@/src/types/booking-log";

export async function getAllBookingLogs(): Promise<BookingLog[]> {
  const { data, error } = await supabase
    .from("booking_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all booking logs:", error);
    return [];
  }

  return data ?? [];
}

export async function getBookingLogsByBookingId(bookingId: number): Promise<BookingLog[]> {
  const { data, error } = await supabase
    .from("booking_logs")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching logs for booking ${bookingId}:`, error);
    return [];
  }

  return data ?? [];
}
