"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./pricing.css";

type PricingRule = {
  id: number;
  serviceType: string;
  routeName?: string | null;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  minimumPassengers: number;
  maximumPassengers: number;
  pricingBasis: string;
  amount: number;
  currency: string;
  isActive: boolean;
  effectiveFromUtc?: string | null;
  effectiveUntilUtc?: string | null;
  description?: string | null;
};

const API_BASE_URL = (() => {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  ).replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
})();

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currency || "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatServiceName(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}

function isCurrentlyEffective(price: PricingRule) {
  const now = new Date();

  const start = price.effectiveFromUtc
    ? new Date(price.effectiveFromUtc)
    : null;

  const end = price.effectiveUntilUtc
    ? new Date(price.effectiveUntilUtc)
    : null;

  return price.isActive && (!start || start <= now) && (!end || end >= now);
}

export default function PricingPage() {
  const [prices, setPrices] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPricing() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/pricing`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("We could not load the pricing information.");
        }

        const data: PricingRule[] = await response.json();

        if (isMounted) {
          setPrices(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading prices.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPricing();

    return () => {
      isMounted = false;
    };
  }, []);

  const activePrices = useMemo(
    () => prices.filter(isCurrentlyEffective),
    [prices],
  );

  return (
    <div className="public-pricing">
      <section className="pricing-hero">
        <div className="pricing-hero-overlay" />

        <div className="pricing-container pricing-hero-content">
          <span className="pricing-eyebrow">TESAZMARE LOGISTICS</span>

          <h1>
            Our <span>Pricing</span>
          </h1>

          <p>
            Explore our available transport rates and find the right shuttle
            solution for your journey.
          </p>

          <a href="#available-prices" className="pricing-hero-button">
            View Our Prices
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="pricing-intro">
        <div className="pricing-container">
          <span className="pricing-section-label">CLEAR AND SIMPLE RATES</span>

          <h2>Transport Pricing That Works for You</h2>

          <p>
            Our pricing is managed directly by our team to keep the information
            on this page up to date. Select a service below to view its current
            rates.
          </p>
        </div>
      </section>

      <section className="pricing-list-section" id="available-prices">
        <div className="pricing-container">
          <div className="pricing-list-heading">
            <div>
              <span className="pricing-section-label">AVAILABLE RATES</span>
              <h2>Explore Our Prices</h2>
            </div>

            <span className="pricing-currency">
              Prices in South African Rand
            </span>
          </div>

          {loading && (
            <div className="pricing-message">
              <span className="pricing-loader" />
              <p>Loading our latest prices...</p>
            </div>
          )}

          {!loading && error && (
            <div className="pricing-message pricing-error">
              <h3>Pricing is temporarily unavailable</h3>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="pricing-retry-button"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && activePrices.length === 0 && (
            <div className="pricing-message">
              <h3>Our prices are being updated</h3>
              <p>
                Please contact our team for a quotation and current transport
                rates.
              </p>
              <Link href="/contact" className="pricing-contact-button">
                Contact Us
              </Link>
            </div>
          )}

          {!loading && !error && activePrices.length > 0 && (
            <div className="pricing-grid">
              {activePrices.map((price) => {
                const isPerPassenger =
                  price.pricingBasis.toLowerCase() === "perpassenger" ||
                  price.pricingBasis.toLowerCase() === "per_passenger";

                const route =
                  price.routeName ||
                  [price.pickupLocation, price.dropoffLocation]
                    .filter(Boolean)
                    .join(" → ");

                return (
                  <article className="pricing-card" key={price.id}>
                    <div className="pricing-card-top">
                      <span className="pricing-service-type">
                        {formatServiceName(price.serviceType)}
                      </span>

                      <span className="pricing-card-icon" aria-hidden="true">
                        ↗
                      </span>
                    </div>

                    <h3>{route || "Transport Service"}</h3>

                    {price.description && (
                      <p className="pricing-description">{price.description}</p>
                    )}

                    {(price.pickupLocation || price.dropoffLocation) && (
                      <div className="pricing-route">
                        {price.pickupLocation && (
                          <span>{price.pickupLocation}</span>
                        )}

                        {price.pickupLocation && price.dropoffLocation && (
                          <span className="pricing-route-arrow">→</span>
                        )}

                        {price.dropoffLocation && (
                          <span>{price.dropoffLocation}</span>
                        )}
                      </div>
                    )}

                    <div className="pricing-price">
                      <strong>
                        {formatPrice(price.amount, price.currency)}
                      </strong>
                      <span>
                        {isPerPassenger ? "per passenger" : "per trip"}
                      </span>
                    </div>

                    <div className="pricing-passengers">
                      <span>Passenger range</span>
                      <strong>
                        {price.minimumPassengers}
                        {price.maximumPassengers > price.minimumPassengers
                          ? ` – ${price.maximumPassengers}`
                          : ""}
                        {price.maximumPassengers === 1
                          ? " passenger"
                          : " passengers"}
                      </strong>
                    </div>

                    <Link href="/contact" className="pricing-book-button">
                      Enquire About This Price
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="pricing-cta">
        <div className="pricing-container pricing-cta-content">
          <div>
            <span className="pricing-section-label">NEED A QUOTATION?</span>
            <h2>Let Us Help You Plan Your Journey</h2>
            <p>
              Get in touch with our team for assistance with your transport
              requirements.
            </p>
          </div>

          <Link href="/contact" className="pricing-cta-button">
            Contact Our Team
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
