import type { Metadata } from "next";

export const pricingMetadata: Metadata = {
  title: "Shuttle Prices & Transport Rates in Cape Town",

  description:
    "Explore shuttle prices, airport transfer rates, private transport and group travel pricing with Tesazmare Logistics and Tours. Contact our team for current transport rates and quotations.",

  keywords: [
    "Tesazmare Logistics and Tours",
    "shuttle prices Cape Town",
    "shuttle rates South Africa",
    "airport transfer prices Cape Town",
    "Cape Town transport rates",
    "private transfer prices",
    "group transportation rates",
    "Western Cape shuttle prices",
    "transport quotations Cape Town",
  ],

  alternates: {
    canonical: "/pricing",
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://tesazmarelogistics.co.za/pricing",
    siteName: "Tesazmare Logistics and Tours",
    title: "Shuttle Prices & Transport Rates | Tesazmare Logistics and Tours",
    description:
      "View available shuttle and transport rates with Tesazmare Logistics and Tours. Find pricing for your journey and request a quotation.",
    images: [
      {
        url: "/images/shuttle-hero.png",
        width: 1200,
        height: 630,
        alt: "Tesazmare Logistics and Tours transport services and pricing",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Shuttle Prices | Tesazmare Logistics and Tours",
    description:
      "Explore shuttle, airport transfer and private transportation rates across Cape Town and the Western Cape.",
    images: ["/images/shuttle-hero.png"],
  },
};
