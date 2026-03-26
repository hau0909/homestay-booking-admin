"use client";
import React, { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import {
  getAllListings,
  ListingWithHost,
} from "@/src/services/listing/getAllListings";
import {
  getExperienceByListingId,
  ExperienceWithDetails,
} from "@/src/services/experience/getExperienceByListingId";
import { updateListingStatus } from "@/src/services/listing/updateListingStatus";
import { banListing } from "@/src/services/listing/banListing";
import { ListingStatus } from "@/src/types/enums";
import { ExperienceActivity } from "@/src/types/experienceActivity";
import { ExperienceSlot } from "@/src/types/experienceSlot";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceWithDetails | null>(null);
  const [fetchingExp, setFetchingExp] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [activeTab, setActiveTab] = useState<"HOME" | "EXPERIENCE">("HOME");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    loadListings();
  }, []);

  // Fetch experience details when a listing is selected
  useEffect(() => {
    if (selectedListing && selectedListing.listing_type === "EXPERIENCE") {
      fetchExperienceDetails(selectedListing.id);
    } else {
      setSelectedExperience(null);
    }
  }, [selectedListing]);

  async function loadListings() {
    try {
      setLoading(true);
      const data = await getAllListings();
      setListings(data.filter((listing) => listing.status !== "DRAFT"));
    } catch (error) {
      console.error("Failed to load listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }

  async function fetchExperienceDetails(listingId: number) {
    try {
      setFetchingExp(true);
      const data = await getExperienceByListingId(listingId);
      setSelectedExperience(data);
    } catch (error) {
      console.error("Failed to fetch experience details:", error);
      toast.error("Failed to load experience details");
    } finally {
      setFetchingExp(false);
    }
  }

  // Helper to format slot time
  const formatSlotTime = (time: string) => {
    if (!time) return "";
    // If it's a full ISO string or has date part, extract time
    if (time.includes("T")) {
      return time.split("T")[1].slice(0, 5);
    }
    // If it's HH:mm:ss, just take HH:mm
    if (time.includes(":")) {
      return time.slice(0, 5);
    }
    return time;
  };

  // Filter theo tab và search
  const filteredListings = listings.filter((listing) => {
    const keyword = search.toLowerCase();
    
    // Restrict search: Only match ID or Host (name/email)
    const matchesSearch =
      listing.id.toString().includes(keyword) ||
      listing.host?.full_name?.toLowerCase().includes(keyword) ||
      listing.host?.email?.toLowerCase().includes(keyword);

    const matchesStatus = statusFilter === "ALL" || listing.status === statusFilter;
    const matchesTab = listing.listing_type === activeTab;

    return matchesSearch && matchesTab && matchesStatus;
  });

  async function handleUpdateStatus(listingId: number, status: ListingStatus) {
    try {
      await updateListingStatus(listingId, status);
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status } : l)),
      );
      setSelectedListing(null);
      toast.success(
        status === "ACTIVE"
          ? "Listing approved successfully!"
          : "Listing rejected successfully!",
      );
    } catch (error) {
      console.error("Update status failed:", error);
      toast.error("Update failed");
    }
  }

  async function handleBanListing(listingId: number) {
    if (!banReason.trim()) {
      toast.error("Please enter ban reason");
      return;
    }

    try {
      await banListing(listingId, banReason);
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: "BANNED" } : l)),
      );
      toast.success("Listing banned successfully");
      setShowBanModal(false);
      setSelectedListing(null);
      setBanReason("");
    } catch (error) {
      console.error("Ban failed:", error);
      toast.error("Ban failed");
    }
  }

  async function handleUnban(listingId: number) {
    try {
      await updateListingStatus(listingId, "ACTIVE");
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: "ACTIVE" } : l)),
      );
      toast.success("Listing unbanned successfully");
      setSelectedListing(null);
    } catch (error) {
      console.error("Unban failed:", error);
      toast.error("Unban failed");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        {/* TABS HEADER */}
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white p-1">
          <TabsTrigger
            value="HOME"
            className="rounded-lg text-sm font-semibold data-[state=active]:bg-[#11009E] data-[state=active]:text-white"
          >
            Homes
          </TabsTrigger>
          <TabsTrigger
            value="EXPERIENCE"
            className="rounded-lg text-sm font-semibold data-[state=active]:bg-[#11009E] data-[state=active]:text-white"
          >
            Experiences
          </TabsTrigger>
        </TabsList>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
            <TabsList className="bg-white border p-1 rounded-xl h-auto">
              <TabsTrigger value="ALL" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="PENDING" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Pending</TabsTrigger>
              <TabsTrigger value="ACTIVE" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Active</TabsTrigger>
              <TabsTrigger value="BANNED" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Banned</TabsTrigger>
              <TabsTrigger value="REJECTED" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Rejected</TabsTrigger>
              <TabsTrigger value="HIDDEN" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Hidden</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or Host..."
              className="rounded-xl bg-white pl-4 h-10 border-slate-200 shadow-sm"
            />
          </div>
        </div>

        {/* TABLE */}
        <TabsContent value="HOME">
          <div className="rounded-xl border bg-background mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="italic text-muted-foreground w-12 text-center">
                    id
                  </TableHead>
                  <TableHead className="italic text-muted-foreground">
                    Title
                  </TableHead>
                  <TableHead className="italic text-muted-foreground">
                    Host
                  </TableHead>
                  <TableHead className="italic text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="italic text-muted-foreground w-20 text-center">
                    View
                  </TableHead>
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
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-sm text-gray-500"
                    >
                      No listing found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredListings.map((listing, index) => (
                    <TableRow key={listing.id}>
                      <TableCell className="text-center">{listing.id}</TableCell>
                      <TableCell className="font-medium">
                        {listing.title}
                      </TableCell>
                      <TableCell>
                        {listing.host?.full_name ?? "Unknown"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={listing.status} />
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <Eye className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="EXPERIENCE">
          <div className="rounded-xl border bg-background mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="italic text-muted-foreground w-12 text-center">
                    #
                  </TableHead>
                  <TableHead className="italic text-muted-foreground">
                    Title
                  </TableHead>
                  <TableHead className="italic text-muted-foreground">
                    Host
                  </TableHead>
                  <TableHead className="italic text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="italic text-muted-foreground w-20 text-center">
                    View
                  </TableHead>
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
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-sm text-gray-500"
                    >
                      No listing found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredListings.map((listing, index) => (
                    <TableRow key={listing.id}>
                      <TableCell className="text-center">{listing.id}</TableCell>
                      <TableCell className="font-medium">
                        {listing.title}
                      </TableCell>
                      <TableCell>
                        {listing.host?.full_name ?? "Unknown"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={listing.status} />
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <Eye className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* DETAIL MODAL */}
      {selectedListing && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start overflow-y-auto"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="bg-white w-full max-w-3xl mt-10 mb-10 p-6 rounded-xl relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4 pr-10">{selectedListing.title}</h2>

            {/* GALLERY */}
            {selectedListing.images && selectedListing.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {selectedListing.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    onClick={() => setPreviewImage(img.url)}
                    className="h-20 w-full object-cover rounded-md cursor-pointer hover:scale-105 transition shadow-sm"
                    alt="Listing gallery"
                  />
                ))}
              </div>
            )}

            {/* BASIC INFO */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Listing Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoItem label="Listing ID">{selectedListing.id}</InfoItem>
                <InfoItem label="Current Status">{selectedListing.status}</InfoItem>
                <InfoItem label="Host Representative">{selectedListing.host?.full_name}</InfoItem>
                <InfoItem label="Host Email">{selectedListing.host?.email}</InfoItem>
                <InfoItem label="Location Address">
                  {[
                    selectedListing.address_detail,
                    selectedListing.ward?.name,
                    selectedListing.district?.name,
                    selectedListing.province?.name,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </InfoItem>
                <InfoItem label="Registration Date">
                  {new Date(selectedListing.created_at).toLocaleString()}
                </InfoItem>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Description</h3>
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed text-slate-600">
                {selectedListing.description || "No description provided."}
              </div>
            </div>

            {/* HOME INFO */}
            {selectedListing.homes && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <InfoItem label="Units">{selectedListing.homes.quantity}</InfoItem>
                  <InfoItem label="Max Guests">{selectedListing.homes.max_guests}</InfoItem>
                  <InfoItem label="Beds">{selectedListing.homes.bed_count ?? 0}</InfoItem>
                  <InfoItem label="Baths">{selectedListing.homes.bath_count ?? 0}</InfoItem>
                  <InfoItem label="Area">{selectedListing.homes.room_size ?? 0} m²</InfoItem>
                  <InfoItem label="Weekday Price">${selectedListing.homes.price_weekday}</InfoItem>
                  <InfoItem label="Weekend Price">${selectedListing.homes.price_weekend}</InfoItem>
                </div>
              </div>
            )}

            {/* EXPERIENCE INFO */}
            {selectedListing.listing_type === "EXPERIENCE" && (
              <div className="mt-6 border-t pt-4 space-y-6">
                {fetchingExp ? (
                  <div className="text-center py-4 text-sm text-muted-foreground italic">
                    Loading experience details...
                  </div>
                ) : !selectedExperience ? (
                  <div className="text-center py-4 text-sm text-red-500 italic">
                    Experience details not found.
                  </div>
                ) : (
                  <div className="border rounded-xl p-5 bg-gray-50/50">
                    <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                      Experience Details
                      <Badge
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20"
                      >
                        ${selectedExperience.price_per_person.toLocaleString()}
                        /person
                      </Badge>
                    </h3>

                    <div className="space-y-6">
                      {/* ACTIVITIES */}
                      {selectedExperience.experience_activities &&
                        selectedExperience.experience_activities.length >
                          0 && (
                          <div>
                            <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                              Activities
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                              {selectedExperience.experience_activities
                                .sort(
                                  (
                                    a: ExperienceActivity,
                                    b: ExperienceActivity,
                                  ) => a.sort_order - b.sort_order,
                                )
                                .map((activity: ExperienceActivity) => (
                                  <div
                                    key={activity.id}
                                    className="flex gap-4 bg-white p-4 rounded-xl border shadow-sm"
                                  >
                                    {activity.image_url && (
                                      <img
                                        src={activity.image_url}
                                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                        alt={activity.title}
                                      />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="font-bold text-base text-gray-900">
                                        {activity.title}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                        {activity.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* SLOTS */}
                      {selectedExperience.experience_slots &&
                        selectedExperience.experience_slots.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                              Available Slots
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {selectedExperience.experience_slots.map(
                                (slot: ExperienceSlot) => (
                                  <div
                                    key={slot.id}
                                    className={`px-4 py-2.5 rounded-xl border text-sm flex flex-col items-center min-w-[120px] transition-all ${
                                      slot.is_active
                                        ? "bg-white border-primary/20 shadow-sm"
                                        : "bg-gray-100 opacity-60 grayscale"
                                    }`}
                                  >
                                    <span className="font-bold text-primary">
                                      {formatSlotTime(slot.start_time)} -{" "}
                                      {formatSlotTime(slot.end_time)}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                      Max {slot.max_attendees} guests
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AMENITIES */}
            {selectedListing.listing_amenities && selectedListing.listing_amenities.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-base mb-3 text-gray-800">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.listing_amenities.map((item) => (
                    <Badge
                      key={item.amenity.id}
                      variant="secondary"
                      className="px-3 py-1 font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
                    >
                      {item.amenity.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* RULES */}
            {selectedListing.listing_rules && selectedListing.listing_rules.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-base mb-3 text-gray-800">House Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedListing.listing_rules.map((item) => (
                    <div
                      key={item.rule.id}
                      className="flex items-start gap-3 bg-muted/40 p-3 rounded-xl border border-muted"
                    >
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item.rule.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEES */}
            {selectedListing.fees && selectedListing.fees.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-base mb-3 text-gray-800">Extra Fees</h3>
                <div className="space-y-2">
                  {selectedListing.fees.map((fee) => (
                    <div
                      key={fee.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100"
                    >
                      <span className="text-sm font-medium text-gray-700">{fee.title}</span>
                      <span className="text-sm font-bold text-primary">${fee.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-8 pt-6 border-t">
              {selectedListing.status === "PENDING" && (
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                    onClick={() => handleUpdateStatus(selectedListing.id, "ACTIVE")}
                  >
                    Approve Listing
                  </Button>
                  <Button
                    className="flex-1 shadow-lg shadow-red-100"
                    variant="destructive"
                    onClick={() => handleUpdateStatus(selectedListing.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {(selectedListing.status === "ACTIVE" || selectedListing.status === "HIDDEN") && (
                <div className="flex gap-4">
                  <Button
                    variant="destructive"
                    className="flex-1 shadow-lg shadow-red-100"
                    onClick={() => setShowBanModal(true)}
                  >
                    Ban Listing
                  </Button>
                </div>
              )}

              {selectedListing.status === "REJECTED" && (
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleUpdateStatus(selectedListing.id, "ACTIVE")}
                  >
                    Review & Approve
                  </Button>
                </div>
              )}

              {selectedListing.status === "BANNED" && (
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
                    onClick={() => {
                      if (confirm("Are you sure you want to unban this listing?")) {
                        handleUnban(selectedListing.id);
                      }
                    }}
                  >
                    Unban Listing
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BAN MODAL */}
      {showBanModal && selectedListing && (
        <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-[420px] shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Ban Listing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for banning this listing. This will be sent to the host.
            </p>
            <textarea
              placeholder="e.g., Inappropriate content, violating terms..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
              rows={4}
            />
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 py-6 rounded-xl"
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 py-6 rounded-xl shadow-lg shadow-red-100"
                onClick={() => handleBanListing(selectedListing.id)}
              >
                Confirm Ban
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW FULLSCREEN */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-8 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
          <img
            src={previewImage}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ListingStatus }) {
  let style = "";
  if (status === "ACTIVE") style = "bg-green-100 text-green-700 border-green-200";
  else if (status === "PENDING") style = "bg-yellow-100 text-yellow-700 border-yellow-200";
  else if (status === "HIDDEN") style = "bg-gray-100 text-gray-600 border-gray-200";
  else if (status === "BANNED") style = "bg-red-100 text-red-700 border-red-200";
  else if (status === "REJECTED") style = "bg-orange-100 text-orange-700 border-orange-200";

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-bold uppercase rounded-full w-24 py-1 flex justify-center border-2 ${style}`}
    >
      {status}
    </Badge>
  );
}

function InfoItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
      <div className="font-semibold text-gray-800 break-words whitespace-pre-wrap leading-snug">{children || "—"}</div>
    </div>
  );
}
