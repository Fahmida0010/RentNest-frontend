"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react";

export default function PaymentFailed() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-base-100">
      <div className="max-w-md w-full card bg-base-100 border border-base-200 shadow-xl rounded-3xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
        {/* Top Decorative Fail Wave Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-error" />

        {/* Fail Icon */}
        <div className="flex justify-center">
          <div className="bg-error/5 dark:bg-error/10 p-4 rounded-full text-error">
            <AlertTriangle className="w-16 h-16" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
            Payment Failed!
          </h1>
          <p className="text-sm text-base-content/60 px-2">
            The transaction could not be processed securely. This can happen due to incorrect credentials or session expiration.
          </p>
        </div>

        {/* Troubleshooting List */}
        <div className="bg-base-200/40 border border-base-200 rounded-2xl p-4 text-left space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5 mb-1">
            <HelpCircle className="w-3.5 h-3.5" /> What can you do?
          </h4>
          <ul className="text-xs text-base-content/70 space-y-1.5 list-disc pl-4 font-medium">
            <li>Verify your internet connection and gateway balance.</li>
            <li>Do not close or refresh the gateway browser tab while processing.</li>
            <li>Your funds are safe; any deduction will be auto-refunded within 48 hours.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link 
            href="/my-rentals" 
            className="btn btn-error text-white flex-1 gap-2 rounded-xl normal-case font-bold order-2 sm:order-1 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>
          <Link 
            href="/" 
            className="btn btn-ghost border border-base-300 flex-1 gap-2 rounded-xl normal-case font-bold order-1 sm:order-2"
          >
            <Home className="w-4 h-4" />
            Home Screen
          </Link>
        </div>
      </div>
    </div>
  );
}