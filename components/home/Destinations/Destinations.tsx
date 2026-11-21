import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, MapPin } from "lucide-react";
import "./Destinations.css";

const destinations = [
  {
    number: "01",
    name: "Cape Town",
    location: "Western Cape",
    slug: "cape-town",
    image: "/images/destinations/cape-town.png",
    description:
      "Discover beautiful coastlines, iconic landmarks and unforgettable experiences in the Mother City.",
  },
  {
    number: "02",
    name: "Stellenbosch",
    location: "Western Cape",
    slug: "stellenbosch",
    image: "/images/destinations/stellenbosch.png",
    description:
      "Explore scenic vineyards, historic architecture and the beauty of the Cape Winelands.",
  },
  {
    number: "03",
    name: "Franschhoek",
    location: "Western Cape",
    slug: "franschhoek",
    image: "/images/destinations/franschhoek.png",
    description:
      "Experience breathtaking mountain scenery, charming streets and beautiful wine estates.",
  },
  {
    number: "04",
    name: "Hermanus",
    location: "Western Cape",
    slug: "hermanus",
    image: "/images/destinations/hermanus.png",
    description:
      "Enjoy spectacular ocean views, coastal attractions and the charm of this seaside destination.",
  },
  {
    number: "05",
    name: "Paarl",
    location: "Western Cape",
    slug: "paarl",
    image: "/images/destinations/paarl.png",
    description:
      "Discover picturesque landscapes, wine farms and the natural beauty of the Cape Winelands.",
  },
  {
    number: "06",
    name: "Garden Route",
    location: "Western Cape",
    slug: "garden-route",
    image: "/images/destinations/garden-route.png",
    description:
      "Explore beautiful coastal towns, forests and some of South Africa's most scenic landscapes.",
  },
];

export default function Destinations() {
  return (
    <section className="destinations-section" id="destinations">
      <div className="destinations-container">
        {/* SECTION HEADING */}
        <div className="destinations-heading">
          <div className="destinations-heading-content">
            <span className="destinations-eyebrow">
              <span className="destinations-eyebrow-line" />
              EXPLORE SOUTH AFRICA
            </span>

            <h2>
              Discover Your Next
              <br />
              <span>Destination.</span>
            </h2>

            <p>
              From vibrant cities to breathtaking coastlines, explore beautiful
              destinations with comfortable and reliable transportation from
              TESAZMARE Logistics.
            </p>
          </div>

          <Link href="/destinations" className="destinations-view-all">
            Explore All Destinations
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* DESTINATIONS GRID */}
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <article className="destination-card" key={destination.number}>
              <div className="destination-image">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                />

                <div className="destination-overlay" />

                <span className="destination-number">{destination.number}</span>

                <div className="destination-location">
                  <MapPin size={14} />
                  {destination.location}
                </div>

                <div className="destination-image-content">
                  <h3>{destination.name}</h3>

                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="destination-explore"
                  >
                    Explore Destination
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>

              <div className="destination-card-content">
                <p>{destination.description}</p>

                <Link
                  href={`/destinations/${destination.slug}`}
                  className="destination-card-link"
                >
                  Discover More
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
