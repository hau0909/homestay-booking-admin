import { supabase } from "@/lib/supabase";

export const allowUserToResubmit = async (
  action: "resubmit",
  hostApplicationId: string,
  userId: string,
) => {
  const { error: getError, data } = await supabase
    .from("host_applications")
    .select("status")
    .eq("id", hostApplicationId)
    .single();

  if (getError) throw getError;

  if (data?.status !== "request_again") {
    throw new Error("Invalid status to update");
  }

  const { error } = await supabase
    .from("host_applications")
    .update({ status: action })
    .eq("id", hostApplicationId)
    .eq("user_id", userId);

  if (error) throw error;
};
