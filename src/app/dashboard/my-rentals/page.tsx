"use client";

import { useEffect, useState } from "react";
import { 
  ClipboardList, 
  MapPin, 
  CreditCard, 
  MessageSquare,
  Loader2 
} from "lucide-react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

interface Property {
  title: string;
  location: string;
  price: number;
  images: string[];
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

  // Status Badge Builder with requested colors
  const renderStatusBadge = (status: RentalRequest["status"]) => {
    const badgeClasses: Record<RentalRequest["status"], string> = {
      PENDING: "bg-orange-100 text-orange-700 border-orange-200", // Yellow/Orange
      APPROVED: "bg-blue-100 text-blue-700 border-blue-200",     // Blue
      REJECTED: "bg-red-100 text-red-700 border-red-200",       // Red
      ACTIVE: "bg-green-100 text-green-700 border-green-200",    // Green
      COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",    // Gray
    };

    return (
      <span className={`badge badge-sm border font-semibold px-2.5 py-2.5 rounded text-xs uppercase ${badgeClasses[status]}`}>
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-2 border-b pb-5">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-base-content">
          <ClipboardList className="w-8 h-8 text-primary" />
          My Rental Requests
        </h1>
        <p className="text-sm text-base-content/60">
          Track your apartment applications, execution statuses, and complete payments securely.
        </p>
      </div>

      {rentals.length === 0 ? (
        <div className="card bg-base-100 border p-12 text-center flex flex-col items-center justify-center space-y-3">
          <ClipboardList className="w-16 h-16 text-base-content/30" />
          <h3 className="text-xl font-bold">No Rental Requests Found</h3>
          <p className="text-sm text-base-content/60 max-w-md">
            You haven't submitted any renting applications yet. Browse properties and tap request to see them here!
          </p>
        </div>
      ) : (
        /* Data Table Layout */
        <div className="overflow-x-auto border border-base-200 rounded-xl bg-base-100 shadow-sm">
          <table className="table w-full table-zebra">
            {/* Table Head */}
            <thead>
              <tr className="bg-base-200/50 text-base-content/80">
                <th>Property</th>
                <th>Location</th>
                <th>Monthly Rent</th>
                <th>Move-in Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-base-200/30 transition-colors">
                  {/* Property Info with Profile Picture (Avatar) */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-circle w-12 h-12 relative bg-base-200 border">
                          <Image
                            src={rental.property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"}
                            alt={rental.property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-base-content line-clamp-1">{rental.property.title}</div>
                        <div className="text-xs text-base-content/50">ID: {rental.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="text-sm text-base-content/70">
                    <div className="flex items-center gap-1 max-w-[180px]">
                      <MapPin className="w-4 h-4 text-base-content/40 shrink-0" />
                      <span className="truncate">{rental.property.location}</span>
                    </div>
                  </td>

                  {/* Monthly Rent */}
                  <td className="font-semibold text-base-content">
                    {rental.property.price.toLocaleString("en-BD")} BDT
                  </td>

                  {/* Move-in Date */}
                  <td className="text-sm text-base-content/70">
                    {new Date(rental.moveInDate).toLocaleDateString("en-GB")}
                  </td>

                  {/* Status Badge */}
                  <td>
                    {renderStatusBadge(rental.status)}
                  </td>

                  {/* Dynamic Action Buttons */}
                  <td className="text-right">
                    {rental.status === "APPROVED" && (
                      <button
                        onClick={() => handlePayment(rental.id)}
                        disabled={actionLoading === rental.id}
                        className="btn btn-primary btn-sm gap-1.5 rounded-lg text-white shadow-sm normal-case"
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
                        className="btn btn-success btn-outline btn-sm gap-1.5 rounded-lg normal-case"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Leave Review
                      </button>
                    )}

                    {rental.status === "PENDING" && (
                      <span className="text-xs italic text-base-content/40">Awaiting Host</span>
                    )}

                    {rental.status === "REJECTED" && (
                      <span className="text-xs text-error/70 font-medium">Declined</span>
                    )}

                    {rental.status === "COMPLETED" && (
                      <span className="text-xs text-base-content/50 font-medium">Closed</span>
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