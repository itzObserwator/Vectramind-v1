// Expanded from the live Synapse product page; feature scope is preserved.
export const synapseDetailSections = [
  {
    id: "customer-personalization",
    label: "A relationship in every conversation",
    title: "More relevant. In both directions.",
    items: [
      [
        "Two-way customer conversations",
        "Enable push/pull SMS and two-way messaging so people can respond as well as receive. Use each interaction to understand the customer and make communication more personal, while reducing avoidable call-centre work.",
      ],
      [
        "Context that makes a difference",
        "Use transaction information and customer feedback to shape relevant messages and offers. Automated responses can help teams respond to concerns more quickly.",
      ],
      [
        "Analytics your team can use",
        "Track activity in real time, explore message performance and share analytics with colleagues using drag-and-drop tools.",
      ],
    ],
  },
  {
    id: "alert-manager",
    label: "Alert Manager",
    title: "The right message. The right trigger.",
    items: [
      [
        "Priority messaging",
        "Define which messages should take priority and manage the queue around the importance of the communication.",
      ],
      [
        "Database alerts",
        "Connect databases to trigger messages when the relevant information or event becomes available.",
      ],
      [
        "Dynamic templates",
        "Create, store and configure reusable message content through Template Manager.",
      ],
      [
        "File alerts",
        "Process messaging from FTP files to support batch-based communication workflows.",
      ],
      [
        "HL7 integration",
        "Connect healthcare workflows by translating HL7 events into patient-facing messaging.",
      ],
      [
        "Service messaging",
        "Separate and manage messages by service and host application so different workflows remain organized.",
      ],
    ],
  },
  {
    id: "synapse-interface",
    label: "Clarity and control",
    title: "One interface. A clearer picture.",
    items: [
      [
        "Responsive, bilingual access",
        "Use the application on desktop, tablet or mobile, with English and Arabic interface options.",
      ],
      [
        "Comprehensive dashboards",
        "See weekly and monthly messaging statistics across channels and use real-time dashboards to keep track of activity.",
      ],
      [
        "Delivery reporting",
        "Follow individual message deliveries with detailed channel-level reporting.",
      ],
      [
        "Interface management",
        "Manage the applications consuming platform services from one place, alongside campaign approval, credits and priority controls.",
      ],
    ],
  },
] as const;
export const synapseIntegrations = [
  "Cerner",
  "Cloverleaf",
  "InterSystems",
  "Rhapsody",
  "TIBCO",
] as const;
