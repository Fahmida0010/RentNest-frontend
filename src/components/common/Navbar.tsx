"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut, LayoutDashboard, Compass } from "lucide-react";
import Logo from "./Logo";
// ইমপোর্ট পাথ তোমার প্রোজেক্টের useAuth হুকের লোকেশন অনুযায়ী চেঞ্জ করে নিবে
// import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  
  // ডামি অথ স্টেট (তোমার রিয়েল useAuth হুক দিয়ে এটা রিপ্লেস করবে)
  const user = { name: "Fahmida Akter", role: "landlord" }; // roles: 'tenant' | 'landlord' | 'admin' | null
  const logout = () => console.log("Logging out...");

  
  const navLinks = (
    <>
      <li>
        <Link href="/properties" className={pathname === "/properties" ? "active" : ""}>
          <Compass className="w-4 h-4" /> Browse Rentals
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-50 px-4 md:px-8">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Dropdown */}
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
        <Logo />
      </div>

      {/* Navbar Center (Desktop Only) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          {navLinks}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span className="text-xs">{user.name.substring(0, 2).toUpperCase()}</span>
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
                <button onClick={logout} className="text-error">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}