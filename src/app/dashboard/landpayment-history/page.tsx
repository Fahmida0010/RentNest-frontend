"use client";

import React, { useEffect, useState } from "react";
import { Calendar, User, Mail, DollarSign, FileText, MapPin, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
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

  // Status Badge Helper Function
  const renderStatusBadge = (status: "PENDING" | "SUCCESS" | "FAILED") => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="badge badge-success gap-1 text-green-500 font-semibold px-3 py-2.5 shadow-sm text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Success
          </span>
        );
      case "PENDING":
        return (
          <span className="badge badge-warning gap-1 text-yellow-500 font-semibold px-3 py-2.5 shadow-sm text-xs">
            <AlertTriangle className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="badge badge-error gap-1 text-red-500 font-semibold px-3 py-2.5 shadow-sm text-xs">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

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
        <div className="alert alert-error shadow-lg text-white font-medium">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const totalEarnings = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 bg-base-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-base-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-base-content">
            Received Payments
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Track and manage all rent payments sent by your tenants.
          </p>
        </div>
        
        {/* Earnings Card */}
        <div className="stats shadow bg-base-100 border border-base-200 w-full sm:w-auto">
          <div className="stat py-3 px-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-title text-xs font-bold uppercase tracking-wider text-base-content/50">Total Earnings</div>
              <div className="stat-value text-2xl text-primary font-black mt-0.5">
                ৳ {totalEarnings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {payments.length === 0 ? (
        <div className="bg-base-100 rounded-2xl border border-base-200 p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto space-y-3">
            <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto text-primary shadow-inner">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-base-content">No Payments Found</h3>
            <p className="text-sm text-base-content/60">
              When tenants pay rent for your properties via SSLCommerz, the transactions will appear here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 1. MOBILE DEVICE VIEW (Card Layout) */}
          <div className="block md:hidden space-y-4">
            {payments.map((payment) => {
              const tenant = payment.rentalRequest?.tenant;
              const property = payment.rentalRequest?.property;

              return (
                <div 
                  key={payment.id} 
                  className="bg-base-100 rounded-2xl border border-base-200 p-5 shadow-sm space-y-4 hover:border-primary/30 transition-all duration-200"
                >
                  {/* Property Header & Status */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-base-content text-md leading-snug">
                        {property?.title || "N/A"}
                      </h4>
                      <p className="text-xs text-base-content/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-base-content/40" />
                        {property?.location || "N/A"}
                      </p>
                    </div>
                    {renderStatusBadge(payment.status)}
                  </div>

                  <div className="divider my-0 opacity-60"></div>

                  {/* Tenant details */}
                  <div className="bg-base-50 p-3 rounded-xl space-y-2 border border-base-200/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-base-content/40">Tenant Info</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-base-content">
                      <User className="w-4 h-4 text-primary" />
                      {tenant?.name || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                      <Mail className="w-4 h-4 text-base-content/40" />
                      {tenant?.email || "N/A"}
                    </div>
                  </div>

                  {/* Pricing and Transaction Meta */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-1">
                      <span className="text-xs text-base-content/50 font-medium block font-mono">
                        #{payment.transactionId}
                      </span>
                      <span className="text-xs text-base-content/60 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                        {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not paid"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-base-content/40 block font-medium">Amount Paid</span>
                      <span className="text-lg font-black text-base-content">
                        ৳ {payment.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. DESKTOP & LARGE SCREEN VIEW (Table Layout) */}
          <div className="hidden md:block bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full table-zebra">
                <thead className="bg-base-200/60 border-b border-base-200">
                  <tr>
                    <th className="font-bold text-sm py-4 text-base-content/70 pl-6">Tenant Info</th>
                    <th className="font-bold text-sm text-base-content/70">Property & Location</th>
                    <th className="font-bold text-sm text-base-content/70">Transaction ID</th>
                    <th className="font-bold text-sm text-base-content/70">Amount</th>
                    <th className="font-bold text-sm text-base-content/70">Status</th>
                    <th className="font-bold text-sm text-base-content/70 pr-6">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const tenant = payment.rentalRequest?.tenant;
                    const property = payment.rentalRequest?.property;

                    return (
                      <tr key={payment.id} className="hover:bg-base-200/40 transition-colors group">
                        {/* Tenant Info */}
                        <td className="py-4 pl-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-base-content flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              {tenant?.name || "N/A"}
                            </span>
                            <span className="text-xs text-base-content/60 flex items-center gap-2 pl-6">
                              {tenant?.email || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Property & Location */}
                        <td>
                          <div className="flex flex-col gap-0.5 max-w-xs md:max-w-sm">
                            <span className="font-bold text-base-content group-hover:text-primary transition-colors">
                              {property?.title || "N/A"}
                            </span>
                            <span className="text-xs text-base-content/50 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-base-content/40" />
                              {property?.location || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Transaction ID */}
                        <td className="font-mono text-xs text-base-content/70 font-medium">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-base-content/40" />
                            {payment.transactionId}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="font-extrabold text-base-content text-md">
                          ৳ {payment.amount.toLocaleString()}
                        </td>

                        {/* Status */}
                        <td>{renderStatusBadge(payment.status)}</td>

                        {/* Date */}
                        <td className="text-xs text-base-content/70 pr-6">
                          {payment.paidAt ? (
                            <span className="flex items-center gap-1.5 font-medium">
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
        </>
      )}
    </div>
  );
}