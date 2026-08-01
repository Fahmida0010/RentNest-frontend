"use client";

import { useEffect, useState } from "react";
import { Home, ClipboardCheck, DollarSign } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface LandlordStats {
  totalProperties: number;
  activeRequests: number;
  totalEarnings: number;
}

export default function LandlordOverview() {
  const [data, setData] = useState<LandlordStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const res = await axiosInstance.get("/landlord-overview"); 
        const result = await res.data;

        if (result.success) {
          setData(result.data);
        } else {
          setError("Data fetching failed.");
        }
      } catch (err) {
        setError("Server is not responding.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  const stats = [
    {
      title: "Total Properties",
      value: data?.totalProperties || 0,
      icon: Home,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Active Requests",
      value: data?.activeRequests || 0,
      icon: ClipboardCheck,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Total Earnings",
      value: `$${data?.totalEarnings.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Landlord Overview</h1>
        <p className="text-gray-500">Your real-time property and earnings information</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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