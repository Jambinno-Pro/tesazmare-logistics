"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Plane,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Hero.css";

const slides = [
  {
    image: "/images/shuttle-hero.png",
    title: "Airport Transfers",
    description: "Comfortable airport pickups and drop-offs.",
    location: "Cape Town International",
  },
  {
    image: "/images/wine-tours.png",
    title: "Wine Tours",
    description: "Discover the beauty of the Cape Winelands.",
    location: "Stellenbosch & Franschhoek",
  },
  {
    image: "/images/garden-route.png",
    title: "Garden Route",
    description: "Explore South Africa's beautiful coastline.",
    location: "Scenic South African journeys",
  },
  {
    image: "/images/services/private-transfers.png",
    title: "Private Transport",
    description: "Travel comfortably with personalised transport.",
    location: "Private & group journeys",
  },
  {
    image: "/images/game-drive.png",
    title: "Game Drive Transfers",
    description:
      "Enjoy convenient and comfortable transport to game reserves, wildlife parks and safari experiences.",
    location: "Game reserves & safari destinations",
  },
  {
    image: "/images/events-transfer.png",
    title: "Events Transfer",
    description:
      "Reliable group transportation for weddings, concerts, corporate functions and special occasions.",
    location: "Events, venues & functions",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[activeSlide];

  return (
    <section className="tesazma-hero">
      {/* FALLING DIAMOND SHOWER */}
      <div className="hero-diamond-shower" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className="hero-diamond"
            style={
              {
                left: `${(index * 37) % 100}%`,
                animationDelay: `${(index % 15) * 0.6}s`,
                animationDuration: `${6 + (index % 5)}s`,
                "--diamond-size": `${4 + (index % 4)}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="hero-container">
        {/* LEFT CONTENT */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            <span>TESAZMARE LOGISTICS</span>
          </div>

          <h1 className="hero-title">
            Every Journey
            <br />
            Deserves a
            <br />
            <span>Better Ride.</span>
          </h1>

          <p className="hero-description">
            Travel with comfort and confidence with Tesazmare Logistics. From
            airport transfers and private tours to group transportation, we make
            getting there easier.
          </p>

          <div className="hero-buttons">
            <Link href="/booking" className="hero-primary-button">
              Book Your Shuttle
              <ArrowUpRight size={19} />
            </Link>

            <Link href="/services" className="hero-secondary-button">
              Explore Our Services
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-highlights">
            <div className="hero-highlight">
              <div className="hero-highlight-icon">
                <Plane size={19} />
              </div>
              <div>
                <strong>Airport Transfers</strong>
                <span>Convenient airport journeys</span>
              </div>
            </div>

            <div className="hero-highlight">
              <div className="hero-highlight-icon">
                <MapPin size={19} />
              </div>
              <div>
                <strong>Private Tours</strong>
                <span>Explore at your own pace</span>
              </div>
            </div>

            <div className="hero-highlight">
              <div className="hero-highlight-icon">
                <Users size={19} />
              </div>
              <div>
                <strong>Group Travel</strong>
                <span>Transport for every occasion</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SLIDER */}
        <div className="hero-visual">
          <div className="hero-image-wrapper">
            {slides.map((slide, index) => (
              <div
                key={slide.image}
                className={`hero-slide ${
                  activeSlide === index ? "active" : ""
                }`}
                aria-hidden={activeSlide !== index}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 850px) 100vw, 50vw"
                  className="hero-image"
                />
              </div>
            ))}

            <div className="hero-image-overlay" />

            {/* SLIDE INFORMATION */}
            <div className="hero-slide-info">
              <span className="hero-slide-label">FEATURED SERVICE</span>

              <h2>{currentSlide.title}</h2>

              <p>{currentSlide.description}</p>

              <div className="hero-slide-location">
                <MapPin size={15} />
                {currentSlide.location}
              </div>
            </div>

            {/* SLIDE CONTROLS */}
            <div className="hero-slider-controls">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft size={21} />
              </button>

              <div className="hero-slider-dots">
                {slides.map((slide, index) => (
                  <button
                    key={slide.image}
                    type="button"
                    className={activeSlide === index ? "active" : ""}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                    aria-current={activeSlide === index ? "true" : undefined}
                  />
                ))}
              </div>

              <button type="button" onClick={nextSlide} aria-label="Next slide">
                <ChevronRight size={21} />
              </button>
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="hero-floating-card">
            <div className="hero-floating-icon">
              <MapPin size={20} />
            </div>

            <div className="hero-floating-text">
              <span>YOUR NEXT JOURNEY</span>
              <strong>Starts With Us</strong>
            </div>

            <div className="hero-floating-arrow">
              <ArrowUpRight size={19} />
            </div>
          </div>

          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="hero-bottom-strip">
        <div className="hero-marquee">
          <div className="hero-marquee-content">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="hero-bottom-inner" key={index}>
                <span>YOUR JOURNEY, OUR PRIORITY.</span>
                <span className="hero-strip-divider" />
                <span>SAFE. RELIABLE. COMFORTABLE.</span>
                <span className="hero-strip-divider" />
                <span>EVERY JOURNEY MATTERS.</span>
                <span className="hero-strip-divider" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
