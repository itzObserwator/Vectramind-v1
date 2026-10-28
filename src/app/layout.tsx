import type { Metadata } from "next";
import { SitePreloader } from "@/components/site-preloader";
import { PageTransitions } from "@/components/page-transitions";
import "./globals.css";
import "./experience.css";
import "./post-hero.css";
import "./capabilities.css";
import "./ecosystem.css";
import "./platforms.css";
import "./global-reach.css";
import "./landing-palette.css";
import "./footer.css";
import "./clients.css";
import "./primary-theme.css";
import "./typography.css";
import "./chat.css";
import "./page-transitions.css";
import "./preloader.css";
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
          href="/fonts/inter-ui.woff2"
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
      <body>
        <SitePreloader />
        <PageTransitions>{children}</PageTransitions>
      </body>
    </html>
  );
}
