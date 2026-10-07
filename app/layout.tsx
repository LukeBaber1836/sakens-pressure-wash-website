import type { Metadata } from "next";
import { Public_Sans, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-heading" });

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Saken's Pressure Washing | Tyler & East Texas",
  description:
    "Pressure washing and soft washing in East Texas. Free in-person estimates for houses, roofs, driveways, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", publicSans.variable, raleway.variable)}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
