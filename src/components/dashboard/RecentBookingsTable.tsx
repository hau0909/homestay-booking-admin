import React from "react";
import Link from "next/link";
import { RecentBooking } from "@/src/services/dashboard/getDashboardStats";

interface RecentBookingsTableProps {
  bookings: RecentBooking[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Confirmed</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Completed</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Paid</span>;
      case "PENDING":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-600 border border-amber-200">Pending</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-50 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Recent Bookings</h2>
        <Link href="/bookings" className="text-sm font-medium text-[#11009E] hover:underline">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 font-medium">Guest & Listing</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Payment</th>
              <th className="px-6 py-4 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No recent bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{booking.guest_name}</p>
                    <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[200px]">{booking.listing_title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-700">{formatDate(booking.check_in_date)}</p>
                    <p className="text-slate-400 text-xs mt-0.5">to {formatDate(booking.check_out_date)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentBadge(booking.payment_status)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    ${booking.total_price.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
