import { supabase } from "@/lib/supabase";
import { Profile } from "@/src/types/profile";

export const getAllCustomer = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "USER")
    .eq("is_host", false);

  if (error) {
    console.error("getAllCustomer error:", error);
    return [];
  }

  return data as Profile[];
};
