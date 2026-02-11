import { supabase } from "@/lib/supabase";

export const viewAllBecomeHostRequest = async () => {
  const { data, error } = await supabase
    .from("host_applications")
    .select(
      `id,
      status,
      identity_card_front_url,
      identity_card_back_url,
      created_at,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

export const viewHostRequestDetail = async (hostRequestId: string) => {
  const { error, data } = await supabase
    .from("host_applications")
    .select(
      `
      id,
      status,
      identity_card_front_url,
      identity_card_back_url,
      profiles (
        id,
        email,
        full_name,
        avatar_url,
        bio,
        phone,
        identity_card
      )
    `,
    )
    .eq("id", hostRequestId)
    .single();

  if (error) throw error;

  return data;
};
