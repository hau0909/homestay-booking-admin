import { supabase } from "@/lib/supabase";

export async function banListing(
  listingId: number,
  description: string
) {
  const { error } = await supabase
    .from("listing_banned_detail")
    .insert({
      listing_id: listingId,
      description,
    });

  if (error) {
    console.error("Ban listing error:", error);
    throw error;
  }
}