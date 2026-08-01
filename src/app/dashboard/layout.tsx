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
  ShieldCheck,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
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
    ],
    ADMIN: [
      { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
      { label: "Manage Users", path: "/dashboard/manage-users", icon: Users },
      { label: "All Properties", path: "/dashboard/all-properties", icon: Home },
      { label: "All Rentals", path: "/dashboard/all-rentals", icon: ClipboardList },
    ],
  };

  const menus = menu[user.role] || [];

  return (
    // w-full min-h-screen নিশ্চিত করবে যে এটি পুরো স্ক্রিন জুড়ে কাজ করছে
    <div className="drawer lg:drawer-open min-h-screen w-full bg-base-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page Content Area */}
      <div className="drawer-content flex flex-col min-h-screen w-full">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-100 border-b lg:hidden sticky top-0 z-50">
          <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
            <Menu className="w-6 h-6" />
          </label>
          <div className="font-bold text-lg ml-2">Dashboard</div>
        </div>

        {/* Main page children will render here side-by-side with sidebar */}
        <main className="flex-1 p-6 overflow-x-hidden bg-base-200/50">
          {children}
        </main>
      </div>

      {/* Sidebar Area */}
      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-72 min-h-full bg-base-100 border-r flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{user.role}</span>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 p-4">
            <ul className="space-y-2">
              {menus.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                        active ? "bg-primary text-white" : "hover:bg-base-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <button
              onClick={logout}
              className="btn btn-error btn-outline w-full justify-start gap-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}