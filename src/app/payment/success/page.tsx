"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, ArrowRight, ClipboardList, ShieldCheck, Wallet, Star, Home } from "lucide-react";
import { toast } from "sonner"; 
import axiosInstance from "@/lib/axios";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id") || `TXN-${Date.now().toString().slice(-6)}`;
  const propertyId = searchParams.get("propertyId");
  
  const rawMethod = searchParams.get("method") || "SSLCommerz";
  const paymentMethod = rawMethod.replace(/[-_]/g, " ").toUpperCase();

  // 🛠️ রিভিউর জন্য স্টেট
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isReviewed, setIsReviewed] = useState<boolean>(false);

  // 🛠️ রিভিউ সাবমিট হ্যান্ডলার
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId) {
      toast.error("Property ID not found!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 🛠️ axiosInstance ইন্টারসেপ্টর টোকেন হ্যান্ডেল করায় headers রিমুভ করা হয়েছে
      const response = await axiosInstance.post("/reviews", {
        propertyId,
        rating,
        comment
      });

      const data = response.data;

      if (data.success) {
        toast.success("Thank you for your valuable review!");
        setIsReviewed(true);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong while submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-base-100">
      <div className="max-w-md w-full card bg-base-100 border border-base-200 shadow-xl rounded-3xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />

        <div className="flex justify-center">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-full text-emerald-500 animate-bounce">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>

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
            <span className="text-base-content/50 font-medium">Payment Method</span>
            <span className="font-bold text-base-content flex items-center gap-1">
              <Wallet className="w-4 h-4 text-primary" /> {paymentMethod}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-base-200/60 pb-2">
            <span className="text-base-content/50 font-medium">Payment Gateway</span>
            <span className="font-semibold text-base-content/80 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-400" /> SSLCommerz
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-base-content/50 font-medium">Status</span>
            <span className="badge badge-success badge-sm font-bold text-[10px] tracking-wide uppercase px-2.5 py-2 rounded-md">
              COMPLETED
            </span>
          </div>
        </div>

        {/* 🛠️ Improved Responsive & Beautiful Review Section */}
        {propertyId && !isReviewed && (
          <div className="border border-base-200 rounded-2xl p-5 text-left bg-base-200/30 space-y-4 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-base-content flex items-center gap-1.5">
                <Star className="w-4 h-4 text-warning fill-warning animate-pulse" /> Rate Your Experience
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-warning/10 text-warning-content">
                {rating} / 5
              </span>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Responsive Lucid-React Interactive Star Group */}
              <div className="flex items-center justify-center gap-1.5 py-1 bg-base-100 rounded-xl border border-base-200/60 shadow-inner">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = hoveredRating !== null ? star <= hoveredRating : star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="p-1 sm:p-2 transition-transform duration-150 hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                          isFilled 
                            ? "text-warning fill-warning" 
                            : "text-base-content/20 fill-transparent"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Enhanced Comment Box */}
              <div className="form-control w-full">
                <textarea
                  className="textarea textarea-bordered w-full text-xs sm:text-sm rounded-xl focus:textarea-primary focus:outline-none transition-all duration-200 bg-base-100 placeholder:text-base-content/40 resize-none shadow-sm"
                  placeholder="Tell us about the property, landlord behaviour, or location convenience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-sm sm:btn-md btn-primary w-full rounded-xl normal-case font-bold shadow-md hover:shadow-lg text-xs sm:text-sm transition-all"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </div>
        )}

        {isReviewed && (
          <div className="alert alert-success text-xs sm:text-sm rounded-xl py-3 font-semibold shadow-sm text-success-content flex justify-center gap-2">
            ✨ Review submitted successfully! Thank you.
          </div>
        )}

        <div className="flex gap-2.5 items-start text-left bg-info/5 border border-info/20 text-info-content text-xs p-3.5 rounded-xl">
          <Calendar className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <p className="text-base-content/70 font-medium leading-relaxed">
            Your application status is updated to <span className="font-bold text-emerald-600">COMPLETED</span>. The landlord has been notified to execute move-in protocols.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link 
            href="/dashboard/my-rentals" 
            className="btn btn-primary flex-1 gap-2 rounded-xl normal-case font-bold order-2 sm:order-1"
          >
            <ClipboardList className="w-4 h-4" />
            View Rentals
          </Link>
          <Link 
            href="/" 
            className="btn btn-neutral btn-outline flex-1 gap-2 rounded-xl normal-case font-bold order-1 sm:order-2"
          >
            <Home className="w-4 h-4" />
            Go Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}