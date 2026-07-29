"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, LayoutDashboard, Home, Building2, Info, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // ড্যাশবোর্ড পাথের হেল্পার ফাংশন (রোল অনুযায়ী রাউটিং)
  const getDashboardPath = (role: string) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "landlord") return "/dashboard/landlord";
    return "/dashboard/tenant";
  };

  // ডাইনামিক নেভিগেশন লিঙ্কস (মোবাইল ও ডেক্সটপ দুটোর জন্যই)
  const navLinks = (
    <>
      <li>
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          <Home className="w-4 h-4" /> Home
        </Link>
      </li>
      <li>
        <Link href="/properties" className={pathname === "/properties" ? "active" : ""}>
          <Building2 className="w-4 h-4" /> Properties
        </Link>
      </li>
      <li>
        <Link href="/about" className={pathname === "/about" ? "active" : ""}>
          <Info className="w-4 h-4" /> About
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-50 px-4 md:px-8">
      {/* Navbar Start: Brand Logo & Mobile Menu Trigger */}
      <div className="navbar-start flex items-center">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-1 mr-2">
            <Menu className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 gap-1 border border-base-200"
          >
            {navLinks}
          </ul>
        </div>
        
        {/* বাকি লোগো ডিলিট করে শুধু RentNest টেক্সট লোগো রাখা হলো */}
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          RentNest
        </Link>
      </div>

      {/* Navbar Center: Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          {navLinks}
        </ul>
      </div>

      {/* Navbar End: Auth Control */}
      <div className="navbar-end gap-2">
        {user ? (
          /* লগইন করা থাকলে: প্রোফাইল ড্রপডাউন */
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder border border-primary/20">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span className="text-xs font-bold">
                    {user.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-box w-56 border border-base-200 gap-2"
            >
              <li className="px-2 py-1.5 border-b border-base-200 mb-1">
                <div className="flex flex-col items-start p-0">
                  <span className="font-semibold text-base-content">{user.name}</span>
                  <span className="text-xs uppercase badge badge-sm badge-outline badge-primary mt-1">
                    {user.role}
                  </span>
                </div>
              </li>
              <li>
                <Link href={getDashboardPath(user.role)}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </li>
              <li>
                <button onClick={logout} className="text-error font-medium">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          /* লগইন করা না থাকলে: ক্লিন স্ট্যান্ডার্ড বাটন */
          <Link href="/login" className="btn btn-primary btn-sm px-4 text-white flex items-center gap-2 normal-case rounded-md">
            <LogIn className="w-4 h-4" /> Login
          </Link>
        )}
      </div>
    </div>
  );
}