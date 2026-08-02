"use client";

import React, { useEffect, useState } from "react";
import { Calendar, User, Mail, DollarSign, FileText } from "lucide-react";
import axiosInstance from "@/lib/axios";


interface Tenant {
  name: string;
  email: string;
}

interface Property {
  title: string;
  location: string;
}

interface RentalRequest {
  property: Property;
  tenant: Tenant;
}

interface PaymentHistory {
  id: string;
  transactionId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  paidAt: string | null;
  rentalRequest: RentalRequest;
}

export default function LandlordPaymentHistory() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
    
        const response = await axiosInstance.get("/payments");
        
        if (response.data?.success) {
          setPayments(response.data.data);
        } else {
          setError("Failed to fetch payment history");
        }
      } catch (err: any) {
        console.error("Error fetching payment history:", err);
        setError(err?.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-4">
        <div className="alert alert-error shadow-lg text-white">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-base-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-base-content">
            Received Payments
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Track and manage all rent payments sent by your tenants.
          </p>
        </div>
        <div className="stats shadow bg-base-100 border border-base-200 hidden sm:flex">
          <div className="stat py-2 px-4">
            <div className="stat-title text-xs">Total Earnings</div>
            <div className="stat-value text-xl text-primary">
              ৳ {payments
                .filter((p) => p.status === "SUCCESS")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {payments.length === 0 ? (
        <div className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto space-y-3">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">No Payments Found</h3>
            <p className="text-sm text-base-content/60">
              When tenants pay rent for your properties via SSLCommerz, the transactions will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              {/* Table Head */}
              <thead className="bg-base-200/50">
                <tr>
                  <th className="font-semibold text-sm py-4">Tenant Info</th>
                  <th className="font-semibold text-sm">Property & Location</th>
                  <th className="font-semibold text-sm">Transaction ID</th>
                  <th className="font-semibold text-sm">Amount</th>
                  <th className="font-semibold text-sm">Status</th>
                  <th className="font-semibold text-sm">Date</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody>
                {payments.map((payment) => {
                  const tenant = payment.rentalRequest?.tenant;
                  const property = payment.rentalRequest?.property;

                  return (
                    <tr key={payment.id} className="hover:bg-base-200/40 transition-colors">
                      {/* Tenant Name and Email */}
                      <td className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-base-content flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-base-content/50" />
                            {tenant?.name || "N/A"}
                          </span>
                          <span className="text-xs text-base-content/60 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-base-content/40" />
                            {tenant?.email || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Property Details */}
                      <td>
                        <div className="flex flex-col gap-0.5 max-w-xs md:max-w-sm truncate">
                          <span className="font-medium text-base-content">
                            {property?.title || "N/A"}
                          </span>
                          <span className="text-xs text-base-content/50">
                            {property?.location || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Transaction ID */}
                      <td className="font-mono text-xs text-base-content/80">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-base-content/40" />
                          {payment.transactionId}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="font-semibold text-base-content">
                        ৳ {payment.amount.toLocaleString()}
                      </td>

                      {/* Payment Status Badges */}
                      <td>
                        {payment.status === "SUCCESS" && (
                          <span className="badge badge-success badge-sm gap-1 text-white font-medium p-2.5">
                            Success
                          </span>
                        )}
                        {payment.status === "PENDING" && (
                          <span className="badge badge-warning badge-sm gap-1 text-white font-medium p-2.5">
                            Pending
                          </span>
                        )}
                        {payment.status === "FAILED" && (
                          <span className="badge badge-error badge-sm gap-1 text-white font-medium p-2.5">
                            Failed
                          </span>
                        )}
                      </td>

                      {/* Payment Date */}
                      <td className="text-xs text-base-content/70">
                        {payment.paidAt ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                            {new Date(payment.paidAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ) : (
                          <span className="text-base-content/40 italic">Not paid yet</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}