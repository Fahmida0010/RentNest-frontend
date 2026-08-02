"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Search, 
  SlidersHorizontal, 
  Home, 
  ArrowRight 
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Category {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  status: "AVAILABLE" | "RENTED";
  category: {
    name: string;
  };
}

export default function PropertiesMainPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(60000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // axiosInstance ব্যবহার করে রিকোয়েস্ট (baseURL অলরেডি সেট করা আছে)
        const [resProps, resCats] = await Promise.all([
          axiosInstance.get("/properties"),
          axiosInstance.get("/categories")
        ]);

        // Axios সরাসরি response.data-তে ব্যাকএন্ডের রেসপন্স দিয়ে দেয়
        setProperties(resProps.data?.data || []);
        setCategories(resCats.data?.data || []);
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || property.category?.name === selectedCategory;
    const matchesPrice = property.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">Browse Properties</h1>
          <p className="text-base-content/60 text-sm">Find premium spaces verified across the platform.</p>
        </div>

        {/* Filters */}
        <div className="bg-base-100 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-300 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="form-control w-full">
            <label className="label font-bold text-xs uppercase text-base-content/60"><Search className="w-3.5 h-3.5" /> Filter Keyword</label>
            <input 
              type="text" 
              placeholder="Search location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full rounded-xl bg-base-200 focus:outline-primary"
            />
          </div>

          <div className="form-control w-full">
            <label className="label font-bold text-xs uppercase text-base-content/60"><SlidersHorizontal className="w-3.5 h-3.5" /> Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered w-full rounded-xl bg-base-200 focus:outline-primary text-base-content"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <div className="flex justify-between label font-bold text-xs uppercase text-base-content/60">
              <span>Max Budget</span>
              <span className="text-primary font-black">৳{maxPrice.toLocaleString()}</span>
            </div>
            <input 
              type="range" min="5000" max="150000" step="1000" value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range range-primary range-sm" 
            />
          </div>
        </div>

        {/* Grid View */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <div key={property.id} className="card bg-base-100 rounded-2xl shadow-sm border border-base-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                <figure className="aspect-[4/3] relative bg-base-200 w-full overflow-hidden">
                  <img src={property.images?.[0] || "/placeholder.jpg"} alt={property.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-3 right-3 badge font-bold border-none px-3 py-2.5 shadow-sm text-xs ${property.status === "AVAILABLE" ? "bg-success text-success-content" : "bg-error text-error-content"}`}>{property.status}</span>
                  <span className="absolute bottom-3 left-3 bg-neutral/80 text-neutral-content backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{property.category?.name}</span>
                </figure>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="font-black text-lg text-base-content tracking-tight line-clamp-1">{property.title}</h2>
                    <p className="text-2xl font-black text-primary">৳{property.price.toLocaleString()}<span className="text-xs font-semibold text-base-content/50">/mo</span></p>
                    <div className="flex items-center gap-1.5 text-base-content/60 text-xs"><MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> <span className="truncate">{property.location}</span></div>
                  </div>

                  <div className="pt-3 border-t border-base-200 flex flex-col gap-3">
                    <div className="flex gap-4 text-xs font-semibold text-base-content/70">
                      <div className="flex items-center gap-1"><BedDouble className="w-4 h-4 text-primary" /> <span>{property.bedrooms} Beds</span></div>
                      <div className="flex items-center gap-1"><Bath className="w-4 h-4 text-primary" /> <span>{property.bathrooms} Baths</span></div>
                    </div>
                    <Link href={`/properties/${property.id}`} className="btn bg-amber-300 btn-block rounded-xl 
                    text-green-900 font-bold gap-2 text-sm shadow-sm">
                      View Details <ArrowRight className="w-4 h-4 flex bg-green-500" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-base-100 border border-base-300 p-12 text-center rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-lg text-base-content">No properties match your filter.</h3>
          </div>
        )}
      </div>
    </div>
  );
}