"use client"; 

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname ? pathname.startsWith("/dashboard") : false;

  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-base-100 antialiased">
        {!isDashboard && <Navbar />}

        {/* যদি ড্যাশবোর্ড হয় তবে সরাসরি চাইল্ড রেন্ডার হবে, কোনো ফ্লেক্স কনফ্লিক্ট ছাড়া */}
        {isDashboard ? (
          children
        ) : (
          <main className="flex-1">
            {children}
          </main>
        )}

        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}