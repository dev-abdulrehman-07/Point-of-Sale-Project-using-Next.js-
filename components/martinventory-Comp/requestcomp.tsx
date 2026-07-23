"use client";
import { Mailbox, PackagePlus, RotateCcw, Search, User } from "lucide-react";
import { Requests, useGetrequestsQuery } from "@/lib/store/Api-Hooks/main.api";
import { useState } from "react";

export default function Requestcomp() {
  const [search, setsearch] = useState<string>("");
  const { data, isLoading, error } = useGetrequestsQuery();

  const finalRequestsArray = Array.isArray(data)
    ? data
    : (data as any)?.requests || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-red-500 text-xl font-medium">
          Error: {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      </div>
    );
  }

  if (!finalRequestsArray || finalRequestsArray.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-[#ccff66] text-2xl font-bold">No Requests</div>
      </div>
    );
  }

  const filteredRequests = finalRequestsArray.filter((value: Partial<Requests>) => {
    if (!search.trim()) return true;
    return (
      value.from?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      value.from?.role?.toLowerCase().includes(search.toLowerCase()) ||
      value.subject?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50/50 min-h-screen">

      <div className="relative flex items-center gap-2 max-w-md mb-8">
        <Search size={18} className="absolute left-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search by name, role, or subject..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-lime-400 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all text-sm shadow-sm"
        />
        <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:border-lime-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all text-sm font-medium shadow-sm">
          Search
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500 py-12 border border-dashed border-gray-200 rounded-2xl bg-white shadow-sm">
          No matching requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {filteredRequests.map((value: Partial<Requests>) => (
            <div
              key={value._id}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-5">

                <label className="block text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">
                  Request From <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center mb-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <User className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-800 text-sm block truncate">{value.from?.fullname || "N/A"}</span>
                    <span className="text-xs text-gray-400 block truncate">{value.from?.role || "No Role"}</span>
                  </div>
                </div>


                <label className="block text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-start mb-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <Mailbox className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-gray-700 text-sm font-medium flex-1 min-w-0 whitespace-normal break-words overflow-visible">
                    {value.subject} 
                  </div>
                </div>

                <label className="block text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm whitespace-pre-wrap min-h-[90px] max-h-[150px] overflow-y-auto leading-relaxed">
                  {value.message}
                </div>
              </div>

              <hr className="border-gray-100 mb-4" />

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-xs w-full shadow-sm">
                  <RotateCcw className="w-4 h-4" />
                  Reject
                </button>

                <button className="flex items-center justify-center gap-2 py-2.5 bg-[#E2F7A1] text-gray-800 font-bold rounded-xl hover:bg-[#ccff66] transition-all text-xs w-full shadow-sm">
                  <PackagePlus className="w-4 h-4" />
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}