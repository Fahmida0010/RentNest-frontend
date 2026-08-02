"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Home,
  ClipboardList,
  PlusCircle,
  CreditCard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) return null;

  const menu = {
    TENANT: [
      { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
      { label: "My Rentals", path: "/dashboard/my-rentals", icon: ClipboardList },
      { label: "Payment History", path: "/dashboard/payment-history", icon: CreditCard },
    ],
    LANDLORD: [
      { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
      { label: "Add Property", path: "/dashboard/add-property", icon: PlusCircle },
      { label: "My Properties", path: "/dashboard/my-properties", icon: PlusCircle },
      { label: "Manage Requests", path: "/dashboard/manage-requests", icon: ClipboardList },
      { label: "Payment History", path: "/dashboard/landpayment-history", icon: CreditCard },
    ],
    ADMIN: [
      { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
      { label: "Manage Users", path: "/dashboard/manage-users", icon: Users },
      { label: "All Properties", path: "/dashboard/all-properties", icon: Home },
      { label: "All Rentals", path: "/dashboard/all-rentals", icon: ClipboardList },
    ],
  };

  const menus = menu[user.role as keyof typeof menu] || [];

  const renderNavLinks = (isMobile: boolean = false) => {
    return menus.map((item) => {
      const Icon = item.icon;
      const active = item.path === "/dashboard" 
        ? pathname === "/dashboard" 
        : pathname.startsWith(item.path);

      return (
        <li key={item.path}>
          <Link
            href={item.path}
            onClick={() => {
              if (isMobile) setIsMobileOpen(false);
            }}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all ${
              active 
                ? "bg-slate-950 text-white shadow-lg" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-500"}`} />
            <span>{item.label}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-800">
      
      {/* ১. ডেস্কটপ সাইডবার (বড় স্ক্রিনে বামে ফিক্সড থাকবে, স্ক্রিন লক করবে না) */}
      <aside className="hidden lg:flex w-64 h-screen bg-white border-r border-slate-200 flex-col justify-between sticky top-0 shrink-0">
        <div>
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs font-bold text-slate-600 uppercase">{user.role}</span>
            </div>
          </div>

          <div className="p-4">
            <ul className="space-y-1">
              {renderNavLinks(false)}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={logout}
            className="btn btn-ghost hover:bg-red-50 hover:text-red-600 text-slate-600 w-full justify-start gap-3 rounded-xl font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ২. মোবাইল রেসপন্সিভ ড্রয়ার (শুধুমাত্র lg স্ক্রিনের নিচে কাজ করবে) */}
      <div className={`fixed inset-0 z-50 flex lg:hidden ${isMobileOpen ? "visible" : "invisible"}`}>
        {/* ব্যাকড্রপ ওভারলে - শুধুমাত্র তখনই দেখাবে যখন মোবাইল মেনু ট্রিপড হবে */}
        <div 
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`} 
          onClick={() => setIsMobileOpen(false)} 
        />
        
        {/* মোবাইল স্লাইডিং মেনু */}
        <aside className={`relative w-64 max-w-xs bg-white h-full flex flex-col justify-between z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div>
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full uppercase mt-1 inline-block">
                  {user.role}
                </span>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)} 
                className="btn btn-sm btn-circle btn-ghost text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <ul className="space-y-1">
                {renderNavLinks(true)}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 p-4">
            <button 
              onClick={logout} 
              className="btn btn-ghost hover:bg-red-50 hover:text-red-600 text-slate-600 w-full justify-start gap-3 rounded-xl font-semibold"
            >
              <LogOut className="w-5 h-5" /> 
              Sign Out
            </button>
          </div>
        </aside>
      </div>

      {/* ৩. মেইন পেজ কন্টেন্ট এরিয়া */}
      <div className="flex flex-col flex-1 min-h-screen w-full min-w-0">
        {/* মোবাইলের টপ বার */}
        <div className="navbar bg-white border-b border-slate-200 lg:hidden sticky top-0 z-30 px-4 min-h-[64px]">
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="btn btn-square btn-ghost text-slate-700 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-lg ml-2 text-slate-900">Dashboard</div>
        </div>

        {/* মেইন পেজ রেন্ডার এরিয়া */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}