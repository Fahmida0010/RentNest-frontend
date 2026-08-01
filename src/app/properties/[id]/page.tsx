"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  User, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Send 
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import Swal from "sweetalert2"; // SweetAlert2 ইমপোর্ট করা হয়েছে

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
  status: "AVAILABLE" | "RENTED";
  landlord: { name: string; email: string; phone?: string };
  category: { name: string };
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [moveInDate, setMoveInDate] = useState<string>("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/properties/${id}`);
        const propertyData = response.data?.data;
        setProperty(propertyData);
        if (propertyData?.images?.length > 0) setActiveImage(propertyData.images[0]);
      } catch (err) {
        console.error("Error fetching property detail", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load property details!",
          confirmButtonColor: "#10b981",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPropertyDetails();
  }, [id]);

  const handleRentalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.role !== "TENANT") {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "Only Tenants can send rental requests.",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    setRequestLoading(true);

    try {
      await axiosInstance.post("/rentals", {
        propertyId: id,
        moveInDate: new Date(moveInDate).toISOString(),
      });

      setRequestSuccess(true);
      (document.getElementById('booking_modal') as HTMLDialogElement).close();
      
      // সুন্দর সাকসেস অ্যালার্ট
      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: "Your rental request has been submitted to the landlord successfully.",
        showConfirmButton: false,
        timer: 2500,
      });

      setTimeout(() => {
        router.push("/dashboard/my-rentals");
      }, 2500);

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to send rental request.";
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: errorMsg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-base-100"><span className="loading loading-spinner loading-lg text-emerald-600"></span></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center text-error font-bold bg-base-100">Property Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-base-300 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="btn btn-ghost gap-2 mb-6 pl-0 text-base-content/70 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Media Gallery & Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-3xl overflow-hidden bg-base-200 aspect-[16/10] sm:aspect-[16/9] w-full shadow-md group border border-base-200">
              <Image 
                src={activeImage || "/placeholder.jpg"} 
                alt={property.title} 
                fill
                priority
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              <span className={`absolute top-4 right-4 text-xs font-extrabold tracking-wider uppercase px-4 py-2 rounded-xl backdrop-blur-md shadow-lg border ${
                property.status === "AVAILABLE" 
                  ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40" 
                  : "bg-rose-500/20 text-rose-500 border-rose-500/40"
              }`}>
                ● {property.status}
              </span>

              <span className="absolute bottom-4 left-4 bg-black/60 text-white backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 uppercase tracking-wide">
                {property.category?.name}
              </span>
            </div>

            {/* Thumbnail Gallery */}
            {property.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
                {property.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all snap-start ${
                      activeImage === img ? "border-emerald-500 scale-95 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Core Info Details */}
            <div className="bg-base-100 p-6 sm:p-8 rounded-3xl shadow-sm border border-base-200 space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-base-content tracking-tight leading-tight">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-base-content/60 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{property.location}</span>
                </div>
              </div>
              
              <div className="flex gap-6 border-y border-base-200 py-4">
                <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-base-content/80">
                  <BedDouble className="w-5 h-5 text-emerald-600" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-base-content/80">
                  <Bath className="w-5 h-5 text-emerald-600" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-base-content tracking-tight">About this space</h3>
                <p className="text-base-content/70 text-sm sm:text-base text-justify leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold text-base-content tracking-tight">Amenities Included</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2.5 bg-base-200/40 p-3.5 rounded-xl border border-base-200 hover:bg-base-200/80 transition-all duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-base-content/80 capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Request Summary Panel */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bg-base-100 p-6 rounded-3xl shadow-md border border-base-200 space-y-6">
              <div>
                <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider mb-1">Rent / Month</p>
                <p className="text-3xl sm:text-4xl font-black text-emerald-600">
                  ৳{property.price.toLocaleString()}
                  <span className="text-xs font-semibold text-base-content/50 lowercase ml-1">/mo</span>
                </p>
              </div>

              {property.status === "AVAILABLE" ? (
                <button 
                  onClick={() => {
                    if(!user) router.push('/auth/login');
                    else (document.getElementById('booking_modal') as HTMLDialogElement)?.showModal();
                  }}
                  disabled={requestSuccess}
                  className="btn bg-emerald-600
                   hover:bg-emerald-700 text-white
                    btn-block btn-lg font-bold shadow-md
                     hover:shadow-lg rounded-xl flex items-center justify-center
                      gap-1 text-sm sm:text-base normal-case border-none transition-all duration-200 transform active:scale-98"
                >
                  <Send className="w-4 h-4 " /> 
                  Request for Rental
                </button>
              ) : (
                <button className="btn btn-neutral btn-block btn-lg rounded-xl font-bold cursor-not-allowed opacity-50" disabled>Already Rented Out</button>
              )}

              <div className="border-t border-base-200 pt-4">
                <div className="flex items-center gap-3 bg-base-200/40 p-3 rounded-xl border border-base-200">
                  <div className="avatar placeholder">
                    <div className="bg-emerald-100 text-emerald-700 rounded-xl w-10 h-10">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Property Owner</p>
                    <h4 className="font-bold text-sm text-base-content capitalize">{property.landlord?.name}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- RENTAL REQUEST PRE-SUBMIT DIALOG (FIXED & CENTERED) --- */}
      <dialog id="booking_modal" className="modal modal-middle backdrop-blur-sm transition-all duration-300">
        <div className="modal-box bg-base-100 rounded-3xl border border-base-200 shadow-2xl max-w-md p-6 sm:p-8 relative">
          <button 
            type="button" 
            onClick={() => (document.getElementById('booking_modal') as HTMLDialogElement).close()} 
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/50 hover:text-base-content"
          >
            ✕
          </button>
          
          <h3 className="font-black text-xl sm:text-2xl flex items-center gap-2 text-base-content mb-2">
            <Calendar className="w-5 h-5 text-emerald-600" /> Rental Application
          </h3>
          <p className="text-xs sm:text-sm text-base-content/60 mb-6">
            Select your desired move-in date. Your profile details and application will be securely sent to the landlord for active review.
          </p>
          
          <form onSubmit={handleRentalRequest} className="space-y-5">
            <div className="form-control w-full">
              <label className="label font-bold text-xs uppercase text-base-content/60 tracking-wider">Targeted Move-in Date</label>
              <input 
                type="date" 
                required
                min={new Date().toISOString().split("T")[0]} 
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="input input-bordered w-full rounded-xl focus:outline-emerald-500 bg-base-200/50 text-base-content font-medium text-sm sm:text-base p-3 h-auto" 
              />
            </div>

            <div className="modal-action gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => (document.getElementById('booking_modal') as HTMLDialogElement).close()} 
                className="btn btn-ghost rounded-xl font-semibold px-5"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={requestLoading} 
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-bold gap-2 normal-case shadow-md border-none"
              >
                {requestLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Submit Request</>}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}