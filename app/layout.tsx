import type { Metadata } from "next";
import Script from "next/script";
import { Caveat, Fraunces, Public_Sans, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { localBusinessJsonLd, OG_IMAGE, SITE_NAME, SITE_URL } from "./seo";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-heading" });

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

// Serif accent for quotes and scripture; variable weight, with italics for citations.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

// Handwritten accent for doodled callouts.
const caveat = Caveat({ subsets: ["latin"], weight: "600", variable: "--font-hand" });

const description =
  "Pressure washing and soft washing in Tyler and East Texas for houses, roofs, driveways and businesses. Rated 5.0 on Google. Free in-person estimates.";

// Pages fill the title template and add their own canonical URL and share card (see ./seo.ts);
// these are the home page's values and the fallback for anything that doesn't.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Pressure Washing in Tyler, TX | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME} | Tyler & East Texas`,
    description,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        publicSans.variable,
        raleway.variable,
        fraunces.variable,
        caveat.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        {/* Structured data, not code, so a plain script tag; "<" is escaped so the JSON can't close it. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Script src="https://www.lukebaber.com/review/loader.js" />
      </body>
    </html>
  );
}
