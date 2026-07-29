"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 drop-shadow-md">Find Your Dream Nest</h1>
          <p className="text-lg text-slate-100 drop-shadow-md">Connecting landlords and premium tenants flawlessly. Manage your rentals with absolute peace of mind.</p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500">Please enter your details to sign in</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="example@rentnest.com" className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800" />
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

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.99] transition-all shadow-lg shadow-blue-500/20 disabled:bg-slate-300">
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}