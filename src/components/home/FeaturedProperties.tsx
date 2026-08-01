"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, ArrowRight } from "lucide-react";
import axiosInstance from "@/lib/axios";

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

export default function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await axiosInstance.get("/properties");
        const allProperties: Property[] = response.data?.data || [];
        
        // ব্যাকএন্ড যদি নতুনগুলো প্রথমে না দেয়, তবে reverse() করে নিতে পারেন:
        // const latest = [...allProperties].reverse().slice(0, 6);
        
        // সরাসরি লেটেস্ট ৬টি প্রপার্টি স্লাইস করা হলো
        const latest = allProperties.slice(0, 6);
        setFeaturedProperties(latest);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProperties();
  }, []);

  // Skeleton Loader for UX
  if (loading) {
    return (
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-lg mx-auto skeleton h-8 w-3/4 bg-base-300"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card bg-base-100 border border-base-300 rounded-2xl h-[420px] skeleton bg-base-200"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
              Featured Properties
            </h2>
            <p className="text-base-content/60 text-sm max-w-md">
              Explore our latest premium spaces listed and verified across the marketplace.
            </p>
          </div>
          <div className="hidden md:block">
            <Link href="/properties" className="btn btn-outline btn-primary rounded-xl font-bold gap-2">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grid View */}
        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProperties.map((property) => (
              <div 
                key={property.id} 
                className="card bg-base-100 rounded-2xl shadow-sm border border-base-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Image Container with next/image */}
                <figure className="aspect-[4/3] relative bg-base-200 w-full overflow-hidden">
                  <Image 
                    src={property.images?.[0] || "/placeholder.jpg"} 
                    alt={property.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={false}
                  />
                  <span className={`absolute top-3 right-3 badge font-bold border-none px-3 py-2.5 shadow-sm text-xs ${
                    property.status === "AVAILABLE" ? "bg-success text-success-content" : "bg-error text-error-content"
                  }`}>
                    {property.status}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-neutral/80 text-neutral-content backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {property.category?.name || "Rental"}
                  </span>
                </figure>

                {/* Content Box */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-black text-lg text-base-content tracking-tight line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-2xl font-black text-primary">
                      ৳{property.price.toLocaleString()}
                      <span className="text-xs font-semibold text-base-content/50">/mo</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-base-content/60 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> 
                      <span className="truncate">{property.location}</span>
                    </div>
                  </div>

                  {/* Amenities & Link */}
                  <div className="pt-3 border-t border-base-200 flex flex-col gap-3">
                    <div className="flex gap-4 text-xs font-semibold text-base-content/70">
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4 text-primary" /> 
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-primary" /> 
                        <span>{property.bathrooms} Baths</span>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/properties/${property.id}`} 
                      className="btn btn-primary btn-block rounded-xl font-bold gap-2 text-sm shadow-sm"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-base-100 border border-base-300 p-12 text-center rounded-2xl max-w-md mx-auto">
            <h3 className="font-bold text-lg text-base-content">No properties available at the moment.</h3>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="text-center md:hidden pt-4">
          <Link href="/properties" className="btn btn-primary btn-block rounded-xl font-bold gap-2">
            View All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}