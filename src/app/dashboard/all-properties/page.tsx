"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import {
  BedDouble,
  Bath,
  MapPin,
  BadgeDollarSign,
  Trash2,
  Pencil,
} from "lucide-react";

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
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
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

  const fetchProperties = async () => {
    try {
      const res = await axiosInstance.get("/admin/properties");
      setProperties(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const deleteProperty = async (id: string) => {
    const ok = confirm("Delete this property?");

    if (!ok) return;

    try {
      await axiosInstance.delete(`/admin/properties/${id}`);

      setProperties((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  const updateStatus = async (
    id: string,
    status: "AVAILABLE" | "UNAVAILABLE" | "RENTED"
  ) => {
    try {
      await axiosInstance.patch(`/admin/properties/${id}`, {
        status,
      });

      setProperties((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[420px] rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-3xl font-bold">
          No Properties Found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Manage Properties
          </h1>

          <p className="text-gray-500 mt-2">
            Total Properties : {properties.length}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <div className="relative h-60">
              <Image
                src={
                  property.images?.[0] ||
                  "/placeholder.jpg"
                }
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">

              <div className="flex justify-between items-start mb-4">

                <div>
                  <h2 className="text-xl font-bold">
                    {property.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {property.category?.name}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    property.status === "AVAILABLE"
                      ? "bg-green-100 text-green-700"
                      : property.status === "RENTED"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {property.status}
                </span>
              </div>

              <p className="text-gray-600 line-clamp-2 mb-5">
                {property.description}
              </p>

              <div className="space-y-3 text-sm">

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  {property.location}
                </div>

                <div className="flex items-center gap-2">
                  <BadgeDollarSign size={18} />
                  ${property.price}
                </div>

                <div className="flex gap-6">

                  <div className="flex items-center gap-2">
                    <BedDouble size={18} />
                    {property.bedrooms}
                  </div>

                  <div className="flex items-center gap-2">
                    <Bath size={18} />
                    {property.bathrooms}
                  </div>

                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {property.amenities.map((item) => (
                    <span
                      key={item}
                      className="bg-gray-100 px-3 py-1 rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-5">
                  Added :
                  {" "}
                  {new Date(
                    property.createdAt
                  ).toLocaleDateString()}
                </p>

                <div className="mt-6 space-y-3">

                  <select
                    value={property.status}
                    onChange={(e) =>
                      updateStatus(
                        property.id,
                        e.target.value as
                          | "AVAILABLE"
                          | "RENTED"
                          | "UNAVAILABLE"
                      )
                    }
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="AVAILABLE">
                      AVAILABLE
                    </option>

                    <option value="RENTED">
                      RENTED
                    </option>

                    <option value="UNAVAILABLE">
                      UNAVAILABLE
                    </option>
                  </select>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 flex justify-center items-center gap-2"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProperty(property.id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 flex justify-center items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}