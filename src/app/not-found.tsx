"use client";

import Link from "next/link";
import { MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 text-slate-800 px-6 font-sans">
      <div className="text-center max-w-md">
        {/* Big 404 Header */}
        <h1 className="text-9xl font-black 
        text-red-900
         tracking-widest select-none 
         animate-pulse">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl font-bold mt-4 text-slate-900">
          Page Not Found
        </h2>
        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          Oops! The page you are looking for doesn't exist or has been moved. 
          Double check the URL or head back to safety.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium text-sm shadow-xs hover:bg-slate-100 hover:text-slate-950 transition-all duration-200 cursor-pointer"
          >
            <MoveLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm shadow-xs hover:bg-slate-800 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}