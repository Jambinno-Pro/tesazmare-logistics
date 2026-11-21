"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, UserRound, ArrowUpRight } from "lucide-react";

import "./Navbar.css";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Destinations", href: "/destinations" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="tesazma-navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <Image
            src="/images/tesazmare-logistics.png"
            alt="TESAZMARE Logistics Logo"
            width={400}
            height={150}
            priority
            quality={100}
            unoptimized
            className="navbar-logo-image"
          />
        </Link>
        {/* DESKTOP NAVIGATION */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="navbar-link">
              {item.name}
            </Link>
          ))}
        </nav>
        {/* NAVBAR ACTIONS */}
        <div className="navbar-actions">
          <Link
            href="/admin/login"
            className="navbar-login"
            aria-label="Dashboard login"
            title="Dashboard login"
          >
            <UserRound size={19} />
          </Link>

          <Link href="/booking" className="navbar-booking">
            <span>Book a Shuttle</span>
            <ArrowUpRight size={17} />
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="navbar-mobile-menu"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        id="navbar-mobile-menu"
        className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>

        <div className="navbar-mobile-actions">
          <Link
            href="/admin/login"
            className="navbar-mobile-login"
            onClick={() => setMenuOpen(false)}
          >
            <UserRound size={18} />
            Dashboard Login
          </Link>

          <Link
            href="/booking"
            className="navbar-mobile-booking"
            onClick={() => setMenuOpen(false)}
          >
            Book Your Shuttle
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
