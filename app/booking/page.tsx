import type { Metadata } from "next";
import { Suspense } from "react";

import Navbar from "@/components/home/Navbar/Navbar";
import Footer from "@/components/home/Footer/Footer";
import BookingForm from "@/components/home/Booking/BookingForm";

interface BookingPageProps {
  searchParams: Promise<{ service?: string }>;
}

async function BookingContent({ searchParams }: BookingPageProps) {
  const { service } = await searchParams;

  return <BookingForm initialService={service ?? ""} />;
}

export const metadata: Metadata = {
  title: "Book a Shuttle, Airport Transfer or Private Tour",

  description:
    "Book your journey with Tesazmare Logistics and Tours. Arrange shuttle services, airport transfers, private transportation and group travel across Cape Town and the Western Cape.",

  keywords: [
    "Tesazmare Logistics and Tours",
    "book shuttle Cape Town",
    "online shuttle booking South Africa",
    "airport transfer booking Cape Town",
    "book private transport Cape Town",
    "group transport booking",
    "Western Cape shuttle booking",
    "private tour transportation",
    "Cape Town passenger transport",
  ],

  alternates: {
    canonical: "/booking",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://tesazmarelogistics.co.za/booking",
    siteName: "Tesazmare Logistics and Tours",
    title: "Book Your Journey | Tesazmare Logistics and Tours",
    description:
      "Arrange your shuttle, airport transfer or private transport with Tesazmare Logistics and Tours. Start planning your journey today.",
    images: [
      {
        url: "/images/shuttle-hero.png",
        width: 1200,
        height: 630,
        alt: "Book shuttle transportation with Tesazmare Logistics and Tours",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Book Your Journey | Tesazmare Logistics and Tours",
    description:
      "Book shuttle services, airport transfers and private transportation across Cape Town and the Western Cape.",
    images: ["/images/shuttle-hero.png"],
  },
};

export default function BookingPage({ searchParams }: BookingPageProps) {
  return (
    <>
      <Navbar />

      <main>
        <Suspense
          fallback={
            <div className="booking-loading">Loading booking form...</div>
          }
        >
          <BookingContent searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
