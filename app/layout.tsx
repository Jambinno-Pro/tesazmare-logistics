import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = "https://tesazmarelogistics.co.za";
const BUSINESS_NAME = "Tesazmare Logistics and Tours";

const DEFAULT_DESCRIPTION =
  "Book reliable shuttle services, airport transfers, private tours, game drives and group transportation with Tesazmare Logistics and Tours. Enjoy comfortable and convenient travel across Cape Town, the Western Cape and beyond.";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  telephone: "+27846411910",
  email: "info@tesazmarelogistics.co.za",
  areaServed: [
    {
      "@type": "City",
      name: "Cape Town",
    },
    {
      "@type": "AdministrativeArea",
      name: "Western Cape",
    },
    {
      "@type": "Country",
      name: "South Africa",
    },
  ],
  knowsAbout: [
    "Shuttle services",
    "Airport transfers",
    "Private tours",
    "Group transportation",
    "Corporate transport",
    "Game drives",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+27846411910",
    email: "info@tesazmarelogistics.co.za",
    contactType: "customer service",
    areaServed: "ZA",
    availableLanguage: ["English"],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Tesazmare Logistics and Tours | Shuttle Services & Airport Transfers in Cape Town",
    template: "%s | Tesazmare Logistics and Tours",
  },

  description: DEFAULT_DESCRIPTION,

  applicationName: BUSINESS_NAME,

  keywords: [
    "Tesazmare Logistics and Tours",
    "TESAZMARE",
    "shuttle services Cape Town",
    "shuttle services South Africa",
    "airport transfers Cape Town",
    "Cape Town airport shuttle",
    "private transport Cape Town",
    "private tours Cape Town",
    "game drives Cape Town",
    "group transportation Cape Town",
    "corporate transport services",
    "Stellenbosch shuttle services",
    "Franschhoek transfers",
    "Garden Route transport",
    "Western Cape shuttle services",
  ],

  authors: [{ name: BUSINESS_NAME }],
  creator: BUSINESS_NAME,
  publisher: BUSINESS_NAME,

  alternates: {
    languages: {
      "en-ZA": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: BUSINESS_NAME,
    title:
      "Tesazmare Logistics and Tours | Shuttle Services & Airport Transfers",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/images/shuttle-hero.png",
        width: 1200,
        height: 630,
        alt: "Tesazmare Logistics and Tours shuttle and transport services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tesazmare Logistics and Tours | Shuttle & Transport Services",
    description: DEFAULT_DESCRIPTION,
    images: ["/images/shuttle-hero.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  referrer: "origin-when-cross-origin",
  category: "transportation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <body className={`${manrope.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />

        {children}
      </body>
    </html>
  );
}
