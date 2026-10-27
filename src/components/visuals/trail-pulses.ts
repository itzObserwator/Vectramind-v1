// Shared appearance and timing for the footer and hero light streaks.
// Original logo artwork: blue, green, red and yellow across both trail systems.
export const trailPulseColors = ["#2873B9", "#318A3E", "#E22526", "#F2BB0B"];
export const heroPulseColors = trailPulseColors;
export const trailPulseLength = 0.055;
export const trailPulseOpacity = 0.55;
export const trailPulseDuration = (index: number) => 8 + (index % 3);
export const trailPulseDelay = (index: number) => index * -0.87;
