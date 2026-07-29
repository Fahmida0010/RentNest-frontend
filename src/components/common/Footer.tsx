import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300">
      {/* Upper Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-base-content/70 mt-2">
            Find and list premium rental properties with ease. RentNest connects landlords and verified tenants seamlessly.
          </p>
        </div>
        
        <div>
          <h6 className="footer-title opacity-100 font-semibold text-base-content mb-3">For Tenants</h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link href="/properties" className="link link-hover">Browse Properties</Link>
            <Link href="/dashboard/tenant" className="link link-hover">Rental Requests</Link>
            <Link href="/help" className="link link-hover">Tenant Guidelines</Link>
          </div>
        </div>

        <div>
          <h6 className="footer-title opacity-100 font-semibold text-base-content mb-3">For Landlords</h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link href="/dashboard/landlord/properties/new" className="link link-hover">List a Property</Link>
            <Link href="/dashboard/landlord" className="link link-hover">Manage Bookings</Link>
            <Link href="/pricing" className="link link-hover">Premium Models</Link>
          </div>
        </div>

        <div>
          <h6 className="footer-title opacity-100 font-semibold text-base-content mb-3">Legal & Support</h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link href="/terms" className="link link-hover">Terms of Service</Link>
            <Link href="/privacy" className="link link-hover">Privacy Policy</Link>
            <Link href="/contact" className="link link-hover">Contact Support</Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-base-300 py-6 text-center text-sm text-base-content/60">
        <p>© {currentYear} RentNest. All rights reserved.</p>
      </div>
    </footer>
  );
}