// Shared appearance and timing for the footer and hero light streaks.
import { PRIMARY_SIGNALS } from "@/lib/primary-theme";
export const trailPulseColors = PRIMARY_SIGNALS;
export const trailPulseLength = 0.055;
export const trailPulseOpacity = 0.55;
export const trailPulseDuration = (index: number) => 8 + (index % 3);
export const trailPulseDelay = (index: number) => index * -0.87;
