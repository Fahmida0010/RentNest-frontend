import {
  Building2,
  ShieldCheck,
  Home,
  Users,
  Search,
  CreditCard,
  Star,
  CheckCircle,
  Link,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Property Search",
    description:
      "Discover rental properties effortlessly using advanced search filters including location, price, amenities, and property type.",
  },
  {
    icon: Home,
    title: "Verified Listings",
    description:
      "Every property is carefully managed to provide tenants with reliable and high-quality rental options.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Complete rental payments safely through trusted online payment gateways with a seamless checkout experience.",
  },
  {
    icon: ShieldCheck,
    title: "Protected Platform",
    description:
      "Role-based authentication and secure access ensure a safe experience for tenants, landlords, and administrators.",
  },
];

const stats = [
  { number: "10K+", label: "Happy Tenants" },
  { number: "2.5K+", label: "Verified Properties" },
  { number: "500+", label: "Trusted Landlords" },
  { number: "99%", label: "Customer Satisfaction" },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      
   
      {/* About */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              About RentNest
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              RentNest is built to modernize the rental experience by bringing
              landlords and tenants together on one intelligent platform. Our
              mission is to eliminate the complexity of property searching,
              rental requests, approval workflows, and secure online payments.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Whether you're looking for your next apartment or managing
              multiple rental properties, RentNest provides intuitive tools that
              make renting simple, efficient, and reliable.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" />
                <span>Role-based dashboards for every user.</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" />
                <span>Fast and responsive property browsing.</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" />
                <span>Secure rental request and payment workflow.</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" />
                <span>Modern UI built for accessibility and performance.</span>
              </div>
            </div>
          </div>

        
        </div>
      </section>
<section
  className="relative h-[500px] overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600')",
  }}
>
  <div className="absolute inset-0 bg-black/60" />

  <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
    <div className="max-w-3xl text-white">
      <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
        Trusted Rental Marketplace
      </span>

      <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
        Find Your Perfect Home with RentNest
      </h1>

      <p className="mt-6 text-lg leading-8 text-gray-200">
        RentNest is a modern rental property marketplace designed to connect
        tenants, landlords, and administrators through a secure, transparent,
        and user-friendly platform.
      </p>
    </div>
  </div>
</section>
      {/* Mission & Vision */}

      <section className="bg-gray-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-10 shadow-lg">
            <Building2 className="mb-5 h-12 w-12 text-blue-600" />

            <h3 className="text-3xl font-bold">Our Mission</h3>

            <p className="mt-5 leading-8 text-gray-600">
              To create a trusted rental ecosystem where tenants can discover
              quality homes and landlords can manage properties efficiently
              using innovative digital solutions.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-lg">
            <Star className="mb-5 h-12 w-12 text-yellow-500" />

            <h3 className="text-3xl font-bold">Our Vision</h3>

            <p className="mt-5 leading-8 text-gray-600">
              We envision becoming the leading digital rental marketplace by
              providing secure technology, seamless user experiences, and
              transparent property management solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Why Choose RentNest?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
            Everything you need for a smooth rental experience in one platform.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border bg-white p-8 transition hover:-translate-y-2 hover:shadow-xl"
              >
                <Icon className="mb-5 h-12 w-12 text-blue-600" />

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statistics */}

      <section className="bg-blue-500 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 text-center md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <h2 className="text-5xl font-bold">{item.number}</h2>
              <p className="mt-3 text-lg text-blue-100">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
<section className="mx-auto max-w-5xl px-6 py-24 text-center">
  <Users className="mx-auto mb-6 h-14 w-14 text-blue-600" />

  <h2 className="text-4xl font-bold text-gray-900">
    Ready to Find Your Next Home?
  </h2>

  <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
    Join thousands of tenants and landlords who trust RentNest for a smarter,
    faster, and more secure rental experience.
  </p>

  <div className="mt-10">
    <Link
      href="/properties"
      className="inline-flex items-center
       justify-center rounded-xl
        bg-blue-600 px-8 py-4
         text-lg font-semibold text-white 
         shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
    >
      Explore Properties →
    </Link>
  </div>
</section>
    </main>
  );
}