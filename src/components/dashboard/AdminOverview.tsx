"use client";

import { useEffect, useState } from "react";
import { Users, Home, CheckCircle, ClipboardList } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface OverviewData {
  totalUsers: number;
  availableProperties: number;
  rentedProperties: number;
  totalRentalRequests: number;
}

export default function AdminOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axiosInstance.get("/admin/overview");
        const result = res.data;

        if (result.success) {
          setData(result.data);
        } else {
          setError("ডাটা লোড করতে ব্যর্থ হয়েছে।");
        }
      } catch (err) {
        setError("সার্ভারে যোগাযোগ করা যাচ্ছে না।");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  // স্ট্যাটাস কার্ডের ডাটা অ্যারে
  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Available Properties",
      value: data?.availableProperties || 0,
      icon: Home,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Rented Properties",
      value: data?.rentedProperties || 0,
      icon: CheckCircle,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Total Rental Requests",
      value: data?.totalRentalRequests || 0,
      icon: ClipboardList,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Global Overview</h1>
        <p className="text-gray-500">Platform Health & Real-time Statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card bg-base-100 shadow-sm border p-6 flex flex-row items-center justify-between rounded-2xl">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-base-content">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}