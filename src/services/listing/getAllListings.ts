import { supabase } from "@/lib/supabase";
import { Listing } from "@/src/types/listing";
import { ListingImage } from "@/src/types/listingImages";
import { Profile } from "@/src/types/profile";
import { Home } from "@/src/types/home";
import { Amenity } from "@/src/types/amenity";
import { Fee } from "@/src/types/fee";
import { Rule } from "@/src/types/rule";
import { Province, District, Ward } from "@/src/types/location";

export type ListingWithHost = Listing & {
  host: Pick<Profile, "id" | "full_name" | "email"> | null;
  province: Province | null;
  district: District | null;
  ward: Ward | null;
  images: ListingImage[];

  homes: Home | null;

  listing_amenities: {
    amenity: Amenity;
  }[];

  listing_rules: {
    rule: Rule;
  }[];

  fees: Fee[];
};

export async function getAllListings(): Promise<ListingWithHost[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      host:profiles!listings_host_id_fkey (
        id,
        full_name,
        email
      ),
      province:provinces!listings_province_code_fkey (*),
      district:districts!listings_district_code_fkey (*),
      ward:wards!listings_ward_code_fkey (*),
      images:listing_images (*),
      homes (*),
      listing_amenities (
        amenity:amenities (*)
      ),
      listing_rules (
        rule:rules (*)
      ),
      fees (*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as ListingWithHost[];
}
