"use client";
import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import {
  getAllListings,
  ListingWithHost,
} from "@/src/services/listing/getAllListings";
import { updateListingStatus } from "@/src/services/listing/updateListingStatus";
import { ListingStatus } from "@/src/types/enums";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import toast from "react-hot-toast";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingWithHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] =
    useState<ListingWithHost | null>(null);
  const [previewImage, setPreviewImage] =
    useState<string | null>(null);
  useEffect(() => {
    loadListings();
  }, []);
const [search, setSearch] = useState("");

  async function loadListings() {
    try {
      setLoading(true);
      const data = await getAllListings();
      setListings(data);
    } finally {
      setLoading(false);
    }
  }
  //search
const filteredListings = listings.filter((listing) => {
  const keyword = search.toLowerCase();

  return (
    listing.title?.toLowerCase().includes(keyword) ||
    listing.host?.full_name?.toLowerCase().includes(keyword)
  );
});

  async function handleUpdateStatus(
  listingId: number,
  status: ListingStatus
) {
  await updateListingStatus(listingId, status);

  setListings((prev) =>
    prev.map((l) =>
      l.id === listingId ? { ...l, status } : l
    )
  );

  setSelectedListing(null);

  toast.success(
    status === "ACTIVE"
      ? "Listing approved successfully!"
      : "Listing rejected successfully!"
  );
}

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        All Listings
      </h1>

{/* SEARCH */}
      <div className="flex justify-end my-4">
  <div className="relative w-[380px]">
    <input
      type="text"
      placeholder="Search by host or title..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full bg-white border rounded-xl px-4 py-2 pr-8 text-sm shadow-sm focus:outline-none"
    />

    {search && (
      <button
        onClick={() => setSearch("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
      >
        ✕
      </button>
    )}
  </div>
</div>


      {/* TABLE */}
      <div className="rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead className="italic text-muted-foreground">#</TableHead>
                <TableHead className="italic text-muted-foreground">Title</TableHead>
                <TableHead className="italic text-muted-foreground">Host</TableHead>
                <TableHead className="italic text-muted-foreground">Status</TableHead>
                <TableHead className="italic text-muted-foreground">View</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-6">
        Loading...
      </TableCell>
    </TableRow>
  ) : filteredListings.length === 0 ? (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-6 text-sm text-gray-500">
        No listing found.
      </TableCell>
    </TableRow>
  ) : (
    filteredListings.map((listing, index) => (
      <TableRow key={listing.id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{listing.title}</TableCell>
        <TableCell>
          {listing.host?.full_name ?? "Unknown"}
        </TableCell>
        <TableCell>
          <StatusBadge status={listing.status} />
        </TableCell>
        <TableCell>
          <button
            onClick={() => setSelectedListing(listing)}
            className="p-2 hover:bg-muted rounded-md"
          >
            <Eye className="w-5 h-5" />
          </button>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
        </Table>
      </div>

      {/* DETAIL MODAL */}
      {selectedListing && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start overflow-y-auto"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="bg-white w-full max-w-3xl mt-10 mb-10 p-6 rounded-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedListing.title}
            </h2>

            {/* GALLERY */}
            {selectedListing.images?.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {selectedListing.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    onClick={() =>
                      setPreviewImage(img.url)
                    }
                    className="h-20 w-full object-cover rounded-md cursor-pointer hover:scale-105 transition"
                  />
                ))}
              </div>
            )}

            {/* BASIC INFO */}
<div className="grid grid-cols-2 gap-3 mt-4 text-sm">
  <InfoItem label="Listing ID">
    {selectedListing.id}
  </InfoItem>

  <InfoItem label="Status">
    {selectedListing.status}
  </InfoItem>

  <InfoItem label="Host">
    {selectedListing.host?.full_name}
  </InfoItem>

  <InfoItem label="Email">
    {selectedListing.host?.email}
  </InfoItem>

  <InfoItem label="Address">
    {[
      selectedListing.address_detail,
      selectedListing.ward?.name,
      selectedListing.district?.name,
      selectedListing.province?.name,
    ]
      .filter(Boolean)
      .join(", ")}
  </InfoItem>

  <InfoItem label="Created At">
    {new Date(selectedListing.created_at).toLocaleString()}
  </InfoItem>
</div>

{/* DESCRIPTION */}
<div className="mt-4 text-sm">
  <InfoItem label="Description">
    {selectedListing.description}
  </InfoItem>
</div>

{/* HOME INFO */}
{selectedListing.homes && (
  <div className="mt-4">
    <h3 className="font-semibold text-base mb-2">
      Home Information
    </h3>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
      <InfoItem label="Quantity">
        {selectedListing.homes.quantity}
      </InfoItem>

      <InfoItem label="Max Guests">
        {selectedListing.homes.max_guests}
      </InfoItem>

      <InfoItem label="Beds">
        {selectedListing.homes.bed_count ?? 0}
      </InfoItem>

      <InfoItem label="Baths">
        {selectedListing.homes.bath_count ?? 0}
      </InfoItem>

      <InfoItem label="Room Size">
        {selectedListing.homes.room_size ?? 0} m²
      </InfoItem>

      <InfoItem label="Weekday Price">
        ${selectedListing.homes.price_weekday}
      </InfoItem>

      <InfoItem label="Weekend Price">
        ${selectedListing.homes.price_weekend}
      </InfoItem>
    </div>
  </div>
)}

{/* AMENITIES */}
{selectedListing.listing_amenities?.length > 0 && (
  <div className="mt-4">
    <h3 className="font-semibold text-base mb-2">
      Amenities
    </h3>

    <div className="flex flex-wrap gap-2 text-xs">
      {selectedListing.listing_amenities.map((item) => (
        <div
          key={item.amenity.id}
          className="px-2 py-0.5 bg-gray-100 rounded-full"
        >
          {item.amenity.name}
        </div>
      ))}
    </div>
  </div>
)}

{/* FEES */}
{selectedListing.fees?.length > 0 && (
  <div className="mt-4">
    <h3 className="font-semibold text-base mb-2">
      Extra Fees
    </h3>

    <div className="space-y-2 text-sm">
      {selectedListing.fees.map((fee) => (
        <div
          key={fee.id}
          className="flex justify-between bg-muted p-2 rounded-md"
        >
          <span>{fee.title}</span>
          <span>${fee.price}</span>
        </div>
      ))}
    </div>
  </div>
)}
            {/* ACTION */}
            {selectedListing.status === "PENDING" && (
              <div className="flex gap-4 mt-6">
                <Button
                  className="flex-1 bg-green-600 text-white"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedListing.id,
                      "ACTIVE"
                    )
                  }
                >
                  Approve
                </Button>

                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedListing.id,
                      "BANNED"
                    )
                  }
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW FULLSCREEN */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="w-[80vw] h-[80vh] object-cover rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ListingStatus }) {
  let variant: any;

  if (status === "ACTIVE") variant = "default";
  else if (status === "PENDING") variant = "outline";
  else if (status === "HIDDEN") variant = "secondary";   // xám
  else if (status === "BANNED") variant = "destructive"; // đỏ
  else variant = "outline";

  return <Badge variant={variant}>{status}</Badge>;
}

function InfoItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted p-3 rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">
        {label}
      </p>
      <p className="font-medium break-words whitespace-pre-wrap">
        {children}
      </p>
    </div>
  );
}
