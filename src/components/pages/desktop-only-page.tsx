"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export function DesktopOnlyPage({
  page,
  children,
}: {
  page: "contact" | "careers" | "insights";
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Match the shared header's mobile navigation breakpoint.
    const mobile = window.matchMedia("(max-width: 900px)");
    function redirect() {
      if (!mobile.matches) return;
      const destination =
        page === "insights"
          ? "/"
          : page === "careers"
            ? "/about"
            : window.location.hash === "#locations"
              ? "/about#about-locations-title"
              : `/support${window.location.search}#support-request`;
      router.replace(destination);
    }
    redirect();
    mobile.addEventListener("change", redirect);
    return () => mobile.removeEventListener("change", redirect);
  }, [page, router]);

  return <div className="desktop-only-page">{children}</div>;
}
