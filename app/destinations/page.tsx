import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/home/Navbar/Navbar";
import Footer from "@/components/home/Footer/Footer";
import "./Destinations.css";

const destinations = [
  {
    name: "Cape Town",
    slug: "cape-town",
    location: "Western Cape",
    image: "/images/destinations/cape-town.png",
    description:
      "Discover the beauty of Cape Town, from its iconic mountain landscapes and beautiful beaches to its vibrant city attractions.",
    tag: "City Experiences",
  },
  {
    name: "Stellenbosch",
    slug: "stellenbosch",
    location: "Western Cape",
    image: "/images/destinations/stellenbosch.png",
    description:
      "Explore picturesque vineyards, historic architecture and the scenic beauty of the Stellenbosch Winelands.",
    tag: "Wine & Nature",
  },
  {
    name: "Franschhoek",
    slug: "franschhoek",
    location: "Western Cape",
    image: "/images/destinations/franschhoek.png",
    description:
      "Experience the charm of Franschhoek, surrounded by beautiful mountain scenery, vineyards and countryside.",
    tag: "Winelands Escape",
  },
  {
    name: "Hermanus",
    slug: "hermanus",
    location: "Western Cape",
    image: "/images/destinations/hermanus.png",
    description:
      "Enjoy the coastal beauty of Hermanus, known for its ocean views, scenic coastline and relaxed atmosphere.",
    tag: "Coastal Getaway",
  },
  {
    name: "Paarl",
    slug: "paarl",
    location: "Western Cape",
    image: "/images/destinations/paarl.png",
    description:
      "Discover Paarl's beautiful landscapes, historic surroundings and welcoming Winelands experiences.",
    tag: "Winelands",
  },
  {
    name: "Garden Route",
    slug: "garden-route",
    location: "Western Cape",
    image: "/images/destinations/garden-route.png",
    description:
      "Explore one of South Africa's beautiful travel regions, with coastal scenery, forests and charming towns.",
    tag: "Scenic Adventures",
  },
];

export const metadata: Metadata = {
  title: "Shuttle Destinations in Cape Town & Western Cape",

  description:
    "Explore Cape Town, Stellenbosch, Franschhoek, Hermanus, Paarl and the Garden Route with Tesazmare Logistics and Tours. Arrange comfortable shuttle transportation for your next South African travel experience.",

  keywords: [
    "Tesazmare Logistics and Tours",
    "shuttle destinations Cape Town",
    "Cape Town shuttle services",
    "Stellenbosch shuttle transfers",
    "Franschhoek transport services",
    "Hermanus shuttle transfers",
    "Paarl shuttle services",
    "Garden Route transportation",
    "Western Cape travel services",
    "Cape Town private tours",
    "Winelands transportation",
    "South African tourist transportation",
    "Cape Town sightseeing transport",
  ],

  alternates: {
    canonical: "/destinations",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://tesazmarelogistics.co.za/destinations",
    siteName: "Tesazmare Logistics and Tours",
    title: "Explore South African Destinations | Tesazmare Logistics and Tours",
    description:
      "Discover Cape Town, Stellenbosch, Franschhoek, Hermanus, Paarl and the Garden Route. Plan your journey with Tesazmare Logistics and Tours.",
    images: [
      {
        url: "/images/destinations/cape-town.png",
        width: 1200,
        height: 630,
        alt: "Explore Cape Town and Western Cape destinations with Tesazmare Logistics and Tours",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Explore South African Destinations | Tesazmare Logistics and Tours",
    description:
      "Discover beautiful destinations across Cape Town and the Western Cape with comfortable transportation.",
    images: ["/images/destinations/cape-town.png"],
  },
};

export default function DestinationsPage() {
  return (
    <>
      <Navbar />

      <main className="destinations-page">
        {/* HERO */}
        <section className="destinations-hero">
          <div className="destinations-hero-overlay" />

          <div className="destinations-hero-content">
            <span>EXPLORE WITH TESAZMARE</span>

            <h1>Discover Your Next Destination</h1>

            <p>
              From beautiful coastal towns to scenic Winelands, explore
              remarkable destinations with TESAZMARE Logistics.
            </p>

            <div className="destinations-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <strong>Destinations</strong>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="destinations-intro">
          <span className="destinations-eyebrow">PLACES WORTH EXPLORING</span>

          <h2>
            Your Journey Begins
            <span> Here.</span>
          </h2>

          <p>
            Whether you are planning a relaxing coastal escape, a scenic trip
            through the Winelands or an exciting group outing, TESAZMARE
            Logistics offers transportation options to help you reach your
            destination.
          </p>
        </section>

        {/* DESTINATIONS GRID */}
        <section className="destinations-list-section">
          <div className="destinations-list-heading">
            <div>
              <span className="destinations-eyebrow">
                EXPLORE OUR DESTINATIONS
              </span>

              <h2>Where Would You Like to Go?</h2>
            </div>

            <p>
              Find your next travel experience and let us help you plan the
              journey.
            </p>
          </div>

          <div className="destinations-grid">
            {destinations.map((destination, index) => (
              <article className="destination-card" key={destination.slug}>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="destination-image"
                >
                  <Image
                    src={destination.image}
                    alt={`${destination.name} destination`}
                    fill
                    sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  />

                  <span className="destination-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="destination-tag">{destination.tag}</span>
                </Link>

                <div className="destination-card-content">
                  <span className="destination-location">
                    {destination.location}
                  </span>

                  <h3>{destination.name}</h3>

                  <p>{destination.description}</p>

                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="destination-explore-link"
                  >
                    Explore Destination <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* TRAVEL EXPERIENCE */}
        <section className="destination-experience">
          <div className="destination-experience-image">
            <Image
              src="/images/destinations/travel-experience.png"
              alt="Scenic South African travel experience"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="destination-experience-content">
            <span className="destinations-eyebrow">
              MORE THAN JUST A JOURNEY
            </span>

            <h2>
              Enjoy the Journey,
              <span> Not Just the Destination.</span>
            </h2>

            <p>
              Every trip is an opportunity to discover something new. Whether
              travelling alone, with family, friends or colleagues, we aim to
              make getting there easier.
            </p>

            <Link href="/services" className="destination-main-btn">
              Discover Our Services <span>→</span>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="destinations-cta">
          <div>
            <span>YOUR NEXT ADVENTURE AWAITS</span>

            <h2>Ready to Explore?</h2>

            <p>
              Choose your destination and let TESAZMARE Logistics be part of
              your next journey.
            </p>
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
