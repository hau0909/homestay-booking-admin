import { supabase } from "@/lib/supabase";

export async function uploadBannerImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `banners/${fileName}`;

  const { data, error } = await supabase.storage.from('banner').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  // Lấy public URL
  const { data: publicUrlData } = supabase.storage.from('banner').getPublicUrl(filePath);
  return publicUrlData?.publicUrl || null;
}
