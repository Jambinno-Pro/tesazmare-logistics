import Image from "next/image";
import Link from "next/link";
import {
  BusFront,
  Plane,
  CarFront,
  Users,
  Compass,
  CalendarDays,
  Building2,
  Truck,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import "./Services.css";

const mainServices = [
  {
    number: "01",
    title: "Shuttle Services",
    slug: "shuttle-services",
    image: "/images/services/shuttle-services.png",
    description:
      "Convenient and comfortable shuttle transportation for individuals and groups travelling to different destinations.",
    icon: BusFront,
  },
  {
    number: "02",
    title: "Airport Transfers",
    slug: "airport-transfers",
    image: "/images/services/airport-transfers.png",
    description:
      "Reliable transportation to and from airports, making your arrivals and departures easier and stress-free.",
    icon: Plane,
  },
  {
    number: "03",
    title: "Private Transfers",
    slug: "private-transfers",
    image: "/images/services/private-transfers.png",
    description:
      "Personalised transport for individuals, families and small groups who prefer a dedicated travel experience.",
    icon: CarFront,
  },
  {
    number: "04",
    title: "Group Transportation",
    slug: "group-transportation",
    image: "/images/services/group.png",
    description:
      "Convenient travel arrangements for friends, families, colleagues and groups heading to the same destination.",
    icon: Users,
  },
  {
    number: "05",
    title: "Game Drive Transfers",
    slug: "game-drive-transfers",
    image: "/images/services/game-drive-transfers.png",
    description:
      "Comfortable transport to game reserves, wildlife parks and safari destinations for your next adventure.",
    icon: Compass,
  },
  {
    number: "06",
    title: "Events Transfers",
    slug: "events-transfers",
    image: "/images/services/events.png",
    description:
      "Organised transportation for weddings, concerts, conferences, functions and other special occasions.",
    icon: CalendarDays,
  },
];

const additionalServices = [
  {
    title: "Corporate Transport",
    slug: "corporate-transport",
    image: "/images/services/corporate-transport.png",
    description:
      "Transport solutions for businesses, employees, meetings and corporate events.",
    icon: Building2,
  },
  {
    title: "Truck Hire",
    slug: "truck-hire",
    image: "/images/services/truck-hire.png",
    description:
      "Additional logistics support for moving goods, equipment and cargo.",
    icon: Truck,
  },
];

export default function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        {/* SECTION HEADING */}
        <div className="services-heading">
          <div className="services-heading-content">
            <span className="services-eyebrow">
              <span className="services-eyebrow-line" />
              WHAT WE OFFER
            </span>

            <h2>
              Transportation Solutions
              <br />
              <span>For Every Journey.</span>
            </h2>

            <p>
              From everyday shuttle transportation to special travel
              arrangements, TESAZMARE Logistics offers convenient transportation
              solutions designed around your journey.
            </p>
          </div>

          <Link href="/services" className="services-view-all">
            Explore All Services
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* MAIN SERVICES */}
        <div className="services-grid">
          {mainServices.map((service) => {
            const Icon = service.icon;

            return (
              <article className="service-card" key={service.number}>
                {/* SERVICE IMAGE */}
                <div className="service-image">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                  />

                  <div className="service-image-overlay" />

                  <span className="service-number">{service.number}</span>

                  <div className="service-icon">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>
                </div>

                {/* SERVICE DETAILS */}
                <div className="service-card-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <Link
                    href={`/services/${service.slug}`}
                    className="service-card-link"
                  >
                    View More
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* ADDITIONAL SERVICES */}
        <div className="additional-services">
          <div className="additional-services-heading">
            <div>
              <span className="additional-eyebrow">MORE FROM TESAZMARE</span>
              <h3>Additional Logistics Services</h3>
            </div>

            <p>
              Beyond passenger transportation, we also provide additional
              solutions to support your business and logistics needs.
            </p>
          </div>

          <div className="additional-services-grid">
            {additionalServices.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  className="additional-service-card"
                  key={service.title}
                >
                  {/* ADDITIONAL SERVICE IMAGE */}
                  <div className="additional-service-image">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="120px"
                    />
                  </div>

                  <div className="additional-service-content">
                    <div className="additional-service-title">
                      <Icon size={17} />
                      <h4>{service.title}</h4>
                    </div>

                    <p>{service.description}</p>

                    <Link
                      href={`/services/${service.slug}`}
                      className="additional-service-link"
                    >
                      View More
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <ArrowUpRight
                    className="additional-service-arrow"
                    size={19}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
