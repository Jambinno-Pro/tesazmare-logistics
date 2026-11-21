import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, MapPin, Users } from "lucide-react";

import Navbar from "@/components/home/Navbar/Navbar";
import Footer from "@/components/home/Footer/Footer";

import "./ServiceDetail.css";

const services = {
  "shuttle-services": {
    title: "Shuttle Services",
    subtitle: "Comfortable and convenient shuttle transportation",
    image: "/images/services/shuttle.jpg",
    description:
      "Travel with convenience through our shuttle transportation services. Whether you need transportation for an individual journey or a group, we aim to make every trip comfortable and straightforward.",
    features: [
      "Convenient passenger transportation",
      "Individual and group travel arrangements",
      "Flexible journey planning",
      "Comfortable travel experience",
    ],
    highlights: [
      {
        icon: Users,
        title: "Group Travel",
        text: "Transport for individuals and groups.",
      },
      {
        icon: MapPin,
        title: "Convenient Routes",
        text: "Travel arrangements suited to your journey.",
      },
      {
        icon: Clock,
        title: "Flexible Scheduling",
        text: "Arrange transport around your plans.",
      },
    ],
  },

  "airport-transfers": {
    title: "Airport Transfers",
    subtitle: "Convenient transportation to and from the airport",
    image: "/images/services/airport-transfer.jpg",
    description:
      "Make your airport journey easier with convenient transfers to and from the airport. Whether travelling for business or leisure, arrange transportation to suit your travel plans.",
    features: [
      "Airport pick-ups and drop-offs",
      "Individual and group transfers",
      "Pre-arranged transportation",
      "Convenient travel arrangements",
    ],
    highlights: [
      {
        icon: MapPin,
        title: "Airport Pick-ups",
        text: "Arrange transport from the airport.",
      },
      {
        icon: Clock,
        title: "Planned Transfers",
        text: "Coordinate your journey in advance.",
      },
      {
        icon: Users,
        title: "Group Transfers",
        text: "Travel together with your group.",
      },
    ],
  },

  "private-transfers": {
    title: "Private Transfers",
    subtitle: "Personalised transportation for your journey",
    image: "/images/services/private-transfer.jpg",
    description:
      "Enjoy a more personalised travel arrangement with private transportation. Ideal for individuals, families and travellers who prefer transport arranged around their specific journey.",
    features: [
      "Private transportation arrangements",
      "Individual and family travel",
      "Personalised journey planning",
      "Flexible pick-up arrangements",
    ],
    highlights: [
      {
        icon: Users,
        title: "Personal Travel",
        text: "Transport arranged for your needs.",
      },
      {
        icon: MapPin,
        title: "Your Destination",
        text: "Plan transportation to your destination.",
      },
      {
        icon: Clock,
        title: "Flexible Planning",
        text: "Arrange a suitable travel time.",
      },
    ],
  },

  "group-transportation": {
    title: "Group Transportation",
    subtitle: "Bringing people together through convenient transport",
    image: "/images/services/group-transport.jpg",
    description:
      "Organising transportation for a group? We provide group transportation arrangements for social trips, organised outings, business activities and other group journeys.",
    features: [
      "Group travel arrangements",
      "Transport for organised outings",
      "Business and social transportation",
      "Journey planning for groups",
    ],
    highlights: [
      {
        icon: Users,
        title: "Group Bookings",
        text: "Coordinate transport for your group.",
      },
      {
        icon: MapPin,
        title: "Multiple Destinations",
        text: "Discuss your preferred journey.",
      },
      {
        icon: Clock,
        title: "Planned Journeys",
        text: "Arrange transportation ahead of time.",
      },
    ],
  },

  "game-drive-transfers": {
    title: "Game Drive Transfers",
    subtitle: "Convenient transport for your wildlife experiences",
    image: "/images/services/game-drive.jpg",
    description:
      "Arrange transportation for your wildlife and game drive experiences. We help make getting to your planned destination a convenient part of your trip.",
    features: [
      "Transportation to game drive destinations",
      "Private and group arrangements",
      "Tour and excursion transfers",
      "Pre-arranged travel planning",
    ],
    highlights: [
      {
        icon: MapPin,
        title: "Destination Transfers",
        text: "Arrange transport to your destination.",
      },
      {
        icon: Users,
        title: "Group Travel",
        text: "Coordinate transport for your group.",
      },
      {
        icon: Clock,
        title: "Planned Excursions",
        text: "Organise your transfer in advance.",
      },
    ],
  },

  "events-transfers": {
    title: "Events Transfers",
    subtitle: "Transportation for occasions and special events",
    image: "/images/services/events-transfer.jpg",
    description:
      "Make transportation part of a well-organised event. Arrange transfers for weddings, celebrations, conferences, functions and other special occasions.",
    features: [
      "Wedding transportation arrangements",
      "Corporate event transfers",
      "Private functions and celebrations",
      "Group transportation planning",
    ],
    highlights: [
      {
        icon: Users,
        title: "Guest Transport",
        text: "Arrange transportation for event guests.",
      },
      {
        icon: MapPin,
        title: "Event Locations",
        text: "Plan transfers to and from venues.",
      },
      {
        icon: Clock,
        title: "Event Scheduling",
        text: "Coordinate journeys around your event.",
      },
    ],
  },

  "corporate-transport": {
    title: "Corporate Transport",
    subtitle: "Transportation solutions for business needs",
    image: "/images/services/corporate-transport.png",
    description:
      "Arrange transportation for your business, employees, clients and corporate activities. Discuss a transport arrangement that suits your organisation's requirements.",
    features: [
      "Employee transportation arrangements",
      "Business meeting transfers",
      "Corporate event transportation",
      "Custom transport arrangements",
    ],
    highlights: [
      {
        icon: Users,
        title: "Employee Travel",
        text: "Arrange transport for your workforce.",
      },
      {
        icon: MapPin,
        title: "Business Transfers",
        text: "Coordinate transport for business journeys.",
      },
      {
        icon: Clock,
        title: "Scheduled Transport",
        text: "Discuss recurring transport requirements.",
      },
    ],
  },

  "truck-hire": {
    title: "Truck Hire",
    subtitle: "Transport and truck hire for your logistics needs",
    image: "/images/services/truck-hire.png",
    description:
      "Arrange truck hire for your transportation and logistics requirements. Contact our team with your load details, collection point and destination so we can discuss a suitable arrangement.",
    features: [
      "Truck hire enquiries",
      "Goods transportation arrangements",
      "Business logistics support",
      "Load and destination planning",
    ],
    highlights: [
      {
        icon: Users,
        title: "Business Support",
        text: "Discuss your logistics requirements.",
      },
      {
        icon: MapPin,
        title: "Transport Planning",
        text: "Provide your collection and delivery locations.",
      },
      {
        icon: Clock,
        title: "Hire Arrangements",
        text: "Discuss your preferred hire period.",
      },
    ],
  },
};

