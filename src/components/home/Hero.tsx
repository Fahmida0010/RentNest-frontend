"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-neutral-900">
      {/* 1. Background Video Player */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Option A: Modern Living Room (Pexels Public Direct Link) */}
          <source
            src="/videos/rental_apartment.mp4"
            type="video/mp4"
          />


        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 2. Hero Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8 text-neutral-content">
      
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md text-white">
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