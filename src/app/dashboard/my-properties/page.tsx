"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
// আপনার প্রজেক্টের পাথ অনুযায়ী axiosInstance ইম্পোর্ট করুন
import axiosInstance from '@/lib/axios'; 

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
      // আপনার ব্যাকএন্ডের আপডেট রাউট অনুযায়ী URL পরিবর্তন করতে পারেন (যেমন: `/properties/${editingProperty.id}`)
      const response = await axiosInstance.put(`/landlord/properties/${editingProperty.id}`, {
        title: editingProperty.title,
        location: editingProperty.location,
        price: editingProperty.price,
        status: editingProperty.status
      });

      if (response.data && response.data.success) {
        Swal.fire({
          title: 'Updated!',
          text: response.data.message || 'Property details updated successfully.',
          icon: 'success',
          confirmButtonColor: '#2563EB'
        });

        // লোকাল স্টেট আপডেট করা যাতে পেজ রিফ্রেশ ছাড়া ডাটা চেঞ্জ দেখা যায়
        setProperties((prev) =>
          prev.map((item) => (item.id === editingProperty.id ? { ...item, ...editingProperty } : item))
        );
        setIsModalOpen(false);
        setEditingProperty(null);
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update property.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600 font-medium">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white shadow-md rounded-lg mt-6 md:mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">My Property Listings</h2>
          <p className="text-sm text-gray-500">Manage all properties you have uploaded to the system</p>
        </div>
        <Link 
          href="/dashboard/add-property" 
          className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition shadow"
        >
          + Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">You have not listed any properties yet.</p>
          <Link href="/dashboard/add-property" className="text-blue-600 hover:underline font-semibold">
            Click here to list your first property
          </Link>
        </div>
      ) : (
        <>
          {/* 📱 Mobile View: Card Layout (Visible only on Mobile/Tablet screens) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {properties.map((property) => (
              <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{property.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Category:</span> {property.category?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500 mb-2"><span className="font-medium">Location:</span> {property.location}</p>
                <p className="text-base font-bold text-gray-900 mb-4">${property.price.toLocaleString()}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openUpdateModal(property)}
                    className="flex-1 text-center text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded font-medium transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 text-center text-sm text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 💻 Desktop View: Table Layout (Hidden on Mobile, Visible from Medium screens) */}
          <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{property.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{property.category?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{property.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">${property.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                      <button
                        onClick={() => openUpdateModal(property)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 📋 Update Property Modal Section */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Update Property</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold transition focus:outline-none"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={editingProperty.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editingProperty.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition flex items-center shadow"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
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
