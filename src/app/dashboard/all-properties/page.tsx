"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: "AVAILABLE" | "RENTED";
  category: { name: string };
  landlord: Landlord;
}

export default function AllProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/properties");
      if (response.data?.success) {
        setProperties(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      setDeleteLoadingId(propertyId);
      // assuming your backend has a DELETE route under /admin/properties/:id
      const response = await axiosInstance.delete(`/admin/properties/${propertyId}`);
      if (response.data?.success) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete property.");
    } finally {
      setDeleteLoadingId(null);
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">All Properties</h1>
          <p className="text-xs md:text-sm text-slate-500">Overview and management of all property listings.</p>
        </div>
        <span className="badge badge-neutral mt-2 sm:mt-0 font-semibold">{properties.length} Listings</span>
      </div>

      {error && (
        <div className="alert alert-error mb-4 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Responsive Table wrapper & Mobile Grid View */}
      <div className="overflow-x-auto w-full hidden md:block">
        <table className="table w-full text-slate-800">
          <thead className="bg-slate-50 text-slate-700 font-semibold text-sm">
            <tr>
              <th>Title / Category</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Landlord</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">No properties found.</td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                  <td>
                    <div className="font-semibold text-slate-900">{property.title}</div>
                    <div className="text-xs text-slate-400">{property.category?.name}</div>
                  </td>
                  <td className="text-sm">{property.location}</td>
                  <td className="font-medium">${property.price}</td>
                  <td>
                    <span className={`badge text-xs ${property.status === "AVAILABLE" ? "badge-success bg-emerald-100 text-emerald-700 border-none" : "badge-ghost bg-slate-100 text-slate-600 border-none"}`}>
                      {property.status}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm font-medium">{property.landlord?.name}</div>
                    <div className="text-xs text-slate-400">{property.landlord?.email}</div>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={deleteLoadingId === property.id}
                      className="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded-xl border-none"
                    >
                      {deleteLoadingId === property.id ? <span className="loading loading-spinner loading-xs"></span> : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view Layout (cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {properties.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No properties found.</div>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{property.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-200 rounded-md text-slate-700">{property.category?.name}</span>
                </div>
                <span className={`badge badge-sm ${property.status === "AVAILABLE" ? "badge-success bg-emerald-100 text-emerald-700 border-none" : "badge-ghost bg-slate-100 text-slate-600 border-none"}`}>
                  {property.status}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Location:</strong> {property.location}</p>
                <p><strong>Price:</strong> ${property.price}</p>
                <p><strong>Landlord:</strong> {property.landlord?.name} ({property.landlord?.email})</p>
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  disabled={deleteLoadingId === property.id}
                  className="btn btn-sm w-full bg-red-500 hover:bg-red-600 text-white rounded-xl border-none"
                >
                  {deleteLoadingId === property.id ? <span className="loading loading-spinner loading-xs"></span> : "Delete Property"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}