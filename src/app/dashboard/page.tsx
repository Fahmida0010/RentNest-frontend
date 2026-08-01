"use client";

import { useAuth } from "@/hooks/useAuth";
import TenantOverview from "@/components/dashboard/TenantOverview";
import LandlordOverview from "@/components/dashboard/LandlordOverview";
import AdminOverview from "@/components/dashboard/AdminOverview";

export default function DashboardOverview() {
  const { user, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) return null;


  switch (user.role) {
    case "TENANT":
      return <TenantOverview />;
    case "LANDLORD":
      return <LandlordOverview />;
    case "ADMIN":
      return <AdminOverview />;
    default:
      return (
        <div className="text-red-500 font-semibold">
        user role is not recognized. Please contact support.
        </div>
      );
  }
}