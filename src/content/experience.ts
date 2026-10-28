// The new reference-inspired homepage. Keep business copy separate from motion.
export const experience = {
  hero: {
    eyebrow: "Intelligence. Innovation. With you in mind.",
    title: ["Human connections.", "Intelligent by design."],
    description:
      "We bring people, technology and possibility together. Transform customer conversations and patient journeys with Vectramind.",
    mobileDescription: "Connect customer conversations and patient journeys.",
    pillars: ["Customer engagement", "Patient experience", "Connected systems"],
  },
  introduction: {
    label: "Customer & patient experiences",
    title: "Are disconnected\nexperiences holding\nyou back?",
    mobileTitle: "Less friction.\nMore connection.",
    mobileText:
      "Bring conversations, patient journeys and systems together for a simpler experience.",
    text: "When conversations, patient journeys and systems work in isolation, people feel the gaps. We build transformative platforms that adapt with advanced technology, bringing intelligence, innovation and connected experiences together to move your business forward.",
  },
  network: {
    title: "Many touchpoints.\nOne connected experience.",
    mobileTitle: "Every touchpoint.\nConnected.",
    mobileText:
      "Bring channels, care teams and systems together with Synapse and Firstpass.",
    text: "From the first conversation to the next appointment, connect your channels, teams and systems. Synapse and Firstpass keep the experience moving together.",
  },
};
// Inner platform ring first, then the outer channel/system ring.
// Coordinates are projected onto two ellipses by ecosystem-orbits.tsx.
export const ecosystemNodes = [
  {
    label: "Synapse",
    detail: "Connect customer conversations across channels with Synapse.",
    ring: 0,
    angle: 225,
    color: "blue",
  },
  {
    label: "Firstpass",
    detail:
      "Bring appointments, patient flow and communication into one journey.",
    ring: 0,
    angle: 315,
    color: "green",
  },
  {
    label: "APIs",
    detail:
      "Connect your applications and keep information moving between systems.",
    ring: 0,
    angle: 45,
    color: "yellow",
  },
  {
    label: "AI & insights",
    detail:
      "Turn complex data into clearer signals and more informed decisions.",
    ring: 0,
    angle: 135,
    color: "red",
  },
  {
    label: "WhatsApp",
    detail: "Build conversations on a channel your customers already use.",
    ring: 1,
    angle: 247.5,
    color: "green",
  },
  {
    label: "SMS & RCS",
    detail:
      "Reach people with timely messages and rich conversational experiences.",
    ring: 1,
    angle: 292.5,
    color: "blue",
  },
  {
    label: "Email",
    detail: "Keep every message connected to the wider customer journey.",
    ring: 1,
    angle: 337.5,
    color: "red",
  },
  {
    label: "CRM systems",
    shortLabel: "CRM",
    detail:
      "Keep your customer context connected across teams and touchpoints.",
    ring: 1,
    angle: 22.5,
    color: "yellow",
  },
  {
    label: "Patient journeys",
    shortLabel: "Patient care",
    detail: "From appointment to ongoing care",
    ring: 1,
    angle: 67.5,
    color: "green",
  },
  {
    label: "Care teams",
    detail: "Help teams coordinate each step of the patient experience.",
    ring: 1,
    angle: 112.5,
    color: "blue",
  },
  {
    label: "Integrations",
    detail: "Your systems, working together through connected platforms.",
    ring: 1,
    angle: 157.5,
    color: "yellow",
  },
  {
    label: "Push notifications",
    shortLabel: "Push",
    detail: "Keep people informed with updates at the right moment.",
    ring: 1,
    angle: 202.5,
    color: "red",
  },
] as const;
