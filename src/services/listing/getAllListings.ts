import { supabase } from "@/lib/supabase";
import { Listing } from "@/src/types/listing";
import { ListingImage } from "@/src/types/listingImages";
import { Profile } from "@/src/types/profile";
import { Home } from "@/src/types/home";
import { Amenity } from "@/src/types/amenity";
import { Fee } from "@/src/types/fee";


export type ListingWithHost = Listing & {
  host: Pick<Profile, "id" | "full_name" | "email"> | null;
  province: { name: string } | null;
  district: { name: string } | null;
  ward: { name: string } | null;
  images: ListingImage[];

  homes: Home | null;


  listing_amenities: {
    amenity: Amenity;
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
      province:provinces!listings_province_code_fkey ( name ),
      district:districts!listings_district_code_fkey ( name ),
      ward:wards!listings_ward_code_fkey ( name ),
      images:listing_images (*),
      homes (*),
      listing_amenities (
        amenity:amenities (*)
      ),
      fees (*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as ListingWithHost[];
}
