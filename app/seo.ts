import type { Metadata } from "next";
import { commercialServices, houseServices } from "./components/services-breakdown-data";
import { serviceTowns } from "./components/service-area-data";

// One place for the facts search engines see, so titles, share cards and structured data agree with
// each other and with Saken's Google Business Profile.

/** The live domain; the bare domain redirects here, so canonical URLs use it too. */
export const SITE_URL = "https://www.sakenpressurewash.com";
export const SITE_NAME = "Saken's Pressure Washing";

const PHONE = "+1-903-539-8960";

/** Link-preview image (1200x630) for every page, cropped from the hero video's poster frame. */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "A Saken's Pressure Washing crew member washing a commercial building from a lift at sunset in East Texas",
};

/** Saken's personal LinkedIn; it describes him, so it sits on `founder` rather than the business. */
const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/saken-sawyer-497636394/";

export const SOCIAL_PROFILES = [
  "https://www.facebook.com/profile.php?id=61558036448070",
  // Google Business Profile
  "https://www.google.com/maps?cid=6389810841970518092",
];

/**
 * Per-page title, description, canonical URL and share card. Next.js replaces a parent's
 * `openGraph` object wholesale rather than merging it, so each page restates the shared fields here.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Filled into the layout's "%s | Saken's Pressure Washing" template. */
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OG_IMAGE],
    },
  };
}

/**
 * schema.org description of the business for Google's local results. It's a service-area business
 * with no storefront, so the address stops at the city and `areaServed` lists the towns it covers.
 * Reviews are left out on purpose: Google ignores, and can penalize, review markup a business
 * publishes about itself.
 */
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  legalName: "Saken's Pressure Washing LLC",
  description:
    "Pressure washing and soft washing for homes and businesses in Tyler and East Texas, with free in-person estimates.",
  url: SITE_URL,
  telephone: PHONE,
  logo: `${SITE_URL}/logos/logo_vertical.png`,
  image: `${SITE_URL}${OG_IMAGE.url}`,
  founder: { "@type": "Person", name: "Saken Sawyer", sameAs: FOUNDER_LINKEDIN },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tyler",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: serviceTowns.map((town) => ({
    "@type": "City",
    name: `${town.name}, TX`,
  })),
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "07:00",
    closes: "20:00",
  },
  sameAs: SOCIAL_PROFILES,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Pressure washing services",
    itemListElement: [...houseServices, ...commercialServices].map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name, description: service.description },
    })),
  },
};