type ServiceSlug = keyof typeof services;

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services[slug as ServiceSlug];

  return {
    title: service
      ? `${service.title} | TESAZMARE Logistics`
      : "Service | TESAZMARE Logistics",
    description: service?.subtitle ?? "Explore TESAZMARE Logistics services.",
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services[slug as ServiceSlug];

  if (!service) notFound();

  return (
    <>
      <Navbar />

      <main className="service-detail-page">
        <section className="service-detail-hero">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="service-detail-hero-image"
          />

          <div className="service-detail-overlay" />

          <div className="service-detail-hero-content">
            <span>TESAZMARE LOGISTICS</span>
            <h1>{service.title}</h1>
            <p>{service.subtitle}</p>

            <div className="service-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/services">Services</Link>
              <span>/</span>
              <span>{service.title}</span>
            </div>
          </div>
        </section>

        <section className="service-detail-intro">
          <div className="service-detail-intro-content">
            <span className="service-eyebrow">OUR SERVICES</span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>

            <Link href="/booking" className="service-detail-button">
              Enquire About This Service
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="service-detail-feature-image">
            <Image
              src={service.image}
              alt={`${service.title} transportation`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="service-highlights">
          <div className="service-section-heading">
            <span className="service-eyebrow">WHAT WE OFFER</span>
            <h2>Making Your Journey Easier</h2>
            <p>
              Explore the arrangements available with our{" "}
              {service.title.toLowerCase()} service.
            </p>
          </div>

          <div className="service-highlights-grid">
            {service.highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article className="service-highlight-card" key={item.title}>
                  <div className="service-highlight-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="service-features">
          <div>
            <span className="service-eyebrow">SERVICE FEATURES</span>
            <h2>Designed Around Your Transportation Needs</h2>
            <p>
              Get in touch with our team to discuss your journey and the
              arrangements you require.
            </p>
          </div>

          <ul>
            {service.features.map((feature) => (
              <li key={feature}>
                <CheckCircle2 size={20} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="service-detail-cta">
          <div>
            <span>LET'S PLAN YOUR JOURNEY</span>
            <h2>Need {service.title}?</h2>
            <p>
              Contact TESAZMARE Logistics to discuss your requirements and
              arrange your transportation.
            </p>
          </div>

          <div className="service-detail-cta-actions">
            <Link
              href={`/booking?service=${slug}`}
              className="service-detail-button"
            >
              Enquire About This Service
              <ArrowRight size={18} />
            </Link>
            <Link
              href={`/booking?service=${slug}`}
              className="service-detail-button"
            >
              Book / Enquire
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
