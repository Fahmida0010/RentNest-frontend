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

  // ১. সব ইউজার ব্যাকএন্ড থেকে নিয়ে আসা
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
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">Manage all registered users, roles, and access controls.</p>
        </div>
        <span className="badge badge-neutral font-semibold">{users.length} Total Users</span>
      </div>

      {error && (
        <div className="alert alert-error mb-4 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="table w-full text-slate-800">
          {/* Table Head */}
          <thead className="bg-slate-50 text-slate-700 font-semibold text-sm">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="font-medium text-slate-900">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge font-semibold text-xs py-2 px-2.5 rounded-lg ${
                        user.role === "ADMIN"
                          ? "badge-error bg-red-100 text-red-700 border-none"
                          : user.role === "LANDLORD"
                          ? "badge-info bg-blue-100 text-blue-700 border-none"
                          : "badge-success bg-green-100 text-green-700 border-none"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge font-medium text-xs ${
                        user.status === "ACTIVE" 
                          ? "badge-success bg-emerald-100 text-emerald-700 border-none" 
                          : "badge-warning bg-amber-100 text-amber-700 border-none"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="text-right">
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-slate-400 italic">Protected</span>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}