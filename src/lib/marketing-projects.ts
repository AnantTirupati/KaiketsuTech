export type MarketingProject = {
  slug: string;
  name: string;
  category: string;
  status: "Live" | "Prototype";
  year: string;
  oneLiner: string;
  description: string;
  stack: string[];
  url?: string;
  highlights: string[];
};

/**
 * Ported from kaiketsu-portfolio-v2/lib/projects.ts. Static for now — the
 * production `projects` table's `is_showcase` column has zero rows today
 * (checked live), so there's nothing real to query yet. Per the user: show
 * this real work now, revisit whether it moves into the DB later. Real work
 * only — each entry reflects what's actually live at the linked URL, or (for
 * AirGated) the project's own progress report. No fabricated metrics.
 */
export const marketingProjects: MarketingProject[] = [
  {
    slug: "riseup-public-school",
    name: "Rise UP Public School",
    category: "Education",
    status: "Live",
    year: "2026",
    oneLiner: "Full site for a CBSE school — admissions, academics, and a parent portal.",
    description:
      "A multi-page site for a real English-medium CBSE school in Bhadohi, Uttar Pradesh, covering admissions enquiries and application tracking, an academic calendar and notices system, staged curriculum pages from Play Group through Class XII, a photo gallery, and a parent portal login.",
    stack: ["Next.js", "TypeScript"],
    url: "https://www.riseuppublicschool.com",
    highlights: [
      "Online admission enquiry + application tracking",
      "Notices, circulars, and an academic calendar that actually gets updated",
      "Parent portal login",
    ],
  },
  {
    slug: "airgated",
    name: "AirGated",
    category: "Research — Security",
    status: "Prototype",
    year: "2026",
    oneLiner: "Offline classroom attendance that can't be proxied, screenshotted, or GPS-spoofed.",
    description:
      "Every prior attendance method has a known exploit: paper roll call gets proxy answers, QR/web logins get forwarded by screenshot, GPS geofencing gets spoofed by mock-location apps. AirGated verifies attendance entirely on the local network — no cloud, no GPS — using device-bound asymmetric key signing (RSA-2048/SHA-256), link-layer MAC binding resolved via ARP, and a latency-based proximity gate. It's a working prototype: the full pipeline (registration → signing → check-in) has completed end-to-end on a real device, and two live multi-device impersonation attempts were both correctly blocked. It is explicitly not yet a deployable classroom tool.",
    stack: ["Python", "FastAPI", "WebCrypto", "SQLite", "WebSockets"],
    highlights: [
      "Device-bound RSA-2048 signing, no server-side password to steal",
      "Link-layer MAC binding via live ARP resolution",
      "Own threat model: 2/2 live impersonation attempts blocked",
    ],
  },
  {
    slug: "robo-rumble",
    name: "Robo Rumble 3.0",
    category: "Events",
    status: "Live",
    year: "2026",
    oneLiner: "Registration site for CSJMU's annual robotics fest.",
    description:
      "The site for Robo Rumble 3.0, CSJMU's annual robotics festival — Robo Wars, RC flying, line-following, esports, and an innovation track, with a prize pool above ₹1,50,000. Built to handle event registration for a multi-track college fest.",
    stack: ["Next.js"],
    url: "https://roborumble.in",
    highlights: ["Multi-track event registration", "Built for a real college fest, not a demo"],
  },
  {
    slug: "bansal-travels",
    name: "Bansal Travels",
    category: "Travel",
    status: "Live",
    year: "2026",
    oneLiner: "Outstation cab and tour booking, with route-specific pages and live fare estimates.",
    description:
      "A premium car-rental and tour-package site for a North India travel operator — fleet selection with per-km pricing, an FAQ block answering route-specific questions (fares, toll handling, sightseeing inclusions), and a large set of route-specific landing pages built for local search.",
    stack: ["Next.js"],
    url: "https://www.bansaltravels.online",
    highlights: ["Fleet + per-km fare display", "Programmatic route landing pages for local SEO"],
  },
  {
    slug: "devine-astro-talk",
    name: "Devine Astro-Talk",
    category: "Business",
    status: "Live",
    year: "2026",
    oneLiner: "Booking site for a Vedic astrology consultancy.",
    description:
      "A service and booking site for a Vedic astrology practice — product pages (numerology, match-making, Prashna Kundali), service pages (Kundli overview, palm reading, personalized consultation), and one-tap WhatsApp booking on every page.",
    stack: ["Next.js"],
    url: "https://www.devine-astro-talk.com",
    highlights: ["WhatsApp-first booking flow", "Structured product + service catalog"],
  },
  {
    slug: "devine-digital-academy",
    name: "Devine Digital Academy",
    category: "EdTech",
    status: "Live",
    year: "2026",
    oneLiner: "Course-sales site for a digital marketing training program.",
    description:
      "A conversion-focused landing page for a Hindi-medium digital marketing course — curriculum breakdown, mentor bio, student review wall, and an offer-comparison section, built to take a visitor from cold traffic to enrollment on one page.",
    stack: ["Next.js"],
    url: "https://devinedigitalacademy.co.in",
    highlights: ["Full curriculum + mentor section", "Review wall pulling real student feedback"],
  },
];
