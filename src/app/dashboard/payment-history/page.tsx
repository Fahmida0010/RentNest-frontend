"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard, 
  Receipt, 
  User, 
  Calendar 
} from "lucide-react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

interface UserProfile {
  name: string;
  email: string;
}

interface Property {
  title: string;
  location: string;
  images: string[];
  landlord?: UserProfile;
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
      SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
      PENDING: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400",
      FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400",
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
      {/* Header Section */}
      <div className="flex flex-col gap-2 border-b border-base-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-base-content tracking-tight">
          <Receipt className="w-7 h-7 sm:w-8 h-8 text-primary shrink-0" />
          Payment Transactions
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60">
          View your complete billing statements, digital invoices, and secure transaction logs.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 rounded-2xl">
          <CreditCard className="w-14 h-14 text-base-content/20" />
          <h3 className="text-lg sm:text-xl font-bold">No Transactions Found</h3>
          <p className="text-xs sm:text-sm text-base-content/60 max-w-md">
            There are no recorded invoices or gateway sessions registered under this account yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 📱 MOBILE VIEW: Cards Layout (Visible only on small screens) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {payments.map((payment) => (
              <div key={payment.id} className="card bg-base-100 border border-base-200 rounded-2xl p-4 shadow-sm space-y-4">
                {/* Property Main Row */}
                <div className="flex items-center gap-3">
                  <div className="avatar shrink-0">
                    <div className="mask mask-squircle w-12 h-12 relative bg-base-200 border border-base-300">
                      <Image
                        src={payment.rentalRequest?.property?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"}
                        alt={payment.rentalRequest?.property?.title || "Property"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-0.5 max-w-[calc(100%-60px)]">
                    <h4 className="font-extrabold text-sm text-base-content line-clamp-1">
                      {payment.rentalRequest?.property?.title || "Rental Payment"}
                    </h4>
                    <span className="bg-base-200 text-base-content/70 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider w-fit block">
                      {payment.provider}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2 pt-2 border-t border-base-200/60 text-xs text-base-content/70">
                  {/* Landlord Info */}
                  <div className="flex flex-wrap items-center gap-1 bg-base-200/50 p-2 rounded-lg border border-base-200/50">
                    <span className="font-medium text-[11px]">Landlord:</span>
                    <span className="font-bold text-base-content text-[11px]">
                      {payment.rentalRequest?.property?.landlord?.name || "Not Found"}
                    </span>
                    {payment.rentalRequest?.property?.landlord?.email && (
                      <span className="text-base-content/50 font-normal text-[10px]">
                        ({payment.rentalRequest.property.landlord.email})
                      </span>
                    )}
                  </div>

                  {/* Tenant Info */}
                  {payment.rentalRequest?.tenant && (
                    <div className="flex items-center gap-1 bg-primary/5 text-primary p-2 rounded-lg border border-primary/10">
                      <User className="w-3 h-3" />
                      <span className="font-medium text-[11px]">Tenant: {payment.rentalRequest.tenant.name}</span>
                    </div>
                  )}

                  {/* TXN ID & Date Info */}
                  <div className="grid grid-cols-2 gap-2 pt-1 font-medium">
                    <div>
                      <span className="text-base-content/40 block text-[10px] uppercase">Txn ID</span>
                      <span className="font-mono text-base-content/90 tracking-tight text-[11px] block break-all">{payment.transactionId}</span>
                    </div>
                    <div>
                      <span className="text-base-content/40 block text-[10px] uppercase">Date Paid</span>
                      {payment.paidAt ? (
                        <span className="text-base-content/90 flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                          {new Date(payment.paidAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      ) : (
                        <span className="text-base-content/40 italic text-[11px]">Not available</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Amount Row */}
                <div className="flex items-center justify-between pt-3 border-t border-base-200/60">
                  <div className="text-base sm:text-lg font-black text-base-content">
                    ৳{payment.amount.toLocaleString("en-BD")}
                  </div>
                  <div>
                    {renderStatusBadge(payment.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 DESKTOP VIEW: Table Layout (Visible on md screens and larger) */}
          <div className="hidden md:block overflow-x-auto border border-base-200 rounded-2xl bg-base-100 shadow-sm">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="bg-base-200/60 border-b border-base-200 text-base-content/80 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <th className="py-4 pl-6">Property / Info</th>
                  <th className="py-4">Transaction ID</th>
                  <th className="py-4">Method</th>
                  <th className="py-4">Amount</th>
                  <th className="py-4">Date Paid</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200/50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-base-200/20 transition-all duration-150">
                    <td className="py-5 pl-6 min-w-[320px]">
                      <div className="flex items-center gap-4">
                        <div className="avatar shrink-0">
                          <div className="mask mask-squircle w-14 h-14 relative bg-base-200 border border-base-300">
                            <Image
                              src={payment.rentalRequest?.property?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"}
                              alt={payment.rentalRequest?.property?.title || "Property"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-extrabold text-sm sm:text-base text-base-content line-clamp-1">
                            {payment.rentalRequest?.property?.title || "Rental Payment"}
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <div className="text-[11px] bg-base-200/60 text-base-content/70 px-2 py-0.5 rounded border border-base-200 font-medium">
                              Landlord: <span className="font-bold text-base-content">
                                {payment.rentalRequest?.property?.landlord?.name || "Not Found"}
                              </span>
                              {payment.rentalRequest?.property?.landlord?.email && (
                                <span className="text-base-content/50 font-normal ml-1">
                                  ({payment.rentalRequest.property.landlord.email})
                                </span>
                              )}
                            </div>
                            {payment.rentalRequest?.tenant && (
                              <div className="text-[11px] bg-primary/5 text-primary px-2 py-0.5 rounded border border-primary/10 font-medium flex items-center gap-0.5">
                                <User className="w-2.5 h-2.5" />
                                <span>Tenant: {payment.rentalRequest.tenant.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 font-mono text-xs text-base-content/80 tracking-wide min-w-[140px]">
                      {payment.transactionId}
                    </td>
                    <td className="py-5 text-xs font-semibold text-base-content/60 min-w-[110px]">
                      <span className="bg-base-200 px-2.5 py-1 rounded-md font-bold text-[10px] tracking-wider">
                        {payment.provider}
                      </span>
                    </td>
                    <td className="py-5 text-xs sm:text-sm font-bold text-base-content min-w-[120px]">
                      ৳{payment.amount.toLocaleString("en-BD")}
                    </td>
                    <td className="py-5 text-xs sm:text-sm font-medium text-base-content/70 min-w-[130px]">
                      {payment.paidAt ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>
                            {new Date(payment.paidAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs italic text-base-content/40">Not available</span>
                      )}
                    </td>
                    <td className="py-5 min-w-[110px]">
                      {renderStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}