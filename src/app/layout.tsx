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

  // ইউআরএল যদি /dashboard দিয়ে শুরু হয়, তবে এটি true হবে
  const isDashboard = pathname ? pathname.startsWith("/dashboard") : false;

  return (
    <html lang="en">
      {/* <body className="min-h-screen flex flex-col"> */}

      <body className={isDashboard ? "min-h-screen bg-base-100" : "min-h-screen flex flex-col"}>

        
        {!isDashboard && <Navbar />}

        <main className="flex-1">
          {children}
        </main>

        {/* ড্যাশবোর্ড না হলে মেইন Footer দেখাবে */}
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}