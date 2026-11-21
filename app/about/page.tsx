import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/home/Navbar/Navbar";
import Footer from "@/components/home/Footer/Footer";
import "./About.css";

export const metadata: Metadata = {
  title: "About Us | Shuttle Services in Cape Town",

  description:
    "Learn about Tesazmare Logistics and Tours, a Cape Town transportation company providing convenient shuttle services, airport transfers, private transport, group travel and tours across the Western Cape.",

  keywords: [
    "Tesazmare Logistics and Tours",
    "about Tesazmare",
    "shuttle company Cape Town",
    "transportation company Cape Town",
    "airport transfers Cape Town",
    "private shuttle services",
    "group transportation Western Cape",
    "Cape Town tours and transfers",
    "Western Cape transport services",
  ],

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://tesazmarelogistics.co.za/about",
    siteName: "Tesazmare Logistics and Tours",
    title: "About Tesazmare Logistics and Tours",
    description:
      "Discover Tesazmare Logistics and Tours and our commitment to convenient shuttle transportation, private transfers and travel experiences in Cape Town and the Western Cape.",
    images: [
      {
        url: "/images/services/game-drive-transfers.png",
        width: 1200,
        height: 630,
        alt: "Tesazmare Logistics and Tours transportation services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Us | Tesazmare Logistics and Tours",
    description:
      "Get to know Tesazmare Logistics and Tours, providing shuttle transportation and travel solutions in Cape Town and the Western Cape.",
    images: ["/images/services/game-drive-transfers.png"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-overlay" />

          <div className="about-hero-content">
            <span>GET TO KNOW US</span>
            <h1>About TESAZMARE Logistics</h1>
            <p>
              Connecting people to places through comfortable, convenient and
              dependable shuttle transportation.
            </p>

            <div className="about-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <strong>About Us</strong>
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="about-intro">
          <div className="about-intro-container">
            <div className="about-intro-image">
              <Image
                src="/images/services/game-drive-transfers.png"
                alt="Shuttle transportation by TESAZMARE Logistics"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <div className="about-image-label">
                <span>TESAZMARE LOGISTICS</span>
                <strong>Your Journey Matters</strong>
              </div>
            </div>

            <div className="about-intro-content">
              <span className="about-eyebrow">WHO WE ARE</span>

              <h2>
                Making Every Journey
                <span> Matter.</span>
              </h2>

              <p>
                TESAZMARE Logistics is a transportation company focused on
                providing shuttle services for individuals, groups and
                businesses.
              </p>

              <p>
                We understand that every journey has a purpose. Whether
                travelling to the airport, attending an event, exploring a
                destination or arranging group transport, we aim to make the
                experience convenient and comfortable.
              </p>

              <p>
                Alongside our shuttle services, we also offer additional
                transport and logistics solutions to support different customer
                needs.
              </p>

              <Link href="/services" className="about-main-btn">
                Explore Our Services <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* MISSION AND VISION */}
        <section className="about-purpose">
          <div className="about-section-heading">
            <span className="about-eyebrow">WHAT DRIVES US</span>
            <h2>Our Purpose and Direction</h2>
            <p>
              The values and goals that guide the way we serve our customers.
            </p>
          </div>

          <div className="about-purpose-grid">
            <div className="about-purpose-card">
              <div className="about-purpose-icon">01</div>
              <h3>Our Mission</h3>
              <p>
                To provide convenient and comfortable transportation solutions
                that connect people with their destinations while delivering a
                positive customer experience.
              </p>
            </div>

            <div className="about-purpose-card">
              <div className="about-purpose-icon">02</div>
              <h3>Our Vision</h3>
              <p>
                To build a trusted transportation brand recognised for its
                customer-focused approach and commitment to making journeys
                easier.
              </p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="about-why">
          <div className="about-why-container">
            <div className="about-why-heading">
              <span className="about-eyebrow">THE TESAZMARE EXPERIENCE</span>
              <h2>Why Choose TESAZMARE?</h2>
              <p>
                We focus on making transportation easier through services
                designed around different travel needs.
              </p>
            </div>

            <div className="about-why-grid">
              <div className="about-why-card">
                <span>01</span>
                <h3>Customer Focused</h3>
                <p>
                  We value our customers and aim to provide a helpful and
                  welcoming experience.
                </p>
              </div>

              <div className="about-why-card">
                <span>02</span>
                <h3>Travel Convenience</h3>
                <p>
                  Transportation options for airport transfers, private trips,
                  events and group travel.
                </p>
              </div>

              <div className="about-why-card">
                <span>03</span>
                <h3>Comfortable Journeys</h3>
                <p>
                  We aim to make every trip a comfortable and enjoyable travel
                  experience.
                </p>
              </div>

              <div className="about-why-card">
                <span>04</span>
                <h3>Flexible Solutions</h3>
                <p>
                  A range of transportation and additional logistics services
                  for different requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMMITMENT */}
        <section className="about-commitment">
          <div className="about-commitment-content">
            <span className="about-eyebrow">OUR COMMITMENT</span>

            <h2>
              Every Journey Deserves
              <span> Attention.</span>
            </h2>

            <p>
              From your first enquiry to reaching your destination, we want your
              experience with TESAZMARE Logistics to be straightforward and
              convenient.
            </p>

            <Link href="/contact" className="about-main-btn">
              Talk to Our Team <span>→</span>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="about-bottom-cta">
          <div>
            <span>LET'S GET YOU MOVING</span>
            <h2>Where Would You Like to Go?</h2>
            <p>Let TESAZMARE Logistics be part of your next journey.</p>
          </div>

          <Link href="/booking">
            Book Your Shuttle <span>→</span>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
