"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Logo from "./Logo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // States
  const [token, setToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<{name?: string; email?: string; role?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // রাউট চেঞ্জ বা পেজ লোড হলে কুকির স্টেট সিঙ্ক করার জন্য
  useEffect(() => {
    const currentToken = Cookies.get("token");
    setToken(currentToken);

    if (currentToken) {
      // আপনার লগইন/রেজিস্টার সাকসেস হলে যদি Cookies.set("user", JSON.stringify(data.user)) করে থাকেন
      const userData = Cookies.get("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
  }, [pathname]); // প্রতিবার রাউট চেঞ্জ হলে স্টেট রি-চেক করবে

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user"); // ইউজার ডেটা থাকলে রিমুভ করবে
    setToken(undefined);
    setUser(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/auth/login");
    router.refresh(); // পেজ রিফ্রেশ করে ক্লায়েন্ট স্টেট ক্লিন করবে
  };

  return (
    <nav className="w-full bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/properties" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Properties
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>

          {/* Desktop Right Side: Auth / Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="relative">
                {/* Profile Toggle Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 capitalize">{user?.name || "Profile"}</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.email || "user@example.com"}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md capitalize">
                        {user?.role || "User"}
                      </span>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors border-t border-slate-50 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-blue-600 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Responsive Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-3 animate-fade-in">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-50">
            Home
          </Link>
          <Link href="/properties" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-50">
            Properties
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-50">
            About
          </Link>
          
          <div className="pt-4 border-t border-slate-100">
            {token ? (
              <div className="space-y-2 px-3">
                <div className="bg-slate-50 p-3 rounded-xl mb-3">
                  <p className="text-xs text-slate-400">Account info</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md capitalize">
                    {user?.role}
                  </span>
                </div>
                <Link
                  href={`/dashboard/${user?.role || "tenant"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-100 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}