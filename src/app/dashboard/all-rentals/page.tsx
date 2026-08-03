"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

interface Tenant {
  id: string;
  name: string;
  email: string;
}

interface PropertyInfo {
  id: string;
  title: string;
  location: string;
  price: number;
}

interface RentalRequest {
  id: string;
  moveInDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
  tenant: Tenant;
  property: PropertyInfo;
  payment: any | null;
}

export default function AllRentalRequests() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/rentals");
      if (response.data?.success) {
        setRentals(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  // স্ট্যাটাস কালার জেনারেট করার হেল্পার ফাংশন
  const getStatusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "ACTIVE":
      case "COMPLETED":
        return "bg-green-100 text-green-700 border border-green-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "REJECTED":
      default:
        return "bg-red-100 text-red-700 border border-red-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Rental Requests</h1>
          <p className="text-xs md:text-sm text-slate-500">Track and view tenant application statuses.</p>
        </div>
        <span className="badge badge-neutral mt-2 sm:mt-0 font-semibold">{rentals.length} Applications</span>
      </div>

      {error && (
        <div className="alert alert-error mb-4 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Desktop view Table */}
      <div className="overflow-x-auto w-full hidden lg:block">
        <table className="table w-full text-slate-800">
          <thead className="bg-slate-50 text-slate-700 font-semibold text-sm">
            <tr>
              <th>Property / Price</th>
              <th>Tenant</th>
              <th>Move-in Date</th>
              <th>Payment Info</th>
              <th className="text-right">Application Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rentals.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">No requests found.</td>
              </tr>
            ) : (
              rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50/50 transition-colors">
                  <td>
                    <div className="font-semibold text-slate-900">{rental.property?.title}</div>
                    <div className="text-xs text-slate-400">{rental.property?.location} • ${rental.property?.price}</div>
                  </td>
                  <td>
                    <div className="text-sm font-medium">{rental.tenant?.name}</div>
                    <div className="text-xs text-slate-400">{rental.tenant?.email}</div>
                  </td>
                  <td className="text-sm">{new Date(rental.moveInDate).toLocaleDateString()}</td>
                  <td>
                    {rental.payment ? (
                      <div>
                        <span className="badge badge-xs badge-success text-white border-none px-1.5 py-1">Paid</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{rental.payment.transactionId}</div>
                      </div>
                    ) : (
                      <span className="badge badge-xs badge-warning border-none px-1.5 py-1">Unpaid</span>
                    )}
                  </td>
                  <td className="text-right">
                    <span className={`badge badge-sm font-bold uppercase tracking-wider px-2.5 py-2.5 rounded-full ${getStatusClass(rental.status)}`}>
                      {rental.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile and Tablet view Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {rentals.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No requests found.</div>
        ) : (
          rentals.map((rental) => (
            <div key={rental.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{rental.property?.title}</h3>
                  <p className="text-xs text-slate-500">${rental.property?.price} / month</p>
                </div>
                <span className={`badge badge-sm font-bold uppercase tracking-wider shrink-0 px-2 py-2 rounded-full ${getStatusClass(rental.status)}`}>
                  {rental.status}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                <p><strong className="text-slate-700">Tenant:</strong> {rental.tenant?.name} <span className="text-slate-400">({rental.tenant?.email})</span></p>
                <p><strong className="text-slate-700">Move-in:</strong> {new Date(rental.moveInDate).toLocaleDateString()}</p>
                <p>
                  <strong className="text-slate-700">Payment:</strong>{" "}
                  {rental.payment ? (
                    <span className="text-green-600 font-medium">Paid ({rental.payment.transactionId})</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Unpaid</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}