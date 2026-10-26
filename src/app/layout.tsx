import type { Metadata } from "next";
import "./globals.css";
import "./inner-pages.css";
import "./experience.css";
import "./post-hero.css";
import "./capabilities.css";
import "./ecosystem.css";
import "./platforms.css";
import "./global-reach.css";
import "./landing-palette.css";
import "./footer.css";
import "./clients.css";
import "./page-theme.css";
import "./product-landing.css";
import "./capabilities-page.css";
import "./about-page.css";
import "./support-page.css";
import "./primary-theme.css";
export const metadata: Metadata = {
  icons: { icon: "/images/vectramind-mark.svg" },
  title: "Vectramind — Transforming Human Experiences",
  description:
    "Adapt & evolve with Vectramind. AI-powered customer engagement, unified patient experiences, and seamlessly connected systems. Discover Synapse and Firstpass.",
  openGraph: {
    title: "Vectramind — Adapt & Evolve",
    description: "Intelligence. Innovation. Technology. With you in mind.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/space-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
