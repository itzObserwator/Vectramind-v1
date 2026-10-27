export const products = {
  synapse: {
    name: "Synapse",
    category: "Customer engagement, connected",
    headline: ["Every message.", "More human."],
    description:
      "Turn functional messaging into engaging conversations. Reach your customers across channels, build stronger relationships, and grow one conversation at a time.",
    intro: "Because there’s a relationship in every conversation.",
    introText:
      "Synapse turns 2.8 billion notifications a year into opportunities for relevant, two-way conversations. Bring messaging, customer context and feedback together so each interaction can strengthen the relationship — from an appointment reminder to a personalized offer.",
    metrics: [
      ["800+", "clients worldwide"],
      ["2.8B", "notifications per year"],
      ["30+", "partners, channels & integrations"],
    ],
    features: [
      [
        "Reach at scale",
        "Built for high-throughput enterprise messaging, with support for sending up to 10,000 messages per second.",
      ],
      [
        "Campaigns on your terms",
        "Schedule campaigns for future dates, pause or reschedule them, and manage communications around your business.",
      ],
      [
        "A clearer view",
        "Review weekly and monthly messaging statistics, track individual deliveries with channel-level reports, and share analytics with your team using drag-and-drop tools.",
      ],
      [
        "Quality before every send",
        "Maker Checker helps your team review and approve messaging before a campaign goes live.",
      ],
      [
        "Your systems, connected",
        "Integrate with core systems through APIs, database connections and HL7 to enable real-time messaging.",
      ],
      [
        "Control where it counts",
        "Allocate messaging credits across departments and users, prioritize important communications, and centrally manage every application consuming platform services.",
      ],
    ],
    modules: [
      [
        "SMS & RCS",
        "Reach customers with notifications, alerts and richer mobile messaging.",
      ],
      [
        "WhatsApp",
        "Enable two-way conversations through a familiar customer messaging channel.",
      ],
      [
        "Email",
        "Bring email notifications and campaigns into the same engagement platform.",
      ],
      [
        "Chatbots",
        "Automate routine conversations and respond to customer enquiries.",
      ],
      ["Messenger", "Connect customer conversations through Messenger."],
      [
        "Push notifications",
        "Deliver timely updates through connected mobile applications.",
      ],
      [
        "Web notifications",
        "Keep customers informed at browser and web touchpoints.",
      ],
      [
        "Apple Messages",
        "Include the Apple messaging channel in your conversational ecosystem.",
      ],
      [
        "Instagram",
        "Bring Instagram messaging into your customer engagement strategy.",
      ],
      ["Viber", "Reach customers through Viber as part of your channel mix."],
      ["WeChat", "Extend connected messaging to customers using WeChat."],
    ],
    faqs: [
      [
        "Which channels does Synapse support?",
        "The published channel ecosystem covers SMS, RCS, email, WhatsApp, chatbots, Messenger, push notifications, web notifications, Apple Messages, Instagram, Viber and WeChat. The team can confirm channel availability and the integrations required for your deployment.",
      ],
      [
        "Can Synapse connect to our existing systems?",
        "Yes. Vectramind supports API- and database-based integrations, including healthcare integrations using HL7. The team can review your specific systems and deployment requirements.",
      ],
      [
        "Can our teams manage and approve campaigns?",
        "Synapse includes campaign scheduling, credit management, priority messaging and Maker Checker approval capabilities.",
      ],
    ],
  },
  firstpass: {
    name: "Firstpass",
    category: "Your unified patient experience platform",
    headline: ["Better journeys.", "Happier patients."],
    description:
      "Connect every touchpoint of the patient experience in an AI-native platform. Bring scheduling, patient flow, communications and real-time governance together to help teams improve resource use, service efficiency and the experience of care.",
    intro: "Take the dis-appointment out of appointments.",
    introText:
      "Firstpass connects your digital front door with the facility’s operations. Monitor patient status, waiting and transit times around the clock, see real-time data, oversee service delivery and use predictive insights to inform resource decisions. Its modules can work independently or as one connected patient journey.",
    metrics: [
      ["5M+", "patient engagements per year"],
      ["9", "connected platform modules"],
      ["4", "pillars of a better experience"],
    ],
    features: [
      [
        "Patients",
        "Give patients a clearer picture of their journey through smart management and streamlined communication. Better engagement supports stronger relationships, continuity and referrals.",
      ],
      [
        "Productivity",
        "Track and analyze appointments, check-ins, walk-ins, no-shows, waiting and care times, and department trends. Identify bottlenecks, time-saving opportunities and areas for operational improvement.",
      ],
      [
        "People",
        "Give doctors, nurses, radiologists and care teams one dashboard showing which patient is being served, where and when, including visibility across multiple patients.",
      ],
      [
        "Providers",
        "Connect every patient touchpoint and examine care and service times — from a consultation to a radiology scan — to make more informed facility-resource decisions.",
      ],
    ],
    modules: [
      [
        "fp scheduler",
        "Appointment scheduling that creates a simpler digital front door.",
      ],
      ["fp kyp", "Patient verification and insurance authentication."],
      [
        "fp consent forms",
        "Consent management for a more connected patient journey.",
      ],
      ["fp flow", "Patient flow management across your facility."],
      ["fp connect", "The integration layer that connects your systems."],
      ["fp engage", "Patient communications at meaningful moments."],
      ["fp livecast", "Real-time governance and analytics."],
      ["fp feedback", "Patient feedback and surveys."],
      ["fp escalate", "An escalation engine to keep teams informed."],
    ],
    faqs: [
      [
        "Does Firstpass support the complete patient journey?",
        "Its nine connected modules cover scheduling, verification, consent, patient flow, integration, communications, governance, feedback and escalation.",
      ],
      [
        "Can modules work independently?",
        "Firstpass modules are designed to work individually and as part of an integrated whole. The team can help you choose an approach that fits your facility.",
      ],
      [
        "How does Firstpass help care teams?",
        "Firstpass brings together visibility into patient status, waiting and transit times, facility operations and real-time analytics to support informed decisions.",
      ],
    ],
  },
} as const;
export type ProductKey = keyof typeof products;
