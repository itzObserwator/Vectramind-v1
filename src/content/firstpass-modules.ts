// Coverage checked against the published Firstpass module pages on 27 October 2026.
// Repeated suite introductions and enquiry forms are shared by the new pages.
export type FirstpassModule = {
  slug: string;
  name: string;
  headline: string;
  introduction: string;
  sections: { title: string; items: readonly (readonly [string, string])[] }[];
};
export const firstpassModules: FirstpassModule[] = [
  {
    slug: "fp-scheduler",
    name: "fp scheduler",
    headline: "Appointments, made simpler.",
    introduction:
      "Give patients a digital front door to book appointments around the clock. Connect booking, confirmation, reminders and waitlist management to help your team spend less time coordinating and more time caring.",
    sections: [
      {
        title: "From booking to arrival",
        items: [
          [
            "Connected mobile booking",
            "Integrate the patient mobile app with EMR/HIS scheduling through HL7. Booking requests can be reviewed by call-centre or customer-care staff before the appointment is confirmed by SMS or WhatsApp.",
          ],
          [
            "Always-open scheduling",
            "Automated online appointment booking gives patients 24/7 access and helps reduce phone traffic and repetitive scheduling work.",
          ],
          [
            "Dynamic waitlists",
            "Prioritize eligible waitlisted patients and notify them when an appointment slot becomes available.",
          ],
          [
            "Two-way reminders",
            "Send appointment reminders and confirmations, with a convenient way for patients to respond or reschedule.",
          ],
        ],
      },
      {
        title: "A better use of everyone’s time",
        items: [
          [
            "For patients",
            "Make appointments easier to arrange and keep, with clearer communication before the visit and less avoidable waiting.",
          ],
          [
            "For care teams",
            "Coordinate bookings and staff resources with information connected to the facility’s existing scheduling systems.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-kyp",
    name: "fp kyp",
    headline: "Know your patient. Simplify the start.",
    introduction:
      "Make patient registration and information updates easier through self-service onboarding, document uploads and a staff verification workflow. Keep identity and insurance information ready for the next step of care.",
    sections: [
      {
        title: "A clearer registration journey",
        items: [
          [
            "Self-service registration",
            "New patients can register through the mobile app or web portal and upload government-issued identification and insurance documents.",
          ],
          [
            "Updates for returning patients",
            "Existing patients can update their information or upload replacement documents without repeating the entire registration process.",
          ],
          [
            "Mobile onboarding",
            "Bring registration, document submission and information updates together in a patient-friendly mobile experience.",
          ],
          [
            "Checker-led verification",
            "Facility staff review submissions, approve patient details and request additional information or documents when needed.",
          ],
        ],
      },
      {
        title: "Confidence from the first interaction",
        items: [
          [
            "Patient convenience",
            "Reduce avoidable administration and waiting by letting patients prepare their information before they arrive.",
          ],
          [
            "Better information, clearer workflows",
            "Help staff maintain accurate records, verify patient identity and support the facility’s security and compliance processes.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-consent-forms",
    name: "fp consent forms",
    headline: "Consent without the paperwork.",
    introduction:
      "Bring consent, intake and assessment forms into the digital patient journey. Work alongside fp kyp to support new and returning patients before, during and after a visit, while keeping access and renewal workflows connected.",
    sections: [
      {
        title: "Forms that meet patients where they are",
        items: [
          [
            "Omnichannel access",
            "Share forms through mobile, WhatsApp, SMS, email links and on-site kiosks with QR-code access. Patients can complete forms at the pre-visit, current-visit or post-visit stage.",
          ],
          [
            "Digital forms and eSignatures",
            "Let patients complete consent, intake and assessment forms on their preferred device and use electronic signatures in paperless workflows.",
          ],
          [
            "Centralized management",
            "Connect form and consent data across platforms through APIs, alongside your patient onboarding process.",
          ],
          [
            "Multilingual support",
            "Use language support and machine translation to make forms more accessible to patients in their preferred language.",
          ],
        ],
      },
      {
        title: "Five techniques for connected consent",
        items: [
          [
            "Document digitization",
            "Computer vision extracts information from scanned documents so teams can move away from repeated manual entry.",
          ],
          [
            "Personalized forms",
            "A rules engine adapts forms to individual responses and the context of the patient’s journey.",
          ],
          [
            "Natural language processing",
            "Analyze free-text consent to tag attributes such as dates, care activities and information-access permissions.",
          ],
          [
            "Renewal reminders",
            "Event and time-series algorithms track consent cycles and help identify when renewal is due.",
          ],
          [
            "Compliance monitoring",
            "Use anomaly detection and process rules to identify unusual activity for review and monitor consent workflows.",
          ],
        ],
      },
      {
        title: "Access shaped around context",
        items: [
          [
            "Personas and permissions",
            "Map access around healthcare workflows, user behaviour and policies at the individual or department level. Automated permissions can be refined as requirements change.",
          ],
          [
            "Examples of contextual access",
            "An oncologist may need read/write access to cancer history; a paediatrician may need a child’s flu records; a nutritionist may need read-only nutrition and dietary information. The facility defines the appropriate access.",
          ],
          [
            "Manage digitization carefully",
            "Patient records need protection against unauthorized access. Connected consent workflows help teams manage privacy, compliance and administrative workload as information becomes digital.",
          ],
        ],
      },
      {
        title: "From manual steps to a connected workflow",
        items: [
          [
            "Paper forms → an e-consent portal",
            "Replace lengthy hospital paperwork with digital access before or during the visit.",
          ],
          [
            "Photocopying and filing → guided completion",
            "Patients can receive chatbot assistance with form questions, while consent information is managed centrally.",
          ],
          [
            "Untracked validity → configured reminders",
            "Record consent validity periods and configure renewal reminders rather than relying on manual checks.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-flow",
    name: "fp flow",
    headline: "A smoother journey through care.",
    introduction:
      "Manage patient movement from arrival to departure with flexible check-in, live queue visibility and connected service touchpoints. Give patients clearer guidance and staff the information to respond to changing demand.",
    sections: [
      {
        title: "Check in, your way",
        items: [
          [
            "Self-service mobile check-in",
            "Patients scan a QR code on their smartphone to check in and receive a digital token.",
          ],
          [
            "Assisted check-in",
            "A tablet application helps staff support patients with registration, check-in and appointment scheduling.",
          ],
          [
            "Manual check-in",
            "Keep an efficient in-person option for patients who prefer help from the front desk.",
          ],
          [
            "Kiosk check-in",
            "Use a single digital token across the journey. Patients can identify themselves with an MRN, mobile number or national ID, with location-specific services and an English/Arabic interface.",
          ],
        ],
      },
      {
        title: "Connect every service touchpoint",
        items: [
          [
            "Pre-arrival preferences",
            "Configure requests such as parking, preferred language or wheelchair assistance through the mobile app or web portal.",
          ],
          [
            "Display boards",
            "Show patient numbers, estimated wait times and the relevant service room or counter to make queues easier to navigate.",
          ],
          [
            "QR-code scanning",
            "Scan token information at laboratories, radiology, pharmacies and other service points using the published 2D/3D-code scanning workflow.",
          ],
          [
            "Patient payments",
            "Connect third-party payment gateways, including co-pay workflows. Revenue Cycle Management events can trigger payments that patients review and complete in the mobile app.",
          ],
        ],
      },
      {
        title: "Visibility for better decisions",
        items: [
          [
            "Live patient movement",
            "Dashboards and updates show where patients are, how queues are changing and where attention is needed.",
          ],
          [
            "Staff and resource coordination",
            "Use current demand and patient-flow patterns to inform staff allocation, reduce bottlenecks and improve service continuity.",
          ],
          [
            "Continuous improvement",
            "Patient-flow analytics help teams refine operations, communication and care delivery over time.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-connect",
    name: "fp connect",
    headline: "Your systems. One connected journey.",
    introduction:
      "The Firstpass integration layer brings the suite’s patient touchpoints together with the systems your facility already uses. Discuss your interfaces, data flows and implementation requirements with Vectramind.",
    sections: [
      {
        title: "Integration as part of the whole",
        items: [
          [
            "Connected touchpoints",
            "Use fp connect within the Firstpass suite to support an end-to-end engagement flow between patients and providers.",
          ],
          [
            "An approach for your facility",
            "Vectramind’s published integration expertise covers EMRs, pharmacy and lab systems, API- and database-based connections, and bi-directional synchronization. The team can assess which approach fits your environment.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-engage",
    name: "fp engage",
    headline: "Keep the conversation connected.",
    introduction:
      "Communicate with patients across SMS, email, WhatsApp, bots and live agents. Keep information timely and relevant from appointment booking and reminders through care and post-visit follow-up.",
    sections: [
      {
        title: "One conversation, across channels",
        items: [
          [
            "SMS and email",
            "Send clinical and non-clinical messages such as appointment reminders, report-readiness notices, feedback requests and awareness campaigns. Two-way conversations can capture requests and enquiries.",
          ],
          [
            "WhatsApp Business",
            "Use conversational bot flows to answer questions, share information and promote services. Service-catalogue availability depends on the region.",
          ],
          [
            "A conversational flow builder",
            "Automate FAQs and routine enquiries about services, registration requirements and physician availability. Capture patient preferences to make interactions more relevant.",
          ],
        ],
      },
      {
        title: "Ready-to-use bot flows",
        items: [
          [
            "Appointments",
            "Support booking and confirmation, cancellations, rescheduling and automated reminders.",
          ],
          [
            "Care information",
            "Notify patients about lab results or medication refills and share health awareness information and targeted campaigns.",
          ],
          [
            "Documents and onboarding",
            "Identify missing documents, offer upload options before arrival and collect onboarding information through a Know Your Patient flow.",
          ],
          [
            "Deploy around your needs",
            "Pre-built templates reduce setup work. Some flows need an EMR connection for patient-specific information; others can operate independently.",
          ],
        ],
      },
      {
        title: "A human handover when it matters",
        items: [
          [
            "Live-agent connection",
            "Transfer questions beyond the bot’s configured capabilities to a dedicated agent for personal support.",
          ],
          [
            "Agent performance",
            "Track response times, unique chats and total chat volume to inform staffing and improve service.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-livecast",
    name: "fp livecast",
    headline: "See the moment. Shape what’s next.",
    introduction:
      "Bring patient flow, engagement and operational information into a real-time view. Identify bottlenecks, monitor service performance and use predictive insights to guide resource decisions.",
    sections: [
      {
        title: "Your facility, in view",
        items: [
          [
            "Operational signals",
            "Department heatmaps, appointment trends, wait-time alerts, issued/served/pending tokens and transit-time graphs show how the facility is working.",
          ],
          [
            "Department dashboards",
            "Track radiology visits and services; laboratory volumes and care times; pharmacy counters, prescriptions and dispensing; emergency arrivals, priorities and staff; and billing counters, service times and patient flow.",
          ],
          [
            "Patient satisfaction",
            "Monitor clinical and non-clinical touchpoints, including administration and check-out, alongside demographics, staffing and resource use.",
          ],
          [
            "Revenue insights",
            "Explore the relationships between patient satisfaction, engagement and revenue to inform operational planning.",
          ],
        ],
      },
      {
        title: "Understand the patient experience",
        items: [
          [
            "PREM and happiness measures",
            "Use Patient-Reported Experience Measures and the Patient Happiness Index to find opportunities to improve.",
          ],
          [
            "Sentiment and channels",
            "Review positive, neutral and negative feedback, average sentiment, frequent themes and trends. Compare feedback from mobile, web, social media and SMS.",
          ],
          [
            "Scores and touchpoints",
            "Track departmental, care-role and touchpoint scores, age-based feedback, NPS and HCAHPS measures, and feedback on doctors, nurses and pharmacists.",
          ],
          [
            "Surveys and devices",
            "Monitor surveys sent, response and submission ratios, questions receiving responses and score trends. View active/inactive devices, device usage and peak hours.",
          ],
        ],
      },
      {
        title: "From live visibility to predictive planning",
        items: [
          [
            "Flow and visual context",
            "Use green, amber and red anomaly levels to review patient waits by department or service. CCTV/live-video integration adds visual context where configured.",
          ],
          [
            "Demand and workload forecasting",
            "Forecast patient flow by department, day, week or month and compare demand with capacity across clinics, pharmacies, laboratories and radiology.",
          ],
          [
            "Learning over time",
            "The published module describes forecasting accuracy improving over a 3–9 month learning period. Outcomes depend on the data and deployment.",
          ],
          [
            "Operational value",
            "Use live and predictive insights to improve allocation, reduce unnecessary waits, inform planning and understand costs and revenue opportunities.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-feedback",
    name: "fp feedback",
    headline: "Listen closely. Improve continuously.",
    introduction:
      "Capture patient feedback at meaningful points in the journey and turn it into actionable insight. Connect department-specific questions, real-time responses and surveys to support service recovery and improvement.",
    sections: [
      {
        title: "Feedback with useful context",
        items: [
          [
            "Real-time, targeted feedback",
            "Set triggers around care touchpoints, tailor questions by department and define response windows.",
          ],
          [
            "Flexible multilingual forms",
            "Create different question and answer formats with English and Arabic support, and collect responses on web and mobile.",
          ],
          [
            "Actionable analysis",
            "Calculate NPS and the Patient Happiness Index, weight questions and use NLP to identify themes and trends.",
          ],
        ],
      },
      {
        title: "Surveys that look deeper",
        items: [
          [
            "Anonymous, time-bound surveys",
            "Distribute patient-experience surveys by email or SMS and define the collection period.",
          ],
          [
            "Recognizable benchmarks",
            "Use scoring aligned with CSAT, HCAHPS and OAS CAHPS benchmarks to identify strengths and opportunities.",
          ],
          [
            "Close the improvement loop",
            "Use patient insight to guide service recovery, department decisions, communication and more efficient feedback workflows.",
          ],
        ],
      },
    ],
  },
  {
    slug: "fp-escalate",
    name: "fp escalate",
    headline: "Spot concerns. Act earlier.",
    introduction:
      "Identify potential patient-experience issues before they become bigger problems. Configure thresholds, notify the right people and coordinate intervention around delays, waits and service availability.",
    sections: [
      {
        title: "Alerts shaped around your facility",
        items: [
          [
            "Configurable thresholds",
            "Set limits for waiting times, appointment delays, communication gaps and other patient metrics. Historical patterns and machine learning can inform dynamic thresholds.",
          ],
          [
            "Automatic notifications",
            "Notify teams by SMS or email when a threshold is breached, and make alerts available in the caregiver module.",
          ],
          [
            "Relevant messages",
            "Use configurable templates so the notification contains the context the receiving team needs.",
          ],
          [
            "Multi-tier escalation",
            "Route alerts to relevant groups based on severity, including multiple notifications where an issue needs wider attention.",
          ],
        ],
      },
      {
        title: "Turn awareness into action",
        items: [
          [
            "Earlier intervention",
            "Help relevant staff respond to patient concerns with less time spent manually monitoring every metric.",
          ],
          [
            "A strategy that improves",
            "Review historical trends and adjust thresholds and resource decisions as your patient-experience programme develops.",
          ],
        ],
      },
    ],
  },
];
