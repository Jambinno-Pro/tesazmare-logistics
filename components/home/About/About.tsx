"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import "./AboutSection.css";

export default function AboutSection() {
  const [today, setToday] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    destination: "",
    date: "",
    passengers: "1 Passenger",
    service: "Shuttle Services",
    message: "",
  });

  // Calculate today's local date after the component mounts.
  useEffect(() => {
    const date = new Date();

    const localDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(localDate);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = `
TESAZMARE LOGISTICS - Booking Enquiry

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Service: ${form.service}
Pickup: ${form.pickup}
Destination: ${form.destination}
Travel Date: ${form.date}
Passengers: ${form.passengers}
Message: ${form.message}
    `;

    const whatsappNumber = "REPLACE_WITH_WHATSAPP_NUMBER";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="about-booking-section" id="about">
      <div className="about-booking-container">
        {/* ABOUT CONTENT */}
        <div className="about-content">
          <span className="section-eyebrow">
            <span className="eyebrow-line" />
            ABOUT TESAZMARE
          </span>

          <h2>
            Your Journey,
            <br />
            <span>Our Commitment.</span>
          </h2>

          <p className="about-intro">
            At TESAZMARE Logistics and Tours, we believe every journey should be
            comfortable, convenient and stress-free. We are committed to
            providing reliable shuttle transportation solutions that connect
            people to the places that matter.
          </p>

          <p className="about-description">
            From airport transfers, private shuttles and group transportation to
            game drive transfers, events transport and special occasions, we
            provide convenient travel solutions for every journey. We also offer
            corporate transport to meet your business and logistics needs,
            ensuring every trip is comfortable, reliable and hassle-free.
          </p>

          <div className="about-features">
            <div className="about-feature">
              <div className="feature-icon">
                <ShieldCheck size={21} />
              </div>
              <div>
                <h4>Reliable Transportation</h4>
                <p>Travel with confidence and peace of mind.</p>
              </div>
            </div>

            <div className="about-feature">
              <div className="feature-icon">
                <Clock size={21} />
              </div>
              <div>
                <h4>Convenient Travel</h4>
                <p>Transport solutions designed around your journey.</p>
              </div>
            </div>

            <div className="about-feature">
              <div className="feature-icon">
                <Users size={21} />
              </div>
              <div>
                <h4>Individual & Group Travel</h4>
                <p>Transportation for individuals and groups.</p>
              </div>
            </div>
          </div>

          <a href="/about" className="about-read-more">
            Discover More About Us
            <ArrowUpRight size={18} />
          </a>

          <div className="about-bottom-note">
            <span className="about-note-icon">
              <MapPin size={18} />
            </span>
            <span>Every journey matters. Let us get you there.</span>
          </div>
        </div>

        {/* BOOKING FORM */}
        <div className="booking-card">
          <div className="booking-card-header">
            <div>
              <span className="booking-eyebrow">LET'S GET YOU MOVING</span>
              <h3>Book Your Journey</h3>
              <p>Tell us about your trip and we'll be in touch.</p>
            </div>

            <div className="booking-header-icon">
              <ArrowRight size={23} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+27 00 000 0000"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="service">Select Service</label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option>Shuttle Services</option>
                <option>Airport Transfers</option>
                <option>Game Drive Transfers</option>
                <option>Events Transfer</option>
                <option>Corporate Transport</option>
                <option>Truck Hire</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickup">Pickup Location *</label>
                <input
                  id="pickup"
                  name="pickup"
                  type="text"
                  placeholder="Pickup location"
                  value={form.pickup}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="destination">Destination *</label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  placeholder="Where to?"
                  value={form.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Travel Date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={today || undefined}
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passengers">Passengers</label>
                <select
                  id="passengers"
                  name="passengers"
                  value={form.passengers}
                  onChange={handleChange}
                >
                  <option>1 Passenger</option>
                  <option>2 Passengers</option>
                  <option>3 Passengers</option>
                  <option>4 Passengers</option>
                  <option>5 Passengers</option>
                  <option>6–10 Passengers</option>
                  <option>11+ Passengers</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Information</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us anything else about your journey..."
                rows={3}
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="booking-submit">
              Send Booking Enquiry
              <ArrowRight size={19} />
            </button>

            <p className="booking-disclaimer">
              <CheckCircle2 size={14} />
              Our team will follow up with you about your enquiry.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
