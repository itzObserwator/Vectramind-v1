import type { ReactNode } from "react";
import { DesktopOnlyPage } from "@/components/pages/desktop-only-page";

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return <DesktopOnlyPage page="insights">{children}</DesktopOnlyPage>;
}
