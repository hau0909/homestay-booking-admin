
import { supabase } from "@/lib/supabase";
import { ProfileStatus } from "@/src/types/enums";

export async function updateUserStatus(
  userId: string,
  status: ProfileStatus
) {
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", userId);

  if (error) {
    console.error("Update user status error:", error);
    throw error;
  }

  return true;
}