"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Building2, 
  ClipboardList, 
  Users, 
  ShieldAlert, 
  Wallet, 
  PlusCircle,
  LayoutDashboard,
  LogOut,
  Home
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  // লোডিং স্টেট হ্যান্ডলিং
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ইউজার লগইন না থাকলে মেসেজ (বা মিডেলওয়্যার দিয়ে রিডিরেক্ট হবে)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <p className="text-error font-semibold">Access Denied. Please Login First.</p>
          <Link href="/login" className="btn btn-primary btn-sm mt-4">Go to Login</Link>
        </div>
      </div>
    );
  }

  // রোল অনুযায়ী ডাইনামিক সাইডবার মেনু কনফিগারেশন
  const menuConfigs: Record<string, { label: string; path: string; icon: any }[]> = {
    tenant: [
      { label: "Overview", path: "/dashboard/tenant", icon: LayoutDashboard },
      { label: "My Rentals", path: "/dashboard/tenant#requests", icon: ClipboardList }, // রিকোয়ারমেন্ট অনুযায়ী রেন্টাল হিস্ট্রি
    ],
    landlord: [
      { label: "Overview", path: "/dashboard/landlord", icon: LayoutDashboard },
      { label: "Add Property", path: "/dashboard/landlord/properties/new", icon: PlusCircle },
      { label: "Manage Requests", path: "/dashboard/landlord/requests", icon: ClipboardList },
    ],
    admin: [
      { label: "Overview", path: "/dashboard/admin", icon: LayoutDashboard },
      { label: "User Management", path: "/dashboard/admin#users", icon: Users },
      { label: "Content Moderation", path: "/dashboard/admin#moderation", icon: ShieldAlert },
    ],
  };

  const currentMenu = menuConfigs[user.role] || [];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content Area */}
      <div className="drawer-content flex flex-col p-6 lg:p-10">
        {/* Mobile Navbar Toggle */}
        <div className="flex items-center justify-between lg:hidden bg-base-100 p-4 rounded-xl shadow-sm mb-6">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <span className="font-bold text-lg capitalize">{user.role} Dashboard</span>
        </div>

        {/* Dynamic Nested Pages (Tenant/Landlord/Admin pages load here) */}
        <div className="flex-grow bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300/50">
          {children}
        </div>
      </div>

      {/* Sidebar Sidebar Container */}
      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="menu p-6 w-80 min-h-full bg-base-100 text-base-content flex flex-col justify-between border-r border-base-200">
          <div>
            {/* Top Brand Info */}
            <div className="mb-8 px-2 flex flex-col gap-1">
              <Link href="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                RentNest
              </Link>
              <span className="text-xs uppercase tracking-wider font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-md w-max mt-2">
                {user.role} Portal
              </span>
            </div>

            {/* Sidebar Navigation Links */}
            <ul className="space-y-1.5">
              <span className="text-xs font-bold text-base-content/40 px-2 mb-2 block uppercase tracking-wider">Navigation</span>
              {currentMenu.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <li key={index}>
                    <Link 
                      href={item.path} 
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                        isActive ? "bg-primary text-primary-content active" : "hover:bg-base-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Action Menu */}
          <div className="pt-4 border-t border-base-200 space-y-2">
            <Link href="/" className="btn btn-ghost btn-block justify-start gap-3 rounded-xl font-medium text-base-content/70">
              <Home className="w-5 h-5" />
              Back to Website
            </Link>
            <button 
              onClick={logout} 
              className="btn btn-ghost btn-block justify-start gap-3 text-error hover:bg-error/10 rounded-xl font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}