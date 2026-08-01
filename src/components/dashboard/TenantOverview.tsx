"use client";

import { useEffect, useState } from "react";
import { ClipboardList, CreditCard, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axiosInstance from "@/lib/axios";

interface TenantStats {
  totalRequests: number;
  pendingPayments: number;
  approvedRentals: number;
  chartData: { name: string; value: number }[];
}

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export default function TenantOverview() {
  const [data, setData] = useState<TenantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/tenant-overview");
        const result = await res.data;

        if (result.success) {
          setData(result.data);
        } else {
          setError("Data fetching failed.");
        }
      } catch (err) {
        setError("Server error occurred.");
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
      title: "Total Rental Requests",
      value: data?.totalRequests || 0,
      icon: ClipboardList,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Pending Payments",
      value: data?.pendingPayments || 0,
      icon: CreditCard,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Approved Rentals",
      value: data?.approvedRentals || 0,
      icon: CheckCircle,
      color: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tenant Overview</h1>
        <p className="text-gray-500">Your real-time rental request and payment information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card bg-base-100 shadow-sm border p-6 flex flex-row items-center justify-between rounded-2xl">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Graph Chart Section */}
      <div className="card bg-base-100 border shadow-sm p-6 rounded-2xl">
        <h2 className="text-lg font-bold mb-4">Rental Activity Analysis</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.chartData || []}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={50}>
                {(data?.chartData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}