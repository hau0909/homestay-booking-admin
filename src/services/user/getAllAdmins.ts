import { supabase } from "@/lib/supabase";
import { Profile } from "@/src/types/profile";

export const getAllAdmins = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "ADMIN");

  if (error) {
    console.error("getAllAdmins error:", error);
    return [];
  }

  return data as Profile[];
};
