import { supabase } from "@/lib/supabase";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: "User not found" };
  }

  const adminCheck = await isAdmin(data.user.id);

  if (!adminCheck.success) {
    await supabase.auth.signOut();
    return adminCheck;
  }

  return { success: true };
}

const isAdmin = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Admin check error: ", error);
    return { success: false };
  }

  if (data.role !== "ADMIN") {
    return { success: false };
  }

  return { success: true };
};
