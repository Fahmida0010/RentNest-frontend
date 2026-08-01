"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';
import { Loader2, CheckCircle2, XCircle, Calendar, Mail, Phone, User, Home, DollarSign } from 'lucide-react';

interface RequestData {
  id: string;
  moveInDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
  createdAt: string;
  property: {
    title: string;
    price: number;
    location: string;
  };
  tenant: {
    name: string;
    email: string;
    phone: string;
  };
}

const ManageRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ১. ল্যান্ডলর্ডের কাছে আসা সকল রেন্টাল রিকোয়েস্ট ফেচ করা
  const loadLandlordRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/landlord/requests');
      if (response.data && response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to load requests:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Could not fetch rental requests.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandlordRequests();
  }, []);

  // ২. রিকোয়েস্ট স্ট্যাটাস আপডেট হ্যান্ডলার (APPROVED / REJECTED)
  const handleStatusUpdate = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const isApprove = newStatus === 'APPROVED';
    
    Swal.fire({
      title: isApprove ? 'Approve Request?' : 'Reject Request?',
      text: isApprove 
        ? "Approving this will automatically rent out the property and reject other pending requests for it."
        : "Are you sure you want to reject this rental application?",
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#10B981' : '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: isApprove ? 'Yes, Approve!' : 'Yes, Reject!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setActionLoadingId(id);
          
          // ব্যাকএন্ড রাউট: PATCH /landlord/requests/:id
          const response = await axiosInstance.patch(`/landlord/requests/${id}`, {
            status: newStatus
          });

          if (response.data && response.data.success) {
            Swal.fire({
              title: isApprove ? 'Approved!' : 'Rejected!',
              text: response.data.message || `Request has been ${newStatus.toLowerCase()} successfully.`,
              icon: 'success',
              confirmButtonColor: '#2563EB'
            });

            // রিয়েল-টাইম লোকাল স্টেট রিফ্রেশ/আপডেট
            // যদি APPROVED হয়, ব্যাকএন্ড লজিক অনুযায়ী ওই প্রপার্টির বাকি সব PENDING রিকোয়েস্ট রিজেক্ট হয়ে যাবে। তাই পুরো লিস্টটি রি-ফেচ করাই সবচেয়ে নিরাপদ।
            if (isApprove) {
              loadLandlordRequests();
            } else {
              setRequests((prev) =>
                prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
              );
            }
          }
        } catch (error: any) {
          Swal.fire({
            title: 'Action Failed!',
            text: error.response?.data?.message || 'Failed to update request status.',
            icon: 'error',
            confirmButtonColor: '#EF4444'
          });
        } finally {
          setActionLoadingId(null);
        }
      }
    });
  };

  // স্ট্যাটাস পিল কালার ডিফাইন করা
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-gray-600 font-medium">Loading rental requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white shadow-md rounded-xl mt-6 md:mt-10 border border-gray-100">
      {/* Page Header */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Rental Requests</h2>
        <p className="text-sm text-gray-500">Review, approve, or reject incoming rental applications from prospective tenants.</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-gray-500 text-lg">No rental requests received yet.</p>
          <p className="text-sm text-gray-400 mt-1">When tenants apply to rent your properties, they will appear here.</p>
        </div>
      ) : (
        <>
          {/* 📱 Mobile View: Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {requests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-xs text-gray-400 font-mono">ID: #{request.id.slice(-6)}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                {/* Property Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                    <Home size={16} className="text-blue-500 shrink-0" />
                    <span>{request.property?.title}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">Location: {request.property?.location}</div>
                  <div className="text-sm font-semibold text-gray-900 ml-5 flex items-center text-blue-600">
                    <DollarSign size={14} />{request.property?.price.toLocaleString()}/mo
                  </div>
                </div>

                {/* Tenant Info */}
                <div className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                    <User size={14} className="text-gray-400" />
                    <span>{request.tenant?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 ml-5">
                    <Mail size={12} />
                    <span>{request.tenant?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 ml-5">
                    <Phone size={12} />
                    <span>{request.tenant?.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Move in Date */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-blue-50/50 p-2 rounded-lg">
                  <Calendar size={14} className="text-blue-500" />
                  <span>Move-in Date: <b>{new Date(request.moveInDate).toLocaleDateString()}</b></span>
                </div>

                {/* Action Buttons */}
                {request.status === 'PENDING' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                      disabled={actionLoadingId === request.id}
                      className="flex-1 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs py-2 rounded-lg font-medium transition gap-1 shadow-sm"
                    >
                      {actionLoadingId === request.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                      disabled={actionLoadingId === request.id}
                      className="flex-1 inline-flex items-center justify-center bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs py-2 rounded-lg font-medium transition gap-1 shadow-sm"
                    >
                      {actionLoadingId === request.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 💻 Desktop View: Table Layout */}
          <div className="hidden md:block overflow-x-auto border border-gray-100 rounded-xl shadow-inner">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant Details</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Move-In Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Property Column */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{request.property?.title}</div>
                      <div className="text-xs text-gray-400 max-w-[200px] truncate">{request.property?.location}</div>
                      <div className="text-xs font-bold text-blue-600 mt-0.5">${request.property?.price.toLocaleString()}/mo</div>
                    </td>
                    
                    {/* Tenant Details Column */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <User size={13} className="text-gray-400" /> {request.tenant?.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} className="text-gray-400" /> {request.tenant?.email}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone size={12} className="text-gray-400" /> {request.tenant?.phone || 'N/A'}
                      </div>
                    </td>

                    {/* Move in Date Column */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(request.moveInDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono block mt-1">
                        Applied: {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {request.status === 'PENDING' ? (
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                            disabled={actionLoadingId === request.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-xs font-semibold shadow-sm border border-emerald-200 disabled:opacity-50"
                            title="Approve Request"
                          >
                            {actionLoadingId === request.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                            disabled={actionLoadingId === request.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-all text-xs font-semibold shadow-sm border border-rose-200 disabled:opacity-50"
                            title="Reject Request"
                          >
                            {actionLoadingId === request.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">No action required</span>
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
};

export default ManageRequests;