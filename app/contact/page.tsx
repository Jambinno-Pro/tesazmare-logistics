import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, Clock } from "lucide-react";

import Navbar from "@/components/home/Navbar/Navbar";
import Footer from "@/components/home/Footer/Footer";
import ContactForm from "@/components/home/Contact/ContactForm";

import "./Contact.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Tesazmare Logistics and Tours",

  description:
    "Contact Tesazmare Logistics and Tours for shuttle services, airport transfers, private transportation, group travel and tours in Cape Town and across the Western Cape. Call or email our team for enquiries and bookings.",

  keywords: [
    "Tesazmare Logistics and Tours",
    "contact Tesazmare",
    "shuttle services Cape Town",
    "airport transfers Cape Town",
    "private transportation Cape Town",
    "group transport Western Cape",
    "Cape Town shuttle bookings",
    "transportation enquiries South Africa",
    "Cape Town tours and transfers",
  ],

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://tesazmarelogistics.co.za/contact",
    siteName: "Tesazmare Logistics and Tours",
    title: "Contact Tesazmare Logistics and Tours",
    description:
      "Get in touch with Tesazmare Logistics and Tours for shuttle bookings, airport transfers, private transport and travel enquiries in Cape Town and the Western Cape.",
  },

  twitter: {
    card: "summary",
    title: "Contact Us | Tesazmare Logistics and Tours",
    description:
      "Contact our team for shuttle services, airport transfers, private transport and tour enquiries in Cape Town and the Western Cape.",
  },
};
export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="contact-page">
        {/* HERO */}
        <section className="contact-hero">
          <div className="contact-hero-overlay" />

          <div className="contact-hero-content">
            <span>WE'RE HERE TO HELP</span>
            <h1>Get In Touch With Us</h1>
            <p>
              Have a question or need transportation? Our team is ready to
              assist you with your travel and logistics enquiries.
            </p>

            <div className="contact-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Contact Us</span>
            </div>
          </div>
        </section>

        {/* CONTACT INTRO */}
        <section className="contact-intro">
          <span className="contact-eyebrow">CONTACT TESAZMARE</span>
          <h2>Let's Talk About Your Journey</h2>
          <p>
            Whether you need a shuttle, airport transfer, private transportation
            or logistics support, get in touch with us. Share your requirements
            and we'll assist with your enquiry.
          </p>
        </section>

        {/* CONTACT CONTENT */}
        <section className="contact-main">
          <div className="contact-information">
            <div className="contact-info-heading">
              <span>CONTACT INFORMATION</span>
              <h2>We'd Love To Hear From You</h2>
              <p>
                Reach out to us using the contact details below or send us a
                message through the enquiry form.
              </p>
            </div>

            <a href="tel:+27846411910" className="contact-info-card">
              <div className="contact-info-icon">
                <Phone size={22} />
              </div>
              <div>
                <span>CALL US</span>
                <h3>+27 84 641 1910</h3>
                <p>Speak to our team about your requirements.</p>
              </div>
            </a>

            <a
              href="mailto:info@tesazmarelogistics.co.za"
              className="contact-info-card"
            >
              <div className="contact-info-icon">
                <Mail size={22} />
              </div>
              <div>
                <span>EMAIL US</span>
                <h3>info@tesazmarelogistics.co.za</h3>
                <p>Send us your questions and enquiries.</p>
              </div>
            </a>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Clock size={22} />
              </div>
              <div>
                <span>BUSINESS HOURS</span>
                <h3>Contact Our Team</h3>
                <p>
                  Get in touch to confirm our availability and operating hours.
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <MapPin size={22} />
              </div>
              <div>
                <span>OUR LOCATION</span>
                <h3>South Africa</h3>
                <p>
                  Contact us for transportation and service availability in your
                  area.
                </p>
              </div>
            </div>

            <div className="contact-info-cta">
              <h3>Need Transportation?</h3>
              <p>
                Tell us where you're going and let us help you plan your
                journey.
              </p>
              <Link href="/booking">
                Book Your Journey
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="contact-form-wrapper">
            <div className="contact-form-heading">
              <span>SEND AN ENQUIRY</span>
              <h2>Send Us A Message</h2>
              <p>
                Complete the form below and provide details about how we can
                assist you.
              </p>
            </div>

            <ContactForm />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="contact-bottom-cta">
          <div>
            <span>TESAZMARE LOGISTICS</span>
            <h2>Your Journey Starts With Us</h2>
            <p>
              Get in touch today to discuss your transportation requirements.
            </p>
          </div>

          <Link href="/services">
            Explore Our Services
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
