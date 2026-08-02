"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, ArrowRight, ClipboardList, ShieldCheck } from "lucide-react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id") || `TXN-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-base-100">
      <div className="max-w-md w-full card bg-base-100 border border-base-200 shadow-xl rounded-3xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
        {/* Top Decorative Success Wave Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-full text-emerald-500 animate-bounce">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-sm text-base-content/60 px-2">
            Your rental request payment hash has been verified. Welcome to your new smart living space!
          </p>
        </div>

        {/* Transaction Summary Box */}
        <div className="bg-base-200/50 border border-base-200 rounded-2xl p-4 text-left text-xs sm:text-sm space-y-3">
          <div className="flex justify-between items-center border-b border-base-200/60 pb-2">
            <span className="text-base-content/50 font-medium">Transaction ID</span>
            <span className="font-mono font-bold text-base-content tracking-wider select-all">{transactionId}</span>
          </div>
          <div className="flex justify-between items-center border-b border-base-200/60 pb-2">
            <span className="text-base-content/50 font-medium">Payment Gateway</span>
            <span className="font-bold text-base-content flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-primary" /> SSLCommerz
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base-content/50 font-medium">Status</span>
            <span className="badge badge-success badge-sm font-bold text-[10px] tracking-wide uppercase px-2.5 py-2 rounded-md">
              COMPLETED
            </span>
          </div>
        </div>

        {/* Information Notice */}
        <div className="flex gap-2.5 items-start text-left bg-info/5 border border-info/20 text-info-content text-xs p-3.5 rounded-xl">
          <Calendar className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <p className="text-base-content/70 font-medium leading-relaxed">
            Your application status is updated to <span className="font-bold text-emerald-600">COMPLETED</span>. The landlord has been notified to execute move-in protocols.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link 
            href="/my-rentals" 
            className="btn btn-primary flex-1 gap-2 rounded-xl normal-case font-bold order-2 sm:order-1"
          >
            <ClipboardList className="w-4 h-4" />
            View Rentals
          </Link>
          <Link 
            href="/" 
            className="btn btn-neutral btn-outline flex-1 gap-2 rounded-xl normal-case font-bold order-1 sm:order-2"
          >
            Go Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}