import { supabase } from "@/lib/supabase";

export interface Banner {
  id?: number;
  title: string;
  image_url: string;
  redirect_url: string;
  is_active: boolean;
}

export async function addBanner(banner: Omit<Banner, "id">) {
  const { data, error } = await supabase.from("banners").insert([banner]).select();
  if (error) throw error;
  return data;
}

export async function updateBanner(id: number, banner: Omit<Banner, "id">) {
  const { data, error } = await supabase.from("banners").update(banner).eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function getBanners() {
  const { data, error } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
