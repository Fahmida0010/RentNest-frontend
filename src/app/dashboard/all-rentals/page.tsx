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
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleUpdateStatus = async (rentalId: string, newStatus: string) => {
    try {
      setUpdatingId(rentalId);
      setError("");
      // Assuming backend route is PATCH /admin/rentals/:id
      const response = await axiosInstance.patch(`/admin/rentals/${rentalId}`, {
        status: newStatus,
      });

      if (response.data?.success) {
        setRentals((prev) =>
          prev.map((rental) =>
            rental.id === rentalId ? { ...rental, status: newStatus as any } : rental
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
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
          <p className="text-xs md:text-sm text-slate-500">Track and update tenant application statuses.</p>
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
              <th>Current Status</th>
              <th className="text-right">Change Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rentals.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">No requests found.</td>
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
                  <td>
                    <span className={`badge badge-sm font-medium ${
                      rental.status === "APPROVED" || rental.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                      rental.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    } border-none`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <select
                      value={rental.status}
                      disabled={updatingId === rental.id}
                      onChange={(e) => handleUpdateStatus(rental.id, e.target.value)}
                      className="select select-bordered select-sm rounded-lg text-xs bg-white text-slate-800 focus:outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
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
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{rental.property?.title}</h3>
                  <p className="text-xs text-slate-500">${rental.property?.price} / month</p>
                </div>
                {updatingId === rental.id ? (
                  <span className="loading loading-spinner loading-xs text-blue-600"></span>
                ) : (
                  <span className={`badge badge-sm ${rental.status === "APPROVED" || rental.status === "ACTIVE" ? "bg-green-100 text-green-700" : rental.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"} border-none`}>
                    {rental.status}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Tenant:</strong> {rental.tenant?.name} ({rental.tenant?.email})</p>
                <p><strong>Move-in:</strong> {new Date(rental.moveInDate).toLocaleDateString()}</p>
                <p><strong>Payment Status:</strong> {rental.payment ? "Paid ✅" : "Unpaid ❌"}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Update Request Status</label>
                <select
                  value={rental.status}
                  disabled={updatingId === rental.id}
                  onChange={(e) => handleUpdateStatus(rental.id, e.target.value)}
                  className="select select-bordered select-sm w-full rounded-xl text-xs bg-white text-slate-800"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}