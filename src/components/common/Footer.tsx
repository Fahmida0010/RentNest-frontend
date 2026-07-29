
"use client";

import Link from "next/link";
import Logo from "./Logo";
import { FaFacebook, FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // সোশাল মিডিয়া লিঙ্কগুলোর নতুন কনফিগারেশন (ডিফল্ট রিয়েল কালার এবং হোভারে গ্রে)
  const socialLinks = [
    { 
      icon: FaFacebook, 
      href: "https://facebook.com", 
      label: "Facebook", 
      defaultColor: "text-[#1877F2]", // Real Facebook Blue
      hoverColor: "hover:text-neutral-500 hover:bg-neutral-100 hover:border-neutral-300" 
    },
    { 
      icon: FaYoutube, 
      href: "https://youtube.com", 
      label: "YouTube", 
      defaultColor: "text-[#FF0000]", // Real YouTube Red
      hoverColor: "hover:text-neutral-500 hover:bg-neutral-100 hover:border-neutral-300" 
    },
    { 
      icon: FaGithub, 
      href: "https://github.com", 
      label: "GitHub", 
      defaultColor: "text-[#24292F]", // Real GitHub Black
      hoverColor: "hover:text-neutral-500 hover:bg-neutral-100 hover:border-neutral-300" 
    },
    { 
      icon: FaLinkedin, 
      href: "https://linkedin.com", 
      label: "LinkedIn", 
      defaultColor: "text-[#0A66C2]", // Real LinkedIn Blue
      hoverColor: "hover:text-neutral-500 hover:bg-neutral-100 hover:border-neutral-300" 
    },
  ];

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 font-sans">
      {/* Upper Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Left Column: Logo, Description & Social Icons */}
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="text-sm text-slate-500 leading-relaxed">
            Find and list premium rental properties with ease. RentNest connects landlords and verified tenants seamlessly.
          </p>
          
          {/* Social Media Links Section */}
          <div className="flex items-center gap-3 mt-2">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs transition-all duration-300 ${social.defaultColor} ${social.hoverColor} hover:shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
        
        {/* Middle Column 1: For Tenants */}
        <div className="flex flex-col gap-4">
          <h6 className="text-sm font-bold uppercase tracking-wider text-slate-800">For Tenants</h6>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/properties" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Browse Properties</Link>
            <Link href="/dashboard/tenant" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Rental Requests</Link>
            <Link href="/help" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Tenant Guidelines</Link>
          </div>
        </div>

        {/* Middle Column 2: For Landlords */}
        <div className="flex flex-col gap-4">
          <h6 className="text-sm font-bold uppercase tracking-wider text-slate-800">For Landlords</h6>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/dashboard/landlord/properties/new" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">List a Property</Link>
            <Link href="/dashboard/landlord" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Manage Bookings</Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Premium Models</Link>
          </div>
        </div>

        {/* Right Column: Legal & Support */}
        <div className="flex flex-col gap-1">
          <h6 className="text-sm font-bold uppercase tracking-wider text-slate-800">Legal & Support</h6>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/terms" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Terms of Service</Link>
            <Link href="/privacy" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Privacy Policy</Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900 hover:underline transition-all duration-200">Contact Support</Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t
       border-slate-200 py-6 text-center text-xs text-slate-400 tracking-wide bg-slate-100/60">
        <p>© {currentYear} RentNest. All rights reserved.</p>
      </div>
    </footer>
  );
}