"use client";

import { useEffect, useState } from "react";
import { 
  ClipboardList, 
  MapPin, 
  CreditCard, 
  MessageSquare,
  Loader2,
  User
} from "lucide-react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

interface Property {
  title: string;
  location: string;
  price: number;
  images: string[];
  landlord?: {
    name: string;
    email: string;
  };
}

interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
  moveInDate: string;
  createdAt: string;
  property: Property;
}

export default function MyRentals() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch Tenant Rentals from backend
  useEffect(() => {
    const fetchMyRentals = async () => {
      try {
        const res = await axiosInstance.get("/rentals");
        const result = res.data; 
        
        if (result.success) {
          setRentals(result.data);
        }
      } catch (error) {
        console.error("Failed to load rental requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRentals();
  }, []);

  // SSLCommerz Payment Handler
  const handlePayment = async (rentalRequestId: string) => {
    setActionLoading(rentalRequestId);
    try {
      const res = await axiosInstance.post("/payments/create", { rentalRequestId });
      const result = res.data;
      
      if (result.success && result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl;
      } else {
        alert(result.message || "Payment session creation failed");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || "Something went wrong during payment initialization");
    } finally {
      setActionLoading(null);
    }
  };

  // Status Badge Builder
  const renderStatusBadge = (status: RentalRequest["status"]) => {
    const badgeClasses: Record<RentalRequest["status"], string> = {
      PENDING: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400",
      APPROVED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
      REJECTED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400",
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
      COMPLETED: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-base-300 dark:text-base-content/60",
    };

    return (
      <span className={`badge badge-sm border font-bold px-3 py-2.5 rounded-lg text-[11px] tracking-wide uppercase ${badgeClasses[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 px-2 sm:px-4 py-4">
      {/* Header section */}
      <div className="flex flex-col gap-2 border-b border-base-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-base-content tracking-tight">
          <ClipboardList className="w-7 h-7 sm:w-8 h-8 text-primary shrink-0" />
          My Rental Requests
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60">
          Track your apartment applications, execution statuses, and complete payments securely.
        </p>
      </div>

      {rentals.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 rounded-2xl">
          <ClipboardList className="w-14 h-14 text-base-content/20" />
          <h3 className="text-lg sm:text-xl font-bold">No Rental Requests Found</h3>
          <p className="text-xs sm:text-sm text-base-content/60 max-w-md">
            You haven't submitted any renting applications yet. Browse properties and tap request to see them here!
          </p>
        </div>
      ) : (
        /* UI Improvements: Padding, Row Spacing & Responsive View Box */
        <div className="overflow-x-auto border border-base-200 rounded-2xl bg-base-100 shadow-sm">
          <table className="table w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-base-200/60 border-b border-base-200 text-base-content/80 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <th className="py-4 pl-6">Property / Owner</th>
                <th className="py-4">Location</th>
                <th className="py-4">Monthly Rent</th>
                <th className="py-4">Move-in Date</th>
                <th className="py-4">Status</th>
                <th className="py-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-base-200/50">
              {rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-base-200/20 transition-all duration-150">
                  {/* Property Details Column */}
                  <td className="py-5 pl-6 min-w-[280px]">
                    <div className="flex items-center gap-4">
                      <div className="avatar shrink-0">
                        <div className="mask mask-squircle w-14 h-14 relative bg-base-200 border border-base-300">
                          <Image
                            src={rental.property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"}
                            alt={rental.property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-extrabold text-sm sm:text-base text-base-content line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                          {rental.property.title}
                        </div>
                        {/* Owner Information Layout with fallback icon */}
                        <div className="flex flex-col gap-0.5 bg-base-200/40 px-2.5 py-1.5 rounded-xl border border-base-200 max-w-fit">
                          <div className="text-[11px] text-base-content/70 font-semibold flex items-center gap-1">
                            <User className="w-3 h-3 text-primary shrink-0" />
                            Owner: <span className="text-base-content font-bold">{rental.property.landlord?.name || "Not Found"}</span>
                          </div>
                          {rental.property.landlord?.email && (
                            <span className="text-[10px] text-base-content/40 pl-4 truncate max-w-[180px]">
                              {rental.property.landlord.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location Column */}
                  <td className="py-5 text-xs sm:text-sm text-base-content/70 min-w-[160px]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="truncate max-w-[150px]" title={rental.property.location}>
                        {rental.property.location}
                      </span>
                    </div>
                  </td>

                  {/* Price Column */}
                  <td className="py-5 text-xs sm:text-sm font-bold text-base-content min-w-[120px]">
                    ৳{rental.property.price.toLocaleString("en-BD")} <span className="text-[10px] font-medium text-base-content/50">/mo</span>
                  </td>

                  {/* Date Column */}
                  <td className="py-5 text-xs sm:text-sm font-medium text-base-content/70 min-w-[110px]">
                    {new Date(rental.moveInDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>

                  {/* Status Badge Column */}
                  <td className="py-5 min-w-[110px]">
                    {renderStatusBadge(rental.status)}
                  </td>

                  {/* Actions Column */}
                  <td className="py-5 pr-6 text-right min-w-[130px]">
                    {rental.status === "APPROVED" && (
                      <button
                        onClick={() => handlePayment(rental.id)}
                        disabled={actionLoading === rental.id}
                        className="btn btn-primary btn-sm sm:btn-md gap-1.5 rounded-xl text-white shadow-sm normal-case font-bold px-4 hover:scale-[1.02] active:scale-95 transition-transform"
                      >
                        {actionLoading === rental.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5" />
                        )}
                        Pay Now
                      </button>
                    )}

                    {rental.status === "ACTIVE" && (
                      <button 
                        onClick={() => alert("Review feature coming soon!")}
                        className="btn btn-success btn-outline btn-sm sm:btn-md gap-1.5 rounded-xl normal-case font-bold px-4"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Leave Review
                      </button>
                    )}

                    {rental.status === "PENDING" && (
                      <span className="text-xs font-semibold px-2 py-1 bg-base-200 text-base-content/50 rounded-md italic">Awaiting Host</span>
                    )}

                    {rental.status === "REJECTED" && (
                      <span className="text-xs text-error/80 font-bold bg-error/10 px-2 py-1 rounded-md">Declined</span>
                    )}

                    {rental.status === "COMPLETED" && (
                      <span className="text-xs text-base-content/40 font-bold bg-base-200 px-2 py-1 rounded-md">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}