import { supabase } from "@/lib/supabase";

export async function banListing(
  listingId: number,
  description: string
) {
  // 1. Insert ban details
  const { error: detailError } = await supabase
    .from("listing_banned_detail")
    .insert({
      listing_id: listingId,
      description,
    });

  if (detailError) {
    console.error("Ban detail insert error:", detailError);
    throw detailError;
  }

  // 2. Update listing status to BANNED
  const { error: statusError } = await supabase
    .from("listings")
    .update({ status: "BANNED" })
    .eq("id", listingId);

  if (statusError) {
    console.error("Update listing status error:", statusError);
    throw statusError;
  }
}