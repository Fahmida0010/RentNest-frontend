"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  BedDouble,
  Bath,
  MapPin,
  BadgeDollarSign,
  Trash2,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: "AVAILABLE" | "RENTED"; // UNAVAILABLE রিমুভ করা হয়েছে
  createdAt: string;

  category: {
    id: string;
    name: string;
  };

  landlord: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // প্রপার্টিজ নিয়ে আসার ফাংশন
  const fetchProperties = async () => {
    try {
      const res = await axiosInstance.get("/admin/properties");
      setProperties(res.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error fetching data",
        text: "Could not load properties from server.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Swal কনফার্মেশন সহ ডিলিট ফাংশন
  const deleteProperty = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this property listing!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/admin/properties/${id}`);
          setProperties((prev) => prev.filter((item) => item.id !== id));
          
          Swal.fire({
            title: "Deleted!",
            text: "Property has been deleted safely.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err: any) {
          console.error("Delete Error:", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err?.response?.data?.message || "Delete Failed. Try again later.",
          });
        }
      }
    });
  };

  // Swal কনফার্মেশন সহ স্ট্যাটাস আপডেট করার ফাংশন
  const updateStatus = async (
    id: string,
    currentProperty: Property,
    newStatus: "AVAILABLE" | "RENTED"
  ) => {
    Swal.fire({
      title: "Change Status?",
      text: `Do you want to change the status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/admin/properties/${id}`, {
            status: newStatus,
          });

          setProperties((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: newStatus } : item
            )
          );

          Swal.fire({
            title: "Updated!",
            text: `Status is now ${newStatus}.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err: any) {
          console.error("Status Update Error:", err);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: err?.response?.data?.message || "Failed to update status.",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-5 max-w-7xl mx-auto">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[450px] rounded-2xl bg-gray-200 animate-pulse w-full"
          />
        ))}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="py-32 text-center px-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">
          No Properties Found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Manage Properties
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Total Properties: <span className="font-semibold text-slate-800">{properties.length}</span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
          >
            {/* ইমেজ সেকশন */}
            <div className="relative h-56 sm:h-60 w-full shrink-0 bg-slate-100">
              <Image
                src={property.images?.[0] || "/placeholder.jpg"}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-w-7xl) 100vw, 33vw"
              />
            </div>

            {/* কন্টেন্ট সেকশন */}
            <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {property.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      {property.category?.name}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold shrink-0 uppercase tracking-wider
                    ${
                      property.status === "AVAILABLE"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {property.description}
                </p>

                {/* ইনফো ও অ্যামেনিটিজ */}
                <div className="space-y-2.5 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <BadgeDollarSign size={16} className="text-slate-400 shrink-0" />
                    ${property.price}
                  </div>

                  <div className="flex gap-4 pt-1">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <BedDouble size={16} className="text-slate-500" />
                      <span className="text-xs font-medium">{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Bath size={16} className="text-slate-500" />
                      <span className="text-xs font-medium">{property.bathrooms} Baths</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {property.amenities.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="text-slate-400 text-xs self-center ml-1">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* অ্যাকশন বাটন এবং সিলেক্ট বক্স */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Change Status</label>
                  <select
                    value={property.status}
                    onChange={(e) =>
                      updateStatus(
                        property.id,
                        property,
                        e.target.value as "AVAILABLE" | "RENTED"
                      )
                    }
                    className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-950 transition"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RENTED">RENTED</option>
                  </select>
                </div>

                <button
                  onClick={() => deleteProperty(property.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-2.5 flex justify-center items-center gap-2 shadow-sm transition-all duration-200"
                >
                  <Trash2 size={16} />
                  Delete Property
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}