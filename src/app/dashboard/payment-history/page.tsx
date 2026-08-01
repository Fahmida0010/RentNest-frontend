"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard, 
  Receipt, 
  User, 
  Calendar, 
  MapPin, 
  ExternalLink 
} from "lucide-react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";


interface Property {
  title: string;
  location: string;
  images: string[];
}

interface UserProfile {
  name: string;
  email: string;
}

interface RentalRequest {
  id: string;
  property: Property;
  tenant?: UserProfile; 
}

interface PaymentRecord {
  id: string;
  rentalRequestId: string;
  amount: number;
  transactionId: string;
  provider: "SSLCOMMERZ";
  status: "PENDING" | "SUCCESS" | "FAILED";
  paidAt: string | null;
  createdAt: string;
  rentalRequest: RentalRequest;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Payment History from backend
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const res = await axiosInstance.get("/payments");
        const result = res.data;

        if (result.success) {
          setPayments(result.data);
        }
      } catch (error) {
        console.error("Failed to load payment history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Payment Status Badge Styles
  const renderStatusBadge = (status: PaymentRecord["status"]) => {
    const badgeClasses: Record<PaymentRecord["status"], string> = {
      SUCCESS: "bg-green-100 text-green-700 border-green-200",
      PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      FAILED: "bg-red-100 text-red-700 border-red-200",
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
      {/* Header Section */}
      <div className="flex flex-col gap-2 border-b pb-5">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-base-content">
          <Receipt className="w-8 h-8 text-primary" />
          Payment Transactions
        </h1>
        <p className="text-sm text-base-content/60">
          View your complete billing statements, digital invoices, and secure transaction logs.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="card bg-base-100 border p-12 text-center flex flex-col items-center justify-center space-y-3">
          <CreditCard className="w-16 h-16 text-base-content/30" />
          <h3 className="text-xl font-bold">No Transactions Found</h3>
          <p className="text-sm text-base-content/60 max-w-md">
            There are no recorded invoices or gateway sessions registered under this account yet.
          </p>
        </div>
      ) : (
        /* Payment History Table */
        <div className="overflow-x-auto border border-base-200 rounded-xl bg-base-100 shadow-sm">
          <table className="table w-full table-zebra">
            {/* Table Header */}
            <thead>
              <tr className="bg-base-200/50 text-base-content/80">
                <th>Property / Description</th>
                <th>Transaction ID</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Date Paid</th>
                <th>Status</th>
                <th className="text-right">Details</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-base-200/30 transition-colors">
                  
                  {/* Property Info with Small Circular Image */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-circle w-11 h-11 relative bg-base-200 border">
                          <Image
                            src={payment.rentalRequest?.property?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"}
                            alt={payment.rentalRequest?.property?.title || "Property"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-base-content line-clamp-1">
                          {payment.rentalRequest?.property?.title || "Rental Payment"}
                        </div>
                        {payment.rentalRequest?.tenant && (
                          <div className="text-xs text-base-content/50 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3" />
                            <span>Tenant: {payment.rentalRequest.tenant.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Transaction ID */}
                  <td className="font-mono text-xs text-base-content/80 tracking-wide">
                    {payment.transactionId}
                  </td>

                  {/* Payment Provider */}
                  <td className="text-xs font-semibold text-base-content/60">
                    <span className="bg-base-200 px-2 py-1 rounded">
                      {payment.provider}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="font-bold text-base-content">
                    {payment.amount.toLocaleString("en-BD")} BDT
                  </td>

                  {/* Paid Date */}
                  <td className="text-sm text-base-content/70">
                    {payment.paidAt ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                        <span>{new Date(payment.paidAt).toLocaleDateString("en-GB")}</span>
                      </div>
                    ) : (
                      <span className="text-xs italic text-base-content/40">Not available</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td>
                    {renderStatusBadge(payment.status)}
                  </td>

                  {/* Action Link (Details) */}
                  <td className="text-right">
                    <button
                      onClick={() => alert(`Viewing details for payment ID: ${payment.id}`)}
                      className="btn btn-ghost btn-xs text-primary gap-1 normal-case"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </button>
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