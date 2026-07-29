"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
      {/* 1. Background Video Player */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* একটি প্রফেশনাল রিয়েল এস্টেট/অ্যাপার্টমেন্ট ইন্টারিয়র অনলাইন ভিডিও */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-apartment-4433-large.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Dark Overlay - ভিডিওর ওপর টেক্সট যেন ক্লিয়ারলি পড়া যায় */}
        <div className="absolute inset-0 bg-neutral-900/60 mix-blend-multiply" />
      </div>

      {/* 2. Hero Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8 text-neutral-content">
        <div className="badge badge-primary gap-2 p-3 font-medium text-white shadow-lg animate-fade-in">
          🏠 Find & List Rental Properties with Ease
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
          Discover Your Perfect <span className="text-primary">Nest</span> To Rent
        </h1>
        
        <p className="text-base md:text-xl max-w-2xl mx-auto text-neutral-200 drop-shadow">
          Connect directly with verified landlords, browse thousands of secure listings, and complete payments seamlessly.
        </p>

        {/* Dynamic Search Input Bar */}
        <div className="bg-base-100 p-2 rounded-xl shadow-2xl border border-base-200 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto text-base-content">
          <div className="flex items-center gap-2 px-3 flex-1 py-2 sm:py-0">
            <Search className="text-base-content/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter location, area or city..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <Link href="/properties" className="btn btn-primary sm:btn-md btn-block sm:w-auto text-white">
            Search Now
          </Link>
        </div>
      </div>
    </section>
  );
}