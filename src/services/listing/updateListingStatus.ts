import { supabase } from "@/lib/supabase";
import { ListingStatus } from "@/src/types/enums";

export async function updateListingStatus(
  listingId: number,
  status: ListingStatus
) {
  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId);

  if (error) {
    console.error("Update listing status error:", error);
    throw error;
  }
}
