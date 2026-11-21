import type { Metadata } from "next";
import { Suspense } from "react";

import Navbar from "@/components/home/Navbar/Navbar";
import Hero from "@/components/home/Hero/Hero";
import About from "@/components/home/About/About";
import Services from "@/components/home/Services/Services";
import Destinations from "@/components/home/Destinations/Destinations";
import WhyChooseUs from "@/components/home/WhyChooseUs/WhyChooseUs";
import Gallery from "@/components/home/Gallery/Gallery";
import CTA from "@/components/home/CTA/CTA";
import Reviews from "@/components/home/Reviews/Reviews";
import Footer from "@/components/home/Footer/Footer";

const SITE_URL = "https://tesazmarelogistics.co.za";

export const metadata: Metadata = {
  title: "Shuttle Services, Airport Transfers & Tours in Cape Town",

  description:
    "Discover reliable shuttle services, airport transfers, private tours and group transportation with Tesazmare Logistics and Tours. Travel comfortably across Cape Town, the Western Cape and beyond.",

  keywords: [
    "Tesazmare Logistics and Tours",
    "shuttle services Cape Town",
    "airport transfers Cape Town",
    "Cape Town shuttle services",
    "private tours Cape Town",
    "group transport Cape Town",
    "tourist transport South Africa",
    "Western Cape shuttle services",
    "corporate transport Cape Town",
    "private transportation Cape Town",
    "Cape Town sightseeing tours",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: "Tesazmare Logistics and Tours",
    title:
      "Shuttle Services, Airport Transfers & Tours | Tesazmare Logistics and Tours",
    description:
      "Travel with confidence with Tesazmare Logistics and Tours. Explore our shuttle services, airport transfers, private tours and group transportation.",
    images: [
      {
        url: "/images/shuttle-hero.png",
        width: 1200,
        height: 630,
        alt: "Tesazmare Logistics and Tours shuttle transportation services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tesazmare Logistics and Tours | Shuttle Services & Tours",
    description:
      "Reliable shuttle services, airport transfers and private tours across Cape Town and the Western Cape.",
    images: ["/images/shuttle-hero.png"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Tesazmare Logistics and Tours",
  url: SITE_URL,
  inLanguage: "en-ZA",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "Tesazmare Logistics and Tours | Shuttle Services and Tours",
  description:
    "Discover shuttle services, airport transfers, private tours and group transportation with Tesazmare Logistics and Tours.",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#organization`,
  },
  inLanguage: "en-ZA",
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteSchema, homepageSchema]).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <Navbar />
      <Hero />
      <About />
      <Services />
      <Destinations />
      <WhyChooseUs />
      <Gallery />

      <Suspense
        fallback={
          <section className="reviews-section">
            <div className="reviews-container">
              <div className="reviews-heading">
                <span className="reviews-eyebrow">CUSTOMER EXPERIENCES</span>
                <h2>
                  What Our Customers <span>Say.</span>
                </h2>
                <p>Loading customer experiences...</p>
              </div>
            </div>
          </section>
        }
      >
        <Reviews />
      </Suspense>

      <CTA />
      <Footer />
    </main>
  );
}
