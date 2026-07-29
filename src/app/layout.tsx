import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <Navbar />

        {children}

        <Footer />

      </body>
    </html>
  );
}