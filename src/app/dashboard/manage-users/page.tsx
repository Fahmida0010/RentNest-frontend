"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "BLOCKED";
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ১. সব ইউজার ব্যাকএন্ড থেকে নিয়ে আসা
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users");
      if (response.data?.success) {
        setUsers(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ২. ইউজারের স্ট্যাটাস (ACTIVE / BLOCKED) আপডেট করা
  const handleToggleStatus = async (userId: string, currentStatus: "ACTIVE" | "BLOCKED") => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try {
      setActionLoadingId(userId);
      setError("");

      const response = await axiosInstance.patch(`/admin/users/${userId}`, {
        status: newStatus,
      });

      if (response.data?.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 mt-4">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-xs md:text-sm text-slate-500">Manage all registered users, roles, and access controls.</p>
        </div>
        <span className="badge badge-neutral font-semibold self-start sm:self-center py-3 px-4 rounded-xl">
          {users.length} Total Users
        </span>
      </div>

      {error && (
        <div className="alert alert-error mb-6 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl">
          <span>{error}</span>
        </div>
      )}

      {users.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          No users found.
        </div>
      ) : (
        <>
          {/* ১. মোবাইল ভিউ: স্মল স্ক্রিনে গ্রিড/কার্ড মেথড */}
          <div className="block md:hidden grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 relative transition-all hover:shadow-sm"
              >
                {/* নাম ও রোল */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{user.name}</h3>
                    <p className="text-xs text-slate-500 break-all">{user.email}</p>
                  </div>
                  <span
                    className={`badge font-semibold text-[10px] py-2 px-2.5 rounded-lg border-none ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-700"
                        : user.role === "LANDLORD"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="h-px bg-slate-200/60 my-1" />

                {/* স্ট্যাটাস ও অ্যাকশন বাটন */}
                <div className="flex justify-between items-center mt-1">
                  <span
                    className={`badge font-medium text-xs py-2.5 px-3 rounded-xl border-none ${
                      user.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {user.status}
                  </span>

                  <div>
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-slate-400 italic font-medium px-3">Protected</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        disabled={actionLoadingId === user.id}
                        className={`btn btn-sm text-xs font-semibold rounded-xl border-none transition-all px-4 ${
                          user.status === "ACTIVE"
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {actionLoadingId === user.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : user.status === "ACTIVE" ? (
                          "Block"
                        ) : (
                          "Unblock"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ২. ডেস্কটপ ভিউ: বড় স্ক্রিনে টেবিল মেথড */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="table w-full text-slate-800">
              <thead className="bg-slate-50 text-slate-700 font-semibold text-sm border-none">
                <tr>
                  <th className="rounded-l-xl py-4">Name</th>
                  <th className="py-4">Email</th>
                  <th className="py-4">Role</th>
                  <th className="py-4">Status</th>
                  <th className="text-right rounded-r-xl py-4 pr-6">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="font-medium text-slate-900 py-4">{user.name}</td>
                    <td className="text-slate-600 py-4">{user.email}</td>
                    <td className="py-4">
                      <span
                        className={`badge font-semibold text-xs py-2 px-2.5 rounded-lg border-none ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : user.role === "LANDLORD"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`badge font-medium text-xs py-2.5 px-3 rounded-xl border-none ${
                          user.status === "ACTIVE" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="text-right py-4 pr-6">
                      {user.role === "ADMIN" ? (
                        <span className="text-xs text-slate-400 italic font-medium">Protected</span>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          disabled={actionLoadingId === user.id}
                          className={`btn btn-sm font-semibold rounded-xl border-none transition-all ${
                            user.status === "ACTIVE"
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                        >
                          {actionLoadingId === user.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : user.status === "ACTIVE" ? (
                            "Block User"
                          ) : (
                            "Unblock User"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}