// app/dashboard/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab"); // ইউআরএল এর ?tab= রিড করার জন্য

  if (!user) return null;

  // --- ADMIN VIEW ---
  if (user.role === "admin") {
    if (tab === "users") return <div>Admin User Management Content</div>;
    if (tab === "moderation") return <div>Admin Content Moderation Content</div>;
    return <div>Admin Overview Dashboard</div>;
  }

  // --- LANDLORD VIEW ---
  if (user.role === "landlord") {
    if (tab === "requests") return <div>Landlord Manage Requests Content</div>;
    return <div>Landlord Overview Dashboard</div>;
  }

  // --- TENANT VIEW (DEFAULT) ---
  if (tab === "requests") return <div>Tenant My Rentals Content</div>;
  return <div>Tenant Overview Dashboard</div>;
}