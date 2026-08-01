"use client";

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';

interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  categoryName: string;
  amenities: string[];
  images: string[];
}

const AddProperty: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    location: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    categoryName: '',
    amenities: [],
    images: [],
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' ? Number(value) : value,
    }));
  };

  // Amenities যোগ করা
  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  };

  // Images URL যোগ করা
  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  // আইটেম রিমুভ করা
  const handleRemoveItem = (type: 'amenities' | 'images', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/landlord/properties', formData);

      if (response.data.success) {
        // সফল হলে SweetAlert দেখাবে
        Swal.fire({
          title: 'Success!',
          text: response.data.message || 'Property added successfully and saved to DB!',
          icon: 'success',
          confirmButtonColor: '#2563EB', // Tailwind blue-600
        });

        // ফর্ম রিসেট
        setFormData({
          title: '',
          description: '',
          location: '',
          price: 0,
          bedrooms: 0,
          bathrooms: 0,
          categoryName: '',
          amenities: [],
          images: [],
        });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add property';
      
      Swal.fire({
        title: 'Error!',
        text: errorMsg,
        icon: 'error',
        confirmButtonColor: '#EF4444', // Tailwind red-500
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Property Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Cozy Single Room in Sylhet"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the property..."
          />
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Apartment, Mess, House"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Zindabazar, Sylhet"
            />
          </div>
        </div>

        {/* Price, Bedrooms, Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms || ''}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms || ''}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Gas, Water, Lift"
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.amenities.map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
                {amenity}
                <button type="button" onClick={() => handleRemoveItem('amenities', index)} className="text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URLs</label>
          <div className="flex gap-2 mt-1">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
              placeholder="https://example.com/room.jpg"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {formData.images.map((imgUrl, index) => (
              <div key={index} className="relative group border border-gray-200 rounded p-1">
                <img src={imgUrl} alt="Property" className="h-20 w-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('images', index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white font-medium rounded-md text-center ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving Property...' : 'Submit Property'}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
