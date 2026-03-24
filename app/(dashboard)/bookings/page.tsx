"use client";
import { useEffect, useState } from "react";
import { Eye, X, Clock } from "lucide-react";
import { getAllBookings, BookingWithDetails } from "@/src/services/booking/getAllBookings";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { getAllBookingLogs } from "@/src/services/booking/getBookingLogs";
import { BookingLog } from "@/src/types/booking-log";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [bookingLogs, setBookingLogs] = useState<BookingLog[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (activeTab === "LOGS") {
      loadBookingLogs();
    }
  }, [activeTab]);

  async function loadBookings() {
    setLoading(true);
    const data = await getAllBookings();
    setBookings(data);
    setLoading(false);
  }

  async function loadBookingLogs() {
    setLoading(true);
    const data = await getAllBookingLogs();
    setBookingLogs(data);
    setLoading(false);
  }

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "LOGS") return false; // Bookings table shouldn't show in LOGS tab
    const matchesTab = activeTab === "ALL" || b.status === activeTab;
    const searchLower = search.toLowerCase();
    const matchesSearch = b.id.toString().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const filteredLogs = bookingLogs.filter((log) => {
    return (
      log.booking_id.toString().includes(search.toLowerCase()) ||
      log.id.toString().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Bookings Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
             <TabsList className="bg-white border p-1 rounded-xl h-auto">
                <TabsTrigger value="ALL" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="PENDING" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Pending</TabsTrigger>
                <TabsTrigger value="CONFIRMED" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Confirmed</TabsTrigger>
                <TabsTrigger value="COMPLETED" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Completed</TabsTrigger>
                <TabsTrigger value="CANCELLED" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Cancelled</TabsTrigger>
                <TabsTrigger value="LOGS" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-[#11009E] data-[state=active]:text-white">Logs</TabsTrigger>
             </TabsList>

             <div className="relative w-full md:w-80">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID..."
                  className="rounded-xl bg-white pl-4 h-10 border-slate-200 shadow-sm"
                />
             </div>
           </div>

           <TabsContent value={activeTab === "LOGS" ? "LOGS-INACTIVE" : activeTab} className="mt-0">
             {/* This is the regular bookings table */}
             <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead className="w-16 italic text-muted-foreground">#</TableHead>
                     <TableHead className="italic text-muted-foreground">Guest</TableHead>
                     <TableHead className="italic text-muted-foreground">Listing</TableHead>
                     <TableHead className="italic text-muted-foreground">Amount</TableHead>
                     <TableHead className="italic text-muted-foreground">Payment</TableHead>
                     <TableHead className="italic text-muted-foreground">Status</TableHead>
                     <TableHead className="w-20 text-center italic text-muted-foreground">View</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {loading ? (
                     <TableRow><TableCell colSpan={7} className="text-center py-10">Loading...</TableCell></TableRow>
                   ) : filteredBookings.length === 0 ? (
                     <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-500 font-medium">No bookings found.</TableCell></TableRow>
                   ) : (
                     filteredBookings.map((booking) => (
                       <TableRow key={booking.id} className="hover:bg-slate-50 transition-colors">
                         <TableCell>{booking.id}</TableCell>
                         <TableCell>
                           <div className="font-semibold text-slate-900 text-sm">{booking.guest_name || "Unknown"}</div>
                         </TableCell>
                         <TableCell>
                           <div className="max-w-[200px] truncate text-sm" title={booking.listing_title || "Unknown"}>
                             {booking.listing_title ?? "Unknown"}
                           </div>
                         </TableCell>
                         <TableCell className="text-sm font-medium">${booking.total_price?.toLocaleString() ?? 0}</TableCell>
                         <TableCell>
                           <StatusBadge status={booking.payment_status} type="payment" />
                         </TableCell>
                         <TableCell>
                           <StatusBadge status={booking.status} type="booking" />
                         </TableCell>
                          <TableCell className="text-center">
                            <button onClick={() => setSelectedBooking(booking)} className="p-2 hover:bg-muted rounded-md transition-colors">
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

            <TabsContent value="LOGS" className="mt-0">
              <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 italic text-muted-foreground"># LOG</TableHead>
                      <TableHead className="italic text-muted-foreground w-32">Booking ID</TableHead>
                      <TableHead className="italic text-muted-foreground">Booking Status</TableHead>
                      <TableHead className="italic text-muted-foreground">Payment Status</TableHead>
                      <TableHead className="italic text-muted-foreground">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-10">Loading...</TableCell></TableRow>
                    ) : filteredLogs.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-500 font-medium">No logs found.</TableCell></TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-semibold text-[#11009E]">#{log.id}</TableCell>
                          <TableCell className="font-medium">#{log.booking_id}</TableCell>
                          <TableCell>
                            <StatusBadge status={log.status} type="booking" />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={log.payment_status} type="payment" />
                          </TableCell>
                          <TableCell className="text-sm font-bold text-[#11009E]">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#11009E]" />
                              {log.created_at ? new Date(log.created_at).toLocaleString('vi-VN') : "N/A"}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
        </Tabs>
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start overflow-y-auto py-10" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white w-full max-w-3xl mx-4 rounded-2xl relative shadow-2xl p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Booking Details #{selectedBooking.id}</h2>

            <div className="flex gap-2 items-center mb-8 pb-6 border-b">
              <StatusBadge status={selectedBooking.status} type="booking" />
              <StatusBadge status={selectedBooking.payment_status} type="payment" />
              <div className="ml-auto text-xs text-slate-400">Created: {new Date(selectedBooking.created_at).toLocaleString()}</div>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Client Name">{selectedBooking.guest_name || "Unknown"}</InfoItem>
                  <InfoItem label="Email Address">{selectedBooking.guest_email || "N/A"}</InfoItem>
                  <InfoItem label="Phone Number">{selectedBooking.guest_phone || "N/A"}</InfoItem>
                  <InfoItem label="Account ID">{selectedBooking.user_id}</InfoItem>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Reservation & Host</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <InfoItem label="Property">{selectedBooking.listing_title || `Listing #${selectedBooking.listing_id}`}</InfoItem>
                  <InfoItem label="Total Amount">${selectedBooking.total_price?.toLocaleString() ?? 0}</InfoItem>
                  <InfoItem label="Host Name">{selectedBooking.host_name || "N/A"}</InfoItem>
                  <InfoItem label="Host Phone">{selectedBooking.host_phone || "N/A"}</InfoItem>
                  <InfoItem label="Check-In">
                    {selectedBooking.check_in_date ? new Date(selectedBooking.check_in_date).toLocaleDateString() : "N/A"}
                  </InfoItem>
                  <InfoItem label="Check-Out">
                    {selectedBooking.check_out_date ? new Date(selectedBooking.check_out_date).toLocaleDateString() : "N/A"}
                  </InfoItem>
                </div>
              </section>
            </div>

            <div className="mt-10 pt-6 border-t">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold" onClick={() => setSelectedBooking(null)}>Dismiss View</Button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL (Booking Details) */}
    </div>
  );
}

function StatusBadge({ status, type }: { status: string; type: "booking" | "payment" }) {
  let style = "";
  const upperStatus = status?.toUpperCase() || "";

  if (type === "booking") {
    if (upperStatus === "CONFIRMED" || upperStatus === "COMPLETED")
      style = "bg-green-100 text-green-700 border-green-200";
    else if (upperStatus === "PENDING")
      style = "bg-yellow-100 text-yellow-700 border-yellow-200";
    else if (upperStatus === "CANCELLED")
      style = "bg-red-100 text-red-700 border-red-200";
    else
      style = "bg-gray-100 text-gray-600 border-gray-200";
  } else {
    if (upperStatus === "PAID")
      style = "bg-emerald-100 text-emerald-700 border-emerald-200";
    else if (upperStatus === "PENDING")
      style = "bg-orange-100 text-orange-700 border-orange-200";
    else if (upperStatus === "REFUNDED")
      style = "bg-gray-100 text-gray-700 border-gray-300";
    else
      style = "bg-slate-100 text-slate-600 border-slate-200";
  }

  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-medium uppercase rounded-full w-[85px] py-0.5 flex justify-center ${style}`}
    >
      {type === "payment" ? `${upperStatus}` : upperStatus}
    </Badge>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted p-3 rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-medium break-words whitespace-pre-wrap">{children}</p>
    </div>
  );
}
