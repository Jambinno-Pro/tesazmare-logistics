import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Compass,
  CarFront,
  Phone,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/home/Navbar/Navbar";
import Footer from "@/components/home/Footer/Footer";
import "./DestinationDetails.css";

export const instant = false;

interface Destination {
  name: string;
  slug: string;
  location: string;
  image: string;
  tagline: string;
  description: string;
  overview: string;
  tag: string;
  highlights: {
    name: string;
    description: string;
  }[];
  experiences: string[];
  travelDescription: string;
}

const destinations: Destination[] = [
  {
    name: "Cape Town",
    slug: "cape-town",
    location: "Western Cape, South Africa",
    image: "/images/destinations/cape-town.png",
    tagline: "Where Natural Beauty Meets Unforgettable Experiences",
    tag: "City Experiences",
    description:
      "Discover the beauty of Cape Town, a destination where dramatic mountain landscapes meet beautiful beaches, vibrant city life and unforgettable coastal experiences.",
    overview:
      "From the iconic Table Mountain to the picturesque Atlantic coastline, Cape Town offers an incredible variety of experiences. Explore its historic attractions, enjoy its beautiful beaches, discover local culture and experience the energy of one of South Africa's most celebrated cities.",
    highlights: [
      {
        name: "Table Mountain",
        description:
          "Take in breathtaking panoramic views of Cape Town, the surrounding mountains and the Atlantic Ocean.",
      },
      {
        name: "V&A Waterfront",
        description:
          "Discover a lively waterfront destination filled with restaurants, shopping, entertainment and harbour views.",
      },
      {
        name: "Camps Bay",
        description:
          "Enjoy beautiful beaches, ocean views and a vibrant beachfront atmosphere beneath the Twelve Apostles.",
      },
      {
        name: "Cape Point",
        description:
          "Explore dramatic coastal landscapes, scenic viewpoints and the remarkable natural beauty of the Cape Peninsula.",
      },
    ],
    experiences: [
      "City sightseeing and guided tours",
      "Beach visits and coastal exploration",
      "Shopping and dining experiences",
      "Scenic drives and photography stops",
      "Cultural and historical attractions",
    ],
    travelDescription:
      "Whether you are visiting for leisure, business or a special occasion, TESAZMARE Logistics can help make your journey to Cape Town comfortable and convenient.",
  },
  {
    name: "Stellenbosch",
    slug: "stellenbosch",
    location: "Western Cape, South Africa",
    image: "/images/destinations/stellenbosch.png",
    tagline: "Discover the Beauty of the Cape Winelands",
    tag: "Wine & Nature",
    description:
      "Explore picturesque vineyards, historic architecture and the scenic beauty of the Stellenbosch Winelands.",
    overview:
      "Stellenbosch is a charming destination surrounded by beautiful vineyards and mountain landscapes. Known for its historic Cape Dutch architecture, oak-lined streets and celebrated wine estates, it offers a wonderful combination of culture, relaxation and countryside experiences.",
    highlights: [
      {
        name: "Stellenbosch Wine Estates",
        description:
          "Explore beautiful wine estates, vineyards and tasting experiences throughout the region.",
      },
      {
        name: "Historic Town Centre",
        description:
          "Discover charming streets, historic architecture, art galleries and welcoming cafés.",
      },
      {
        name: "Jonkershoek Nature Reserve",
        description:
          "Experience spectacular mountain scenery, indigenous vegetation and beautiful outdoor trails.",
      },
      {
        name: "Dorp Street",
        description:
          "Take a stroll along one of Stellenbosch's most historic streets, surrounded by beautiful heritage buildings.",
      },
    ],
    experiences: [
      "Wine estate visits and tastings",
      "Winelands sightseeing",
      "Restaurant and dining experiences",
      "Nature walks and scenic drives",
      "Historic town exploration",
    ],
    travelDescription:
      "Let TESAZMARE Logistics take care of your transportation while you enjoy the beauty and experiences of the Stellenbosch Winelands.",
  },
  {
    name: "Franschhoek",
    slug: "franschhoek",
    location: "Western Cape, South Africa",
    image: "/images/destinations/franschhoek.png",
    tagline: "A Beautiful Escape into the Winelands",
    tag: "Winelands Escape",
    description:
      "Experience the charm of Franschhoek, surrounded by beautiful mountain scenery, vineyards and countryside.",
    overview:
      "Franschhoek is one of the Cape's most picturesque destinations. Surrounded by dramatic mountain ranges and beautiful vineyards, this charming valley is celebrated for its culinary heritage, wine estates, boutique experiences and peaceful countryside atmosphere.",
    highlights: [
      {
        name: "Franschhoek Wine Valley",
        description:
          "Discover beautiful vineyards, celebrated wine estates and spectacular mountain surroundings.",
      },
      {
        name: "Franschhoek Village",
        description:
          "Explore boutique shops, art galleries, cafés and the charming atmosphere of the village.",
      },
      {
        name: "Franschhoek Pass",
        description:
          "Enjoy breathtaking mountain scenery and panoramic countryside views along this scenic route.",
      },
      {
        name: "Huguenot Memorial",
        description:
          "Discover an important historical landmark celebrating the French Huguenot heritage of the region.",
      },
    ],
    experiences: [
      "Wine tasting experiences",
      "Fine dining and culinary experiences",
      "Scenic mountain drives",
      "Village exploration and shopping",
      "Relaxing countryside getaways",
    ],
    travelDescription:
      "Enjoy a relaxed journey to Franschhoek with convenient transportation from TESAZMARE Logistics. Spend more time enjoying your destination and less time worrying about getting there.",
  },
  {
    name: "Hermanus",
    slug: "hermanus",
    location: "Western Cape, South Africa",
    image: "/images/destinations/hermanus.png",
    tagline: "Experience the Magic of the Ocean",
    tag: "Coastal Getaway",
    description:
      "Enjoy the coastal beauty of Hermanus, known for its ocean views, scenic coastline and relaxed atmosphere.",
    overview:
      "Hermanus is a beautiful coastal destination offering spectacular ocean views, pristine beaches and memorable nature experiences. Famous for seasonal whale watching, this seaside town is an ideal escape for travellers who appreciate coastal scenery and outdoor exploration.",
    highlights: [
      {
        name: "Hermanus Cliff Path",
        description:
          "Take in breathtaking ocean views along the famous coastal walking route.",
      },
      {
        name: "Grotto Beach",
        description:
          "Relax on a beautiful stretch of coastline surrounded by impressive mountain and ocean views.",
      },
      {
        name: "Whale Watching",
        description:
          "Experience seasonal southern right whale sightings from the coastline or permitted boat excursions.",
      },
      {
        name: "Fernkloof Nature Reserve",
        description:
          "Explore beautiful mountain scenery, indigenous fynbos and outdoor walking trails.",
      },
    ],
    experiences: [
      "Seasonal whale watching",
      "Coastal sightseeing",
      "Beach outings and relaxation",
      "Nature walks and outdoor activities",
      "Oceanfront dining experiences",
    ],
    travelDescription:
      "Make your coastal getaway easier with comfortable shuttle transportation to Hermanus. Travel with TESAZMARE Logistics and enjoy the journey along the way.",
  },
  {
    name: "Paarl",
    slug: "paarl",
    location: "Western Cape, South Africa",
    image: "/images/destinations/paarl.png",
    tagline: "Explore the Heart of the Cape Winelands",
    tag: "Winelands",
    description:
      "Discover Paarl's beautiful landscapes, historic surroundings and welcoming Winelands experiences.",
    overview:
      "Paarl is a scenic Winelands destination surrounded by impressive mountain formations, beautiful vineyards and picturesque countryside. Its rich heritage, wine estates and outdoor attractions make it a wonderful place to explore and enjoy the quieter side of the Cape.",
    highlights: [
      {
        name: "Paarl Rock",
        description:
          "Discover the impressive granite formations and spectacular views surrounding Paarl Mountain.",
      },
      {
        name: "Paarl Wine Estates",
        description:
          "Explore beautiful vineyards and wine estates set against magnificent mountain scenery.",
      },
      {
        name: "Afrikaans Language Monument",
        description:
          "Visit a distinctive architectural landmark celebrating the Afrikaans language and its heritage.",
      },
      {
        name: "Paarl Mountain Nature Reserve",
        description:
          "Experience natural landscapes, scenic viewpoints and opportunities for outdoor exploration.",
      },
    ],
    experiences: [
      "Wine estate visits",
      "Mountain sightseeing",
      "Heritage experiences",
      "Outdoor activities",
      "Scenic countryside drives",
    ],
    travelDescription:
      "Travel to Paarl with TESAZMARE Logistics and enjoy a convenient journey through the beautiful Cape Winelands.",
  },
  {
    name: "Garden Route",
    slug: "garden-route",
    location: "Western and Eastern Cape, South Africa",
    image: "/images/destinations/garden-route.png",
    tagline: "A Journey Through South Africa's Natural Beauty",
    tag: "Scenic Adventures",
    description:
      "Explore one of South Africa's beautiful travel regions, with coastal scenery, forests and charming towns.",
    overview:
      "The Garden Route is one of South Africa's most remarkable travel regions, stretching along a spectacular coastline with beautiful beaches, indigenous forests, lagoons and charming coastal towns. It is a wonderful destination for travellers looking for adventure, relaxation and natural beauty.",
    highlights: [
      {
        name: "Knysna",
        description:
          "Explore the famous lagoon, Knysna Heads, waterfront and beautiful coastal surroundings.",
      },
      {
        name: "Plettenberg Bay",
        description:
          "Enjoy beautiful beaches, ocean activities and scenic coastal views.",
      },
      {
        name: "Wilderness",
        description:
          "Discover peaceful beaches, forests, lakes and beautiful natural surroundings.",
      },
      {
        name: "Tsitsikamma",
        description:
          "Experience indigenous forests, dramatic coastlines and outdoor adventure opportunities.",
      },
    ],
    experiences: [
      "Coastal sightseeing and scenic drives",
      "Nature and forest exploration",
      "Beach holidays and ocean experiences",
      "Adventure and outdoor activities",
      "Exploring charming coastal towns",
    ],
    travelDescription:
      "Explore the Garden Route with TESAZMARE Logistics. Whether you are planning a getaway or a group journey, we can help make your transportation more convenient.",
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return destinations.map((destination) => ({
    slug: destination.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    return {
      title: "Destination Not Found | TESAZMARE Logistics",
    };
  }

  return {
    title: `${destination.name} | TESAZMARE Logistics`,
    description: destination.description,
    openGraph: {
      title: `${destination.name} | TESAZMARE Logistics`,
      description: destination.description,
      images: [destination.image],
    },
  };
}

export default async function DestinationDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    notFound();
  }

  const otherDestinations = destinations.filter(
    (item) => item.slug !== destination.slug,
  );

  return (
    <>
      <Navbar />

      <main className="destination-details-page">
        {/* HERO */}
        <section className="destination-detail-hero">
          <Image
            src={destination.image}
            alt={`${destination.name}, South Africa`}
            fill
            priority
            sizes="100vw"
            className="destination-detail-hero-image"
          />

          <div className="destination-detail-hero-overlay" />

          <div className="destination-detail-hero-content">
            <Link href="/destinations" className="destination-back-link">
              <ArrowLeft size={17} />
              All Destinations
            </Link>

            <div className="destination-detail-location">
              <MapPin size={17} />
              {destination.location}
            </div>

            <span className="destination-detail-tag">{destination.tag}</span>

            <h1>{destination.name}</h1>

            <div className="destination-detail-divider" />

            <h2>{destination.tagline}</h2>

            <p>{destination.description}</p>

            <div className="destination-detail-hero-actions">
              <Link href="/booking" className="destination-gold-btn">
                Book Your Shuttle
                <ArrowRight size={18} />
              </Link>

              <a href="tel:+27846411910" className="destination-outline-btn">
                <Phone size={17} />
                Call Us
              </a>
            </div>
          </div>

          <div className="destination-hero-bottom-line" />
        </section>

        {/* INTRODUCTION */}
        <section className="destination-detail-intro">
          <div className="destination-intro-content">
            <span className="destination-section-label">
              DISCOVER {destination.name.toUpperCase()}
            </span>

            <h2>
              A Destination
              <span> Worth Discovering.</span>
            </h2>

            <p>{destination.overview}</p>

            <div className="destination-intro-features">
              <div>
                <Sparkles size={21} />
                <span>Memorable Experiences</span>
              </div>

              <div>
                <Compass size={21} />
                <span>Beautiful Places</span>
              </div>

              <div>
                <CarFront size={21} />
                <span>Convenient Travel</span>
              </div>
            </div>
          </div>

          <div className="destination-intro-image">
            <Image
              src={destination.image}
              alt={`Discover ${destination.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="destination-intro-image-caption">
              <span>EXPLORE SOUTH AFRICA</span>
              <h3>{destination.name}</h3>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="destination-highlights">
          <div className="destination-section-heading">
            <div>
              <span className="destination-section-label">
                PLACES TO EXPLORE
              </span>

              <h2>Discover the Highlights</h2>
            </div>

            <p>
              Explore some of the attractions and experiences that make
              {` ${destination.name}`} a special destination.
            </p>
          </div>

          <div className="destination-highlights-grid">
            {destination.highlights.map((highlight, index) => (
              <article
                className="destination-highlight-card"
                key={highlight.name}
              >
                <span className="destination-highlight-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="destination-highlight-icon">
                  <MapPin size={21} />
                </div>

                <h3>{highlight.name}</h3>

                <p>{highlight.description}</p>

                <div className="destination-highlight-line" />
              </article>
            ))}
          </div>
        </section>

        {/* EXPERIENCES */}
        <section className="destination-experiences">
          <div className="destination-experiences-content">
            <span className="destination-section-label">
              MAKE THE MOST OF YOUR VISIT
            </span>

            <h2>
              Experiences Worth
              <span> Remembering.</span>
            </h2>

            <p>
              Every journey brings an opportunity to discover something new.
              Here are some experiences you can enjoy when visiting
              {` ${destination.name}`}.
            </p>

            <div className="destination-experience-list">
              {destination.experiences.map((experience) => (
                <div key={experience}>
                  <CheckCircle2 size={20} />
                  <span>{experience}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="destination-experiences-image">
            <Image
              src={destination.image}
              alt={`${destination.name} travel experiences`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="destination-experiences-image-overlay">
              <span>YOUR NEXT ADVENTURE</span>
              <h3>Discover More. Experience More.</h3>
            </div>
          </div>
        </section>

        {/* TRAVEL WITH TESAZMARE */}
        <section className="destination-travel">
          <div className="destination-travel-inner">
            <div className="destination-travel-icon">
              <CarFront size={31} />
            </div>

            <span className="destination-section-label">
              TRAVEL WITH TESAZMARE
            </span>

            <h2>
              Enjoy the Journey,
              <span> Not Just the Destination.</span>
            </h2>

            <p>{destination.travelDescription}</p>

            <div className="destination-travel-benefits">
              <div>
                <CheckCircle2 size={19} />
                Comfortable Transportation
              </div>

              <div>
                <CheckCircle2 size={19} />
                Group Travel Options
              </div>

              <div>
                <CheckCircle2 size={19} />
                Convenient Travel Arrangements
              </div>
            </div>

            <Link href="/booking" className="destination-gold-btn">
              Plan Your Journey
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* BOOKING CTA */}
        <section className="destination-detail-cta">
          <div className="destination-cta-content">
            <span>YOUR NEXT ADVENTURE AWAITS</span>

            <h2>Ready to Explore {destination.name}?</h2>

            <p>
              Choose your destination and let TESAZMARE Logistics be part of
              your next journey. Get in touch with our team to plan your
              transportation.
            </p>

            <Link href="/booking" className="destination-cta-button">
              Book Your Shuttle
              <ArrowRight size={19} />
            </Link>
          </div>
        </section>

        {/* OTHER DESTINATIONS */}
        <section className="destination-other">
          <div className="destination-section-heading">
            <div>
              <span className="destination-section-label">KEEP EXPLORING</span>

              <h2>Other Destinations</h2>
            </div>

            <Link href="/destinations" className="destination-view-all">
              View All Destinations
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="destination-other-grid">
            {otherDestinations.slice(0, 3).map((item) => (
              <Link
                href={`/destinations/${item.slug}`}
                className="destination-other-card"
                key={item.slug}
              >
                <div className="destination-other-image">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div />
                </div>

                <div className="destination-other-content">
                  <span>{item.location}</span>

                  <h3>{item.name}</h3>

                  <div>
                    Explore Destination
                    <ArrowRight size={17} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
