"use client";
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import {
  viewHostRequestDetail,
  viewAllBecomeHostRequest,
} from "@/src/services/host/getHostRequest.service";
import Avatar from "@/src/components/common/Avatars";
import { PhoneCall, Mail, IdCard } from "lucide-react";
import { approveOrRejectHostRequest } from "@/src/services/host/approveOrRejectRequest.service";
import { allowUserToResubmit } from "@/src/services/host/allowResubmit";
import toast from "react-hot-toast";

const Page = () => {
  const [request, setRequest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [prosessing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await viewAllBecomeHostRequest();
        setRequest(data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, []);

  const handleViewDetailRequest = async (requestId: string) => {
    try {
      const selectedData = await viewHostRequestDetail(requestId);
      setSelectedRequest(selectedData);
      setOpen(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAction = async (action: "approved" | "rejected") => {
    if (!selectedRequest) return;

    try {
      setProcessing(true);

      await approveOrRejectHostRequest(
        selectedRequest.id,
        selectedRequest.user_id,
        action,
      );

      setRequest((prev) =>
        prev.map((item) =>
          item.id === selectedRequest.id ? { ...item, status: action } : item,
        ),
      );

      toast.success(
        action === "approved"
          ? "Request approved successfully!"
          : "Request rejected successfully!",
      );

      setOpen(false);
    } catch (error: any) {
      toast.error("Something went wrong!", error);
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAllowResubmit = async (action: "resubmit") => {
    if (!selectedRequest) return;
    try {
      setProcessing(true);

      await allowUserToResubmit(
        action,
        selectedRequest.id,
        selectedRequest.user_id,
      );

      setRequest((prev) =>
        prev.map((item) =>
          item.id === selectedRequest.id ? { ...item, status: action } : item,
        ),
      );
      setOpen(false);
      toast.success("Allow User to Resubmit Successfully!");
    } catch (error: any) {
      toast.error(error);
    }
  };

  if (request.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Icon */}
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#E8F5E9] mb-6 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-[#67AE6E]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10l9-7 9 7v9a2 2 0 01-2 2h-4a2 2 0 01-2-2V14H9v5a2 2 0 01-2 2H3v-9z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          No hosting requests yet
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 max-w-md mb-6">
          When guests send booking requests, they will appear here. Start
          listing your homestay to receive your first booking.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          </div>

          {/* Text */}
          <p className="text-sm font-medium text-gray-600 tracking-wide">
            Loading requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Hosts</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 text-left">
            <tr className="text-sm text-gray-600">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Avatar</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Front Identity Card</th>
              <th className="px-4 py-3">Back Identity Card</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {request.map((items, index) => (
              <tr key={items.id} className="border-t text-sm">
                <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                <td className="px-3 py-4">
                  <Avatar
                    avatarUrl={items.profiles?.avatar_url}
                    email={items.profiles?.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td className="px-4 py-3 text-black text-sm font-bold">
                  {items.profiles?.full_name}
                </td>
                <td className="px-4 py-3">
                  <img
                    src={items.identity_card_front_url}
                    onClick={() =>
                      setPreviewImage(items.identity_card_front_url)
                    }
                    className="w-20 h-12 rounded-lg object-cover cursor-pointer hover:scale-105 transition-all duration-300"
                  />
                </td>

                <td className="px-4 py-3">
                  <img
                    src={items.identity_card_back_url}
                    onClick={() =>
                      setPreviewImage(items.identity_card_back_url)
                    }
                    className="w-20 h-12 rounded-lg object-cover cursor-pointer hover:scale-105 transition-all duration-300"
                  />
                </td>

                <td className="px-4 py-3">
                  {items.status === "pending" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      PENDING
                    </span>
                  )}

                  {items.status === "approved" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      APPROVED
                    </span>
                  )}

                  {items.status === "rejected" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      REJECTED
                    </span>
                  )}
                  {items.status === "request_again" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      REQUEST
                    </span>
                  )}
                  {items.status === "resubmit" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      RESUBMIT
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleViewDetailRequest(items.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    {" "}
                    <Eye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {open && selectedRequest && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-4">
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
              {/* Header gradient */}
              <div className="h-28 bg-gradient-to-br from-emerald-500 to-teal-400 relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <Avatar
                    avatarUrl={selectedRequest.profiles?.avatar_url}
                    email={selectedRequest.profiles?.full_name}
                    className="w-25 h-25 text-5xl rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 px-6 pb-6 text-center">
                <h2 className="text-2xl font-semibold text-black">
                  {selectedRequest.profiles?.full_name}
                </h2>

                <p className="mt-1 text-sm text-gray-500 italic">
                  {selectedRequest.profiles?.bio || "Homestay host"}
                </p>

                {/* Divider */}
                <div className="my-5 h-px bg-gray-200" />
                {/* Info cards */}
                <div className="space-y-3 text-left">
                  {/* Phone */}
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow-md transition">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <PhoneCall size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        Phone
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedRequest.profiles?.phone}
                      </span>
                    </div>
                  </div>

                  {/* Identity card */}
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow-md transition">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <IdCard size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        Identity Card
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedRequest.profiles?.identity_card}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow-md transition">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Mail size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        Email
                      </span>
                      <span className="text-sm font-medium text-gray-900 break-all">
                        {selectedRequest.profiles?.email}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedRequest.status === "pending" && (
                  <>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-black font-bold">ACTION</span>
                      <div className="flex-1 h-px bg-black"></div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleAction("approved")}
                        className="flex-1 rounded-2xl cursor-pointer bg-green-400 hover:bg-green-500 transition text-white py-3 font-medium"
                      >
                        {prosessing ? "Processing..." : "Approve"}
                      </button>

                      <button
                        onClick={() => handleAction("rejected")}
                        className="flex-1 rounded-2xl cursor-pointer bg-red-400 hover:bg-red-500 transition text-white py-3 font-medium"
                      >
                        {prosessing ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </>
                )}
                {selectedRequest.status === "request_again" && (
                  <>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-black font-bold">ACTION</span>
                      <div className="flex-1 h-px bg-black"></div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleAllowResubmit("resubmit")}
                        className="flex-1 rounded-2xl cursor-pointer bg-green-400 hover:bg-green-500 transition text-white py-3 font-medium"
                      >
                        {prosessing ? "Processing..." : "Allow Resubmit"}
                      </button>
                    </div>
                  </>
                )}
                {/* Action */}
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 hover:opacity-90 transition text-white py-3 font-medium tracking-wide"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {previewImage && (
          <div
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
