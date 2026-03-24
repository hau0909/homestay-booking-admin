import { supabase } from "@/lib/supabase";
import { Experience } from "@/src/types/experience";
import { ExperienceActivity } from "@/src/types/experienceActivity";
import { ExperienceSlot } from "@/src/types/experienceSlot";

export type ExperienceWithDetails = Experience & {
  experience_activities: ExperienceActivity[];
  experience_slots: ExperienceSlot[];
};

export async function getExperienceByListingId(listingId: number): Promise<ExperienceWithDetails | null> {
  const { data, error } = await supabase
    .from("experiences")
    .select(`
      *,
      experience_activities (*),
      experience_slots (*)
    `)
    .eq("listing_id", listingId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  return data as ExperienceWithDetails;
}
