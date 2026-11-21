import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/home/Navbar/Navbar";
import Footer from "@/components/home/Footer/Footer";
import "./Services.css";

const mainServices = [
  {
    title: "Shuttle Services",
    slug: "shuttle-services",
    image: "/images/services/shuttle-services.png",
    description:
      "Convenient shuttle transportation for individuals and groups travelling to different destinations.",
    category: "Passenger Transportation",
  },
  {
    title: "Airport Transfers",
    slug: "airport-transfers",
    image: "/images/services/airport-transfers.png",
    description:
      "Arrange transportation to and from the airport for a more convenient travel experience.",
    category: "Airport Transportation",
  },
  {
    title: "Private Transfers",
    slug: "private-transfers",
    image: "/images/services/private-transfers.png",
    description:
      "Private transportation arrangements for personal trips, appointments and other travel needs.",
    category: "Private Travel",
  },
  {
    title: "Group Transportation",
    slug: "group-transportation",
    image: "/images/services/group.png",
    description:
      "Transportation solutions for families, friends, organisations and groups travelling together.",
    category: "Group Travel",
  },
  {
    title: "Game Drive Transfers",
    slug: "game-drive-transfers",
    image: "/images/services/game-drive-transfers.png",
    description:
      "Transport arrangements for guests travelling to and from game drive and wildlife experiences.",
    category: "Leisure Travel",
  },
  {
    title: "Events Transfers",
    slug: "events-transfers",
    image: "/images/services/events.png",
    description:
      "Transportation for guests attending events, functions, celebrations and special occasions.",
    category: "Event Transportation",
  },
];

const additionalServices = [
  {
    title: "Corporate Transport",
    slug: "corporate-transport",
    image: "/images/services/corporate-transport.png",
    description:
      "Transportation arrangements for businesses, employees, meetings and corporate activities.",
  },
  {
    title: "Truck Hire",
    slug: "truck-hire",
    image: "/images/services/truck-hire.png",
    description:
      "Truck hire solutions for customers with transportation and logistics requirements.",
  },
];

export const metadata: Metadata = {
  title: "Shuttle & Transport Services in Cape Town",

  description:
    "Explore shuttle services, airport transfers, private transfers, group transportation, game drive transfers and event transport with Tesazmare Logistics and Tours in Cape Town and across the Western Cape.",

  keywords: [
    "Tesazmare Logistics and Tours",
    "shuttle services Cape Town",
    "transport services Cape Town",
    "airport transfers Cape Town",
    "private transfers Cape Town",
    "group transportation Cape Town",
    "game drive transfers",
    "event transportation Cape Town",
    "corporate transport Cape Town",
    "truck hire South Africa",
    "Western Cape shuttle services",
  ],

  alternates: {
    canonical: "/services",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://tesazmarelogistics.co.za/services",
    siteName: "Tesazmare Logistics and Tours",
    title: "Shuttle & Transport Services | Tesazmare Logistics and Tours",
    description:
      "Discover reliable shuttle transportation, airport transfers, private travel, group transport and additional logistics services.",
    images: [
      {
        url: "/images/services/shuttle-services.png",
        width: 1200,
        height: 630,
        alt: "Shuttle transportation services by Tesazmare Logistics and Tours",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shuttle & Transport Services | Tesazmare Logistics and Tours",
    description:
      "Explore shuttle services, airport transfers, private transfers and group transportation in Cape Town.",
    images: ["/images/services/shuttle-services.png"],
  },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="services-page">
        {/* HERO */}
        <section className="services-hero">
          <div className="services-hero-overlay" />

          <div className="services-hero-content">
            <span>WHAT WE OFFER</span>

            <h1>Transportation Solutions for Every Journey</h1>

            <p>
              Discover TESAZMARE Logistics services, from shuttle transportation
              and airport transfers to group travel and additional logistics
              solutions.
            </p>

            <div className="services-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <strong>Our Services</strong>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="services-intro">
          <span className="services-eyebrow">OUR SERVICES</span>

          <h2>
            Getting You There,
            <span> Made Convenient.</span>
          </h2>

          <p>
            Every journey is different. That's why TESAZMARE Logistics offers a
            range of transportation services to accommodate different travel
            needs. Whether you're travelling alone, with a group or arranging
            transport for an event, explore the services available to you.
          </p>
        </section>

        {/* MAIN SERVICES */}
        <section className="main-services-section">
          <div className="services-section-heading">
            <div>
              <span className="services-eyebrow">PASSENGER TRANSPORTATION</span>
              <h2>Our Shuttle Services</h2>
            </div>

            <p>
              Explore our passenger transportation options and find the service
              that suits your journey.
            </p>
          </div>

          <div className="services-grid">
            {mainServices.map((service, index) => (
              <article className="service-page-card" key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="service-page-image"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  />

                  <span className="service-page-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>

                <div className="service-page-content">
                  <span className="service-page-category">
                    {service.category}
                  </span>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <Link
                    href={`/services/${service.slug}`}
                    className="service-page-link"
                  >
                    Explore Service <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ADDITIONAL SERVICES */}
        <section className="additional-services-section">
          <div className="additional-services-heading">
            <div>
              <span className="services-eyebrow">MORE FROM TESAZMARE</span>
              <h2>Additional Logistics Services</h2>
            </div>

            <p>
              Beyond passenger transportation, we also provide additional
              solutions to support business and logistics requirements.
            </p>
          </div>

          <div className="additional-services-grid">
            {additionalServices.map((service) => (
              <article className="additional-service-card" key={service.slug}>
                <div className="additional-service-image">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 650px) 100vw, 50vw"
                  />
                </div>

                <div className="additional-service-content">
                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <Link href={`/services/${service.slug}`}>
                    Learn More <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="services-bottom-cta">
          <div>
            <span>LET'S PLAN YOUR JOURNEY</span>
            <h2>Looking for the Right Transport Solution?</h2>
            <p>
              Get in touch with TESAZMARE Logistics to discuss your
              transportation requirements.
            </p>
          </div>

          <div className="services-cta-buttons">
            <Link href="/booking" className="services-cta-primary">
              Book Your Shuttle <span>→</span>
            </Link>

            <Link href="/contact" className="services-cta-secondary">
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
