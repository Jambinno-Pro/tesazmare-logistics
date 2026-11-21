import Link from "next/link";
import "./Footer.css";
import CurrentYear from "./CurrentYear";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* COMPANY INFO */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            TESAZMARE<span> LOGISTICS</span>
          </Link>

          <p>
            Making every journey comfortable and convenient. Discover reliable
            shuttle transportation for your airport transfers, private trips,
            group travel and more.
          </p>

          <Link href="/booking" className="footer-book-btn">
            Book Your Shuttle <span>→</span>
          </Link>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/services">Our Services</Link>
            </li>
            <li>
              <Link href="/destinations">Destinations</Link>
            </li>
            <li>
              <Link href="/gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className="footer-column">
          <h3>Our Services</h3>
          <ul>
            <li>
              <Link href="/services">Shuttle Services</Link>
            </li>
            <li>
              <Link href="/services">Airport Transfers</Link>
            </li>
            <li>
              <Link href="/services">Private Transfers</Link>
            </li>
            <li>
              <Link href="/services">Group Transportation</Link>
            </li>
            <li>
              <Link href="/services">Events Transfers</Link>
            </li>
            <li>
              <Link href="/services">Corporate Transport</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column footer-contact">
          <h3>Get In Touch</h3>

          <div className="footer-contact-details">
            <a href="tel:+27846411910" className="footer-contact-item">
              <span>☎</span>
              <div>
                <small>Call Us</small>
                <strong>+27 84 641 1910</strong>
              </div>
            </a>

            <a
              href="mailto:info@tesazmare.co.za"
              className="footer-contact-item"
            >
              <span>✉</span>
              <div>
                <small>General Enquiries</small>
                <strong>info@tesazmare.co.za</strong>
              </div>
            </a>

            <a
              href="mailto:booking@tesazmare.co.za"
              className="footer-contact-item"
            >
              <span>✉</span>
              <div>
                <small>Booking Enquiries</small>
                <strong>booking@tesazmare.co.za</strong>
              </div>
            </a>
          </div>

          <Link href="/contact" className="footer-contact-link">
            Contact Our Team <span>→</span>
          </Link>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>
          © <CurrentYear /> TESAZMARE Logistics. All Rights Reserved.
        </p>

        <div className="footer-bottom-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
        </div>

        <span className="footer-credit">
          Comfortable Journeys. Reliable Connections.
        </span>
      </div>
    </footer>
  );
}
