import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Armchair,
  Clock3,
  Users,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import "./WhyChooseUs.css";

const benefits = [
  {
    number: "01",
    title: "Reliable Transportation",
    description:
      "Dependable shuttle services designed to get you to your destination with confidence and peace of mind.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Comfortable Journeys",
    description:
      "Enjoy convenient and comfortable transportation, whether travelling individually or as part of a group.",
    icon: Armchair,
  },
  {
    number: "03",
    title: "Convenient Travel",
    description:
      "Travel arrangements designed around your schedule, destination and transportation requirements.",
    icon: Clock3,
  },
  {
    number: "04",
    title: "Customer-Focused Service",
    description:
      "We put your travel experience first, providing friendly assistance from booking to your destination.",
    icon: Users,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-choose-section" id="why-choose-us">
      <div className="why-choose-container">
        {/* IMAGE SIDE */}
        <div className="why-choose-image-wrapper">
          <div className="why-choose-image">
            <Image
              src="/images/choose.png"
              alt="TESAZMARE shuttle transportation"
              fill
              priority={false}
              sizes="(max-width: 900px) 100vw, 50vw"
            />

            <div className="why-choose-image-overlay" />
          </div>

          {/* IMAGE LABEL */}
          <div className="why-image-label">
            <span className="why-image-label-icon">
              <ShieldCheck size={22} />
            </span>

            <div>
              <strong>Travel With Confidence</strong>
              <span>Comfortable journeys, dependable service.</span>
            </div>
          </div>

          {/* DECORATIVE ELEMENT */}
          <div className="why-image-decoration" />
        </div>

        {/* CONTENT SIDE */}
        <div className="why-choose-content">
          {/* SECTION HEADING */}
          <div className="why-choose-heading">
            <span className="why-choose-eyebrow">
              <span className="why-choose-eyebrow-line" />
              WHY TRAVEL WITH US
            </span>

            <h2>
              Why Choose
              <br />
              <span>TESAZMARE?</span>
            </h2>

            <p>
              We are committed to making every journey comfortable, convenient
              and reliable. Whether travelling alone or in a group, we make
              getting to your destination easier.
            </p>
          </div>

          {/* BENEFITS */}
          <div className="why-benefits-grid">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article className="why-benefit" key={benefit.number}>
                  <div className="why-benefit-icon">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <div className="why-benefit-content">
                    <span className="why-benefit-number">{benefit.number}</span>

                    <h3>{benefit.title}</h3>

                    <p>{benefit.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CALL TO ACTION */}
          <div className="why-choose-cta">
            <Link href="/contact" className="why-choose-button">
              Book Your Journey
              <ArrowUpRight size={18} />
            </Link>

            <div className="why-choose-assurance">
              <CheckCircle2 size={17} />
              <span>Your journey starts with us.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
