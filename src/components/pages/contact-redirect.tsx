"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Static export cannot issue a server redirect. Keep old bookmarks working
// without rendering the retired Contact page on any screen size.
export function ContactRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(
      window.location.hash === "#locations"
        ? "/about/#about-locations-title"
        : `/support/${window.location.search}#contact-form`,
    );
  }, [router]);
  return (
    <div className="inner-page page-padding inner-section">
      <p>
        Our contact form is now on Support.{" "}
        <Link className="text-link" href="/support/#contact-form">
          Continue to the form
        </Link>
      </p>
    </div>
  );
}
