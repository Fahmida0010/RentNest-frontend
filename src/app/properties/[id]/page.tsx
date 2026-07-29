"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  User, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  CreditCard 
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
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/properties/${id}`);
        const propertyData = response.data?.data;
        setProperty(propertyData);
        if (propertyData?.images?.length > 0) setActiveImage(propertyData.images[0]);
      } catch (err) {
        console.error("Error fetching property detail", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPropertyDetails();
  }, [id]);

  // SSLCommerz গেটওয়ে রিডাইরেক্ট এবং বুকিং প্রসেস
  const handlePaymentAndBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.role !== "TENANT") {
      alert("Only Tenants can rent properties.");
      return;
    }

    setPaymentLoading(true);

    try {
      // Step ১: রেন্টাল রিকোয়েস্ট সাবমিট
      const rentalResponse = await axiosInstance.post("/rentals", {
        propertyId: id,
        moveInDate: new Date(moveInDate).toISOString(),
      });

      const rentalRequestId = rentalResponse.data?.data?.id; 
      if (!rentalRequestId) throw new Error("Could not retrieve rental request ID.");

      // Step ২: পেমেন্ট সেশন ক্রিয়েট করা (SSLCommerz)
      const paymentResponse = await axiosInstance.post("/payments/create", { 
        rentalRequestId 
      });

      const gatewayUrl = paymentResponse.data?.data?.GatewayPageURL;

      if (gatewayUrl) {
        // সরাসরি SSLCommerz পেমেন্ট পেজে রিডাইরেক্ট
        window.location.href = gatewayUrl;
      } else {
        throw new Error(paymentResponse.data?.message || "Failed to generate gateway payment link.");
      }

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Something went wrong during checkout.";
      alert(errorMsg);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center text-error font-bold">Property Not Found</div>;

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="btn btn-ghost gap-2 mb-6 pl-0 text-base-content/70 hover:text-base-content"><ArrowLeft className="w-5 h-5" /> Back</button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Body */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300">
              <div className="aspect-[16/9] w-full relative rounded-xl overflow-hidden bg-base-200">
                <img src={activeImage || "/placeholder.jpg"} alt={property.title} className="object-cover w-full h-full" />
                <span className={`absolute top-4 right-4 badge badge-lg border-none font-bold py-4 px-6 shadow-md ${property.status === "AVAILABLE" ? "bg-success text-success-content" : "bg-error text-error-content"}`}>{property.status}</span>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 space-y-4">
              <span className="badge badge-primary font-semibold">{property.category?.name}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-base-content/60 text-sm"><MapPin className="w-4 h-4 text-primary" /><span>{property.location}</span></div>
              
              <div className="flex gap-4 border-t border-b border-base-200 py-4">
                <div className="flex items-center gap-2 font-medium text-base-content/80"><BedDouble className="w-5 h-5 text-primary" /><span>{property.bedrooms} Bedrooms</span></div>
                <div className="flex items-center gap-2 font-medium text-base-content/80"><Bath className="w-5 h-5 text-primary" /><span>{property.bathrooms} Bathrooms</span></div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold">Description</h3>
                <p className="text-base-content/70 text-justify leading-relaxed">{property.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-lg font-bold">Amenities Included</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 bg-base-200 p-3 rounded-xl border border-base-300/30">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span className="text-sm font-semibold text-base-content/80 capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="space-y-6">
            <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 sticky top-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider">Rent / Month</p>
                <p className="text-3xl font-black text-primary">৳{property.price.toLocaleString()}</p>
              </div>

              {property.status === "AVAILABLE" ? (
                <button 
                  onClick={() => {
                    if(!user) router.push('/auth/login');
                    else (document.getElementById('booking_modal') as HTMLDialogElement)?.showModal();
                  }}
                  className="btn btn-primary btn-block btn-lg font-bold shadow-md rounded-xl gap-2"
                >
                  <CreditCard className="w-5 h-5" /> Book Now (Pay with SSL)
                </button>
              ) : (
                <button className="btn btn-disabled btn-block btn-lg rounded-xl font-bold" disabled>Already Booked</button>
              )}

              <div className="border-t border-base-200 pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder"><div className="bg-neutral text-neutral-content rounded-full w-10"><User className="w-5 h-5" /></div></div>
                  <div>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase">Listed By</p>
                    <h4 className="font-bold text-sm text-base-content capitalize">{property.landlord?.name}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SSLCOMMERZ PRE-CHECKOUT DIALOG --- */}
      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 rounded-2xl border border-base-300">
          <h3 className="font-black text-xl flex items-center gap-2 text-base-content mb-2"><Calendar className="w-5 h-5 text-primary" /> Confirm Booking</h3>
          <p className="text-xs text-base-content/60 mb-4">Select your targeted move-in date. Clicking confirm will safely redirect you to SSLCommerz payment portal.</p>
          
          <form onSubmit={handlePaymentAndBooking} className="space-y-4">
            <div className="form-control w-full">
              <label className="label font-bold text-xs uppercase text-base-content/60">Move-in Date</label>
              <input 
                type="date" required
                min={new Date().toISOString().split("T")[0]} 
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="input input-bordered w-full rounded-xl focus:outline-primary bg-base-200 text-base-content font-medium" 
              />
            </div>

            <div className="modal-action gap-2">
              <button type="button" onClick={() => (document.getElementById('booking_modal') as HTMLDialogElement).close()} className="btn btn-ghost rounded-xl font-semibold">Cancel</button>
              <button type="submit" disabled={paymentLoading} className="btn btn-primary px-6 rounded-xl font-bold gap-2">
                {paymentLoading ? <span className="loading loading-spinner"></span> : <>Proceed to SSL Payment</>}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}