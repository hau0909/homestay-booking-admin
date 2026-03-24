import { supabase } from "@/lib/supabase";

export async function deleteBanner(id: number) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
  return true;
}
