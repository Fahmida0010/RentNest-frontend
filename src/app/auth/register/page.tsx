"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "tenant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ১. ফোন নম্বর ভ্যালিডেশন (সুনির্দিষ্ট চেক)
    if (formData.phone.length !== 11) {
      setError("Phone number must be exactly 11 digits long.");
      return;
    }
    if (!/^[0-9]+$/.test(formData.phone)) {
      setError("Phone number must contain only numbers.");
      return;
    }

    // ২. পাসওয়ার্ড ভ্যালিডেশন (সুনির্দিষ্ট ও নিখুঁত এরর হ্যান্ডলিং)
    if (formData.password.length < 6) {
      setError("Password is too short. It must be at least 6 characters long.");
      return;
    }
    if (!/[a-zA-Z]/.test(formData.password)) {
      setError("Password must include at least one letter (a-z, A-Z).");
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must include at least one number (0-9).");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must include at least one special character (e.g., !, @, #, $, %).");
      return;
    }

   try {
  setLoading(true);
  const response = await axiosInstance.post("/auth/login", formData); // রেজিস্ট্রেশনের জন্য /auth/register

  const apiResponse = response.data; 

  // ব্যাকএন্ডের 'accessToken' কি (key) অনুযায়ী কন্ডিশন আপডেট করা হলো
  if (apiResponse?.success && apiResponse?.data?.accessToken) {
    const token = apiResponse.data.accessToken; // 'token' এর বদলে 'accessToken'
    const user = apiResponse.data.user;

    // ১. কুকি সেট করা
    Cookies.set("token", token, { expires: 7 });
    if (user) {
      // ইউজার অবজেক্ট সরাসরি কুকিতে রাখার সময় স্ট্রিংফাই করে নেওয়া হলো
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
    }

    // ২. রোল রিড করে ইনস্ট্যান্ট ড্যাশবোর্ডে রিডাইরেক্ট
    const userRole = user?.role || "tenant"; 
    
    router.push('/dashboard');
    router.refresh(); // নেভবার ও লেআউটের স্টেট সিঙ্ক করার জন্য মাস্ট
  } else {
    setError("Invalid response from server.");
  }
} catch (err: any) {
  setError(err.response?.data?.message || "Something went wrong. Try again.");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side: Real Reliable Unsplash Apartment Image */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative items-center justify-center p-12"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 drop-shadow-md">Join Our Network</h1>
          <p className="text-lg text-slate-100 drop-shadow-md">Unlock the easiest way to rent properties, securely handle agreements, and streamline communication.</p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-slate-500">Sign up today and get started</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="example@rentnest.com" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800" />
            </div>

            {/* Phone Number Input Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="01712345678" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative mt-1">
                <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-slate-400 hover:text-slate-600 focus:outline-none">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Register As</label>
              <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white cursor-pointer">
                <option value="tenant">Tenant (ভাড়াটিয়া)</option>
                <option value="landlord">Landlord (বাড়িওয়ালা)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.99] transition-all shadow-lg shadow-blue-500/20 disabled:bg-slate-300 mt-2">
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-blue-600 hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}