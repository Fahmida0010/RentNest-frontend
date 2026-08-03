"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { Pencil, Trash2, Loader2, Plus, MapPin, Tag } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: 'AVAILABLE' | 'RENTED';
  category?: {
    name: string;
  };
}

const MyProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // মোডাল ও এডিটিং স্টেটস
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // ১. ল্যান্ডলর্ডের প্রপার্টিজ ফেচ করার ফাংশন
  const loadLandlordProperties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/landlord/my-properties');
      if (response.data && response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to load properties:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Could not fetch your properties.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandlordProperties();
  }, []);

  // ২. ডিলিট বোতামের হ্যান্ডলার
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will permanently delete this property listing!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444', 
      cancelButtonColor: '#6B7280',  
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/landlord/properties/${id}`);
          if (response.data && response.data.success) {
            Swal.fire({
              title: 'Deleted!',
              text: response.data.message || 'Property has been deleted successfully.',
              icon: 'success',
              confirmButtonColor: '#2563EB'
            });
            setProperties((prev) => prev.filter((item) => item.id !== id));
          }
        } catch (error: any) {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete the property.',
            icon: 'error',
            confirmButtonColor: '#EF4444'
          });
        }
      }
    });
  };

  // ৩. আপডেট মোডাল ওপেন করার হ্যান্ডলার
  const openUpdateModal = (property: Property) => {
    setEditingProperty({ ...property });
    setIsModalOpen(true);
  };

  // ৪. মোডালের ডাটা চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProperty) return;
    const { name, value } = e.target;
    setEditingProperty({
      ...editingProperty,
      [name]: name === 'price' ? Number(value) : value
    });
  };

  // ৫. মোডাল সাবমিট করে DB-তে সেভ করার হ্যান্ডলার
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    try {
      setSubmitLoading(true);
      
      const updateData = {
        title: editingProperty.title,
        location: editingProperty.location,
        price: Number(editingProperty.price), 
        categoryName: editingProperty.category?.name || "Uncategorized"
      };

      const response = await axiosInstance.put(
        `/landlord/properties/${editingProperty.id}`, 
        updateData
      );

      if (response.data && response.data.success) {
        Swal.fire({
          title: 'Updated!',
          text: response.data.message || 'Property details updated successfully.',
          icon: 'success',
          confirmButtonColor: '#2563EB'
        });

        setProperties((prev) =>
          prev.map((item) => (item.id === editingProperty.id ? { ...item, ...editingProperty } : item))
        );
        setIsModalOpen(false);
        setEditingProperty(null);
      }
    } catch (error: any) {
      console.error("Backend validation error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to update property.';
      
      Swal.fire({
        title: 'Validation Error!',
        text: typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-gray-600 font-medium">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white shadow-sm rounded-xl mt-4 md:mt-8 border border-gray-200">
      
      {/* 🔹 Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-gray-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">My Property Listings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage all properties you have uploaded to the system</p>
        </div>
        <Link 
          href="/dashboard/add-property" 
          className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-sm gap-2"
        >
          <Plus size={16} /> Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-gray-500 text-base mb-3">You have not listed any properties yet.</p>
          <Link href="/dashboard/add-property" className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4">
            Click here to list your first property
          </Link>
        </div>
      ) : (
        <>
          {/* 📱 1. Mobile View: Optimized Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full tracking-wider ${
                      property.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 my-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Tag size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate">{property.category?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-400 font-medium">Monthly Rent</span>
                    <p className="text-lg font-extrabold text-blue-600">${property.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openUpdateModal(property)}
                      className="flex-1 inline-flex items-center justify-center text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 py-2 rounded-lg font-semibold transition gap-1.5 border border-emerald-200"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 inline-flex items-center justify-center text-sm text-rose-700 bg-rose-50 hover:bg-rose-100/80 py-2 rounded-lg font-semibold transition gap-1.5 border border-rose-200"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 2. Desktop/Tablet View: Premium Responsive Table Layout */}
          <div className="hidden md:block overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 max-w-[220px]">
                        <div className="text-sm font-semibold text-gray-900 truncate" title={property.title}>
                          {property.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <Tag size={13} className="text-gray-400" />
                          {property.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-[180px]">
                        <div className="text-sm text-gray-500 truncate" title={property.location}>
                          {property.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          ${property.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-bold leading-5 rounded-full tracking-wide ${
                          property.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-rose-50 text-rose-700 border border-rose-150'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2.5">
                          <button
                            onClick={() => openUpdateModal(property)}
                            className="p-2 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-100 rounded-lg transition-all shadow-sm"
                            title="Update Property"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 rounded-lg transition-all shadow-sm"
                            title="Delete Property"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 📋 3. Update Property Modal Section */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Update Property</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold transition focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={editingProperty.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={editingProperty.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  value={editingProperty.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editingProperty.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RENTED">RENTED</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition flex items-center shadow-sm"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;