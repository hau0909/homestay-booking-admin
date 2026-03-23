import { supabase } from "@/lib/supabase";

export const approveOrRejectHostRequest = async (
  requestId: string,
  userId: string,
  action: "approved" | "rejected",
) => {
  if (!requestId || !userId) {
    throw new Error("Missing requestId or userId");
  }

  const { error: requestError } = await supabase
    .from("host_applications")
    .update({
      status: action,
    })
    .eq("id", requestId)
    .eq("status", "pending");

  if (requestError) throw requestError;

  if (action === "approved") {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        is_host: true,
      })
      .eq("id", userId);

    if (profileError) {
      throw profileError;
    }
  }
};
