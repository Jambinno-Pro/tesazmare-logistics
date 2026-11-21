import Link from "next/link";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <span className="cta-eyebrow">LET'S GET YOU MOVING</span>

          <h2>
            Ready for Your Next <span>Journey?</span>
          </h2>

          <p>
            Whether you need an airport transfer, private shuttle or group
            transportation, TESAZMARE Logistics is ready to get you there.
          </p>

          <div className="cta-buttons">
            <Link href="/booking" className="cta-primary-btn">
              Book Your Shuttle
              <span>→</span>
            </Link>

            <Link href="/contact" className="cta-secondary-btn">
              Contact Us
            </Link>
          </div>

          <span className="cta-tagline">
            Comfortable Journeys. Reliable Connections.
          </span>
        </div>

        <div className="cta-visual">
          <div className="cta-image-overlay" />
          <div className="cta-visual-label">
            <span>YOUR JOURNEY</span>
            <strong>STARTS HERE.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
