import { supabase } from "@/lib/supabase";
import { Profile } from "@/src/types/profile";

export const getAllHosts = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "USER")
    .eq("is_host", true);

  if (error) {
    console.error("getAllHosts error:", error);
    return [];
  }

  return data as Profile[];
};
