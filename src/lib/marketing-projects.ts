import { AAKSHANT, ANANT } from "@/lib/team";

export type ProjectKind = "client" | "product" | "sample";
export type ProjectStatus = "Live" | "Prototype" | "Preprint" | "Sample";

export type ProjectCredit = { name: string; role: string; href: string };
export type ProjectLink = { label: string; href: string };

export type MarketingProject = {
  slug: string;
  name: string;
  kind: ProjectKind;
  category: string;
  status: ProjectStatus;
  year: string;
  oneLiner: string;
  description: string;
  stack: string[];
  /** Primary live address. */
  url?: string;
  /**
   * True when the deployment is currently unreachable. The listing stays, but
   * the live link is withheld until the site is restored.
   */
  paused?: boolean;
  image?: string;
  highlights: string[];
  /** Secondary links: source, research paper, and so on. */
  links?: ProjectLink[];
  /** Who worked on it, shown on the project page. */
  credits?: ProjectCredit[];
};

export const KIND_LABEL: Record<ProjectKind, string> = {
  client: "Client work",
  product: "Our products",
  sample: "Sample websites",
};

export const KIND_BLURB: Record<ProjectKind, string> = {
  client: "Sites and systems delivered for real businesses and institutions, running on their own domains.",
  product: "Software we design, build and run ourselves.",
  sample: "Demonstration builds that show the range of what we can design and deliver for your industry.",
};

export function statusLabel(project: Pick<MarketingProject, "status" | "paused">): string {
  if (project.paused) return "○ offline";
  switch (project.status) {
    case "Live":
      return "● live";
    case "Prototype":
      return "○ prototype";
    case "Preprint":
      return "● published";
    case "Sample":
      return "● sample build";
  }
}

const bothFounders: ProjectCredit[] = [
  { ...ANANT, role: ANANT.role },
  { ...AAKSHANT, role: AAKSHANT.role },
];

/**
 * Everything KaiketsuTech lists publicly. Real work only: each entry reflects
 * what is deployed at the linked address (checked against the Vercel account
 * and the live URL), or the project's own documentation. No invented metrics.
 */
export const marketingProjects: MarketingProject[] = [
  // ───────────────────────── Client work ─────────────────────────
  {
    slug: "riseup-public-school",
    name: "Rise UP Public School",
    kind: "client",
    category: "Education",
    status: "Live",
    year: "2026",
    oneLiner: "Full site for a CBSE school: admissions, academics and a parent portal.",
    description:
      "A multi-page site for an English-medium CBSE school in Bhadohi, Uttar Pradesh, covering admission enquiries and application tracking, an academic calendar and notices system, curriculum pages from Play Group through Class XII, a photo gallery, and a parent portal login.",
    stack: ["Next.js", "TypeScript"],
    url: "https://www.riseuppublicschool.com",
    image: "/riseup.png",
    highlights: [
      "Online admission enquiry and application tracking",
      "Notices, circulars and an academic calendar",
      "Parent portal login",
    ],
  },
  {
    slug: "made-to-adore",
    name: "Made to Adore",
    kind: "client",
    category: "E-commerce",
    status: "Live",
    year: "2026",
    oneLiner: "Online jewellery storefront with collections, occasion edits and international delivery.",
    description:
      "A jewellery store front end with a curated homepage, browsable collections by style and occasion, new arrivals, gifts and deals, wishlist and cart, clear delivery and returns information, and consent controls for cookies and advertising.",
    stack: ["Next.js"],
    url: "https://madetoadore.com",
    image: "/work/madetoadore.jpg",
    highlights: [
      "Collections by style and occasion",
      "Wishlist, cart and account area",
      "Delivery, returns and cookie consent built in",
    ],
  },
  {
    slug: "stylesutra",
    name: "StyleSutra",
    kind: "client",
    category: "E-commerce",
    status: "Live",
    year: "2026",
    oneLiner: "Shopify jewellery store with festive edits, promotions and WhatsApp support.",
    description:
      "An online jewellery store on Shopify: a branded homepage with rotating promotional banners, category browsing, new arrivals and a festive edit, search, account and cart, an announcement bar for new collections, and WhatsApp chat for customer questions.",
    stack: ["Shopify", "Liquid"],
    url: "https://stylesutra.co.in",
    image: "/work/stylesutra.jpg",
    highlights: ["Promotional banners and festive edits", "Category browsing, search and cart", "WhatsApp customer support"],
  },
  {
    slug: "bansal-travels",
    name: "Bansal Travels",
    kind: "client",
    category: "Travel",
    status: "Live",
    year: "2026",
    oneLiner: "Outstation cab and tour booking with route pages and fare estimates.",
    description:
      "A car-rental and tour-package site for a North India travel operator: fleet selection with per-km pricing, an FAQ covering fares, tolls and sightseeing inclusions, and a large set of route-specific landing pages built for local search.",
    stack: ["Next.js"],
    url: "https://www.bansaltravels.online",
    image: "/bansaltravels.png",
    highlights: ["Fleet and per-km fare display", "Route landing pages for local search"],
  },
  {
    slug: "robo-rumble",
    name: "Robo Rumble 3.0",
    kind: "client",
    category: "Events",
    status: "Live",
    year: "2026",
    oneLiner: "Registration site for CSJMU's annual robotics festival.",
    description:
      "The website for Robo Rumble 3.0, CSJMU's annual robotics festival: Robo Wars, RC flying, line following, esports and an innovation track, with a prize pool above ₹1,50,000. It handles registration across all of the festival's tracks.",
    stack: ["Next.js"],
    url: "https://roborumble.in",
    image: "/roborumble.png",
    highlights: ["Multi-track event registration", "Delivered for the live festival"],
    links: [{ label: "Source", href: "https://github.com/milliondreamsblog/Roborumble3.0" }],
    credits: bothFounders,
  },
  {
    slug: "devine-astro-talk",
    name: "Devine Astro-Talk",
    kind: "client",
    category: "Business",
    status: "Live",
    year: "2026",
    oneLiner: "Booking site for a Vedic astrology consultancy.",
    description:
      "A service and booking site for a Vedic astrology practice: product pages (numerology, match-making, Prashna Kundali), service pages (Kundli overview, palm reading, personal consultation), and one-tap WhatsApp booking on every page.",
    stack: ["Next.js"],
    url: "https://www.devine-astro-talk.com",
    paused: true,
    image: "/devine-astro.png",
    highlights: ["WhatsApp-first booking flow", "Structured product and service catalogue"],
  },
  {
    slug: "devine-digital-academy",
    name: "Devine Digital Academy",
    kind: "client",
    category: "EdTech",
    status: "Live",
    year: "2026",
    oneLiner: "Course-sales site for a digital marketing training programme.",
    description:
      "A conversion-focused landing page for a Hindi-medium digital marketing course: curriculum breakdown, mentor profile, student reviews and an offer comparison, designed to take a visitor from first click to enrolment on a single page.",
    stack: ["Next.js"],
    url: "https://devinedigitalacademy.co.in",
    paused: true,
    image: "/devine-academy.png",
    highlights: ["Full curriculum and mentor section", "Student review wall"],
  },

  // ───────────────────────── Our products ─────────────────────────
  {
    slug: "nutrisafe",
    name: "NutriSafe",
    kind: "product",
    category: "Health · AI",
    status: "Live",
    year: "2026",
    oneLiner: "Reads a food label or barcode and explains what that product means for your health condition.",
    description:
      "For people managing diabetes, high blood pressure or a food allergy. Scan a label or barcode and NutriSafe analyses it against the user's own condition. Includes sign-up, paid plans, diet plans and multi-language support. Retrieval and reasoning run on AWS Bedrock, with an allergy safety net and defined behaviour for cases where no reliable source is found.",
    stack: ["Next.js", "AWS Bedrock", "MongoDB", "NextAuth", "Razorpay", "Tailwind CSS"],
    url: "https://nutrisafe-rust.vercel.app",
    image: "/work/nutrisafe.jpg",
    highlights: [
      "Label and barcode scanning",
      "Allergy safety net and grounded answers",
      "Accounts, paid plans and usage limits",
    ],
    links: [{ label: "Source", href: "https://github.com/AnantTirupati/nutrisafe" }],
    credits: bothFounders,
  },
  {
    slug: "narad",
    name: "Narad",
    kind: "product",
    category: "Web assistant · Plugin",
    status: "Live",
    year: "2026",
    oneLiner: "A one-line plugin that guides every visitor to the right section of your website.",
    description:
      "Narad is added to a site with a single script tag. Visitors ask where something is, and it scrolls them to the right place, choosing only from the sections the site owner has configured, so it never invents answers. Ships as one small script with no framework dependency.",
    stack: ["TypeScript", "Vite", "Fuse.js", "LLM fallback"],
    url: "https://web-assistant-plugin.vercel.app",
    image: "/work/web-assistant.jpg",
    highlights: [
      "Installs with one script tag",
      "Answers limited to the site's own sections",
      "143 automated tests, 27 KB gzipped",
    ],
    credits: [{ ...AAKSHANT, role: AAKSHANT.role }],
  },
  {
    slug: "nova",
    name: "Nova",
    kind: "product",
    category: "Voice assistant · Research",
    status: "Preprint",
    year: "2026",
    oneLiner: "A voice assistant that automates desktop work, and the subject of our published engineering paper.",
    description:
      "Nova runs on the user's own computer and sends each spoken request down the cheapest path that can complete it: an instant command, a saved automation, a free model, and only then a paid one. Jobs it is asked repeatedly become automations that cost nothing to run. The system is described in a sole-author preprint on Zenodo, \u201cWriting Itself Out of the Job: Design and Autobiographical Deployment of a Cost-Ordered, Self-Automating Desktop Voice Assistant\u201d (DOI 10.5281/zenodo.24026001). In its 30-day deployment, 70% of 185 requests never reached a paid model.",
    stack: ["Python", "FastAPI", "faster-whisper", "ONNX Runtime", "SQLite", "Playwright", "React"],
    image: "/work/nova-paper.jpg",
    highlights: [
      "Engineering paper published on Zenodo",
      "Local speech-to-text, voice identification and voice",
      "1,165 automated tests",
    ],
    links: [
      { label: "Paper on Zenodo", href: "https://zenodo.org/records/24026001" },
      { label: "Source", href: "https://github.com/unexperiencedone/assistant-" },
    ],
    credits: [{ ...AAKSHANT, role: "Author" }],
  },
  {
    slug: "ai-presentation-generator",
    name: "AI Presentation Generator",
    kind: "product",
    category: "Productivity · AI",
    status: "Live",
    year: "2026",
    oneLiner: "Turns a short prompt into an editable slide deck, with outline, text, speaker notes and charts.",
    description:
      "Describe a topic and the app generates slide outlines, body text and speaker notes with language models, then lays them out on an editable slide canvas with chart visualisations and exports to PowerPoint. Includes sign-in and a credit-based free tier.",
    stack: ["React", "TypeScript", "Vite", "Firebase", "Clerk", "Recharts"],
    url: "https://ai-ppt-generator-seven.vercel.app",
    image: "/work/ai-presentation-generator.jpg",
    highlights: ["Prompt to full deck, with speaker notes", "Editable slide canvas and charts", "PowerPoint export"],
    links: [{ label: "Source", href: "https://github.com/AnantTirupati/AIpptGenerator" }],
    credits: [{ ...ANANT, role: ANANT.role }],
  },
  {
    slug: "normie",
    name: "Normie",
    kind: "product",
    category: "Database · AI",
    status: "Live",
    year: "2026",
    oneLiner: "A PostgreSQL copilot that designs, normalises and secures your database, and asks before it changes anything.",
    description:
      "Describe what you are building in plain English and Normie designs the schema, normalises it, writes the SQL and the database roles, and holds every change for your approval before it runs. Built for people who need a correct relational database without being database experts, and for DBMS students: each syllabus topic is mapped to where Normie uses it. The steps that decide correctness (closure, candidate keys, normal forms and SQL validation) are plain code, not model output.",
    stack: ["Python", "FastAPI", "PostgreSQL", "PydanticAI", "Next.js", "Docker"],
    url: "https://normie-db.duckdns.org",
    image: "/work/normie.jpg",
    highlights: [
      "Schema design, normalisation and role generation",
      "Every change held for approval before it runs",
      "Correctness checks written as code, with unit tests",
    ],
    links: [{ label: "Source", href: "https://github.com/unexperiencedone/normie" }],
    credits: [{ ...AAKSHANT, role: "Author" }],
  },
  {
    slug: "airgated",
    name: "AirGated",
    kind: "product",
    category: "Security · Research",
    status: "Prototype",
    year: "2026",
    oneLiner: "Offline classroom attendance that resists proxying, screenshots and GPS spoofing.",
    description:
      "Paper roll call invites proxy answers, QR and web logins can be forwarded as screenshots, and GPS geofencing can be spoofed. AirGated verifies attendance entirely on the classroom network, with no cloud and no GPS. A check-in is accepted only if six gates pass: a fresh single-use nonce, a server-measured round trip of at most 20 ms, a matching link-layer address, a signature from a non-extractable browser key, a blink liveness test with a face match, and a one-roll-number-per-device limit. It has been tried with real students and phones, and a research paper describing it is in preparation. It is a prototype and not yet a deployable classroom tool.",
    stack: ["Python", "FastAPI", "WebCrypto", "SQLite", "WebSockets", "OpenCV", "MediaPipe"],
    image: "/airgated.png",
    highlights: [
      "Six independent gates, all decided by the server",
      "Works with no internet, cloud service or app install",
      "Runs on Windows and Ubuntu hosts; research paper in preparation",
    ],
    links: [{ label: "Source", href: "https://github.com/unexperiencedone/airgated-" }],
  },

  // ───────────────────────── Sample websites ─────────────────────────
  {
    slug: "aurelia-hall-school",
    name: "Aurelia Hall School",
    kind: "sample",
    category: "Education",
    status: "Sample",
    year: "2026",
    oneLiner: "A school website with admissions, boarding, programmes and a parent login.",
    description:
      "A complete private-school site: mega-menu navigation covering admissions, academics, boarding and campus, a campus visit and enquiry flow, a parent login, an announcements bar, cookie consent and one-tap WhatsApp contact.",
    stack: ["Next.js", "TypeScript"],
    url: "https://school-sample-gilt.vercel.app",
    image: "/work/school-sample.jpg",
    highlights: ["Admissions and campus-visit flow", "Parent login and enquiry form", "WhatsApp contact"],
    links: [{ label: "Source", href: "https://github.com/unexperiencedone/school-sample" }],
    credits: [{ ...AAKSHANT, role: AAKSHANT.role }],
  },
  {
    slug: "latent-image-studio",
    name: "Latent Image Studio",
    kind: "sample",
    category: "Photography",
    status: "Sample",
    year: "2026",
    oneLiner: "A photography studio website built around the pictures, with booking and client galleries.",
    description:
      "A portfolio-first site for a portrait, wedding and commercial photographer: full-bleed imagery, services, private client galleries, a studio page, a journal and a session booking call to action. Built in plain HTML, CSS and JavaScript.",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://photostudio-beige.vercel.app",
    image: "/work/photostudio.jpg",
    highlights: ["Image-led portfolio", "Private client galleries", "Session booking"],
    links: [{ label: "Source", href: "https://github.com/unexperiencedone/photostudio" }],
    credits: [{ ...AAKSHANT, role: AAKSHANT.role }],
  },
  {
    slug: "fit-gym",
    name: "Fit Gym",
    kind: "sample",
    category: "Fitness",
    status: "Sample",
    year: "2026",
    oneLiner: "A gym website with programmes, class timetable, memberships and free-visit booking.",
    description:
      "A fitness-club site with programme and class pages, a timetable, membership plans and a free-visit booking flow, led by a full-screen hero and clear headline figures for classes, coaches and opening hours.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    url: "https://gym-test-vert.vercel.app",
    image: "/work/gym-test.jpg",
    highlights: ["Class timetable", "Membership plans", "Free-visit booking"],
    links: [{ label: "Source", href: "https://github.com/AnantTirupati/Gym-Management-system" }],
    credits: [{ ...ANANT, role: ANANT.role }],
  },
  {
    slug: "maison-ostrel",
    name: "Maison Ostrel",
    kind: "sample",
    category: "Restaurant",
    status: "Sample",
    year: "2026",
    oneLiner: "A fine-dining restaurant website with menu, story, gallery and table reservations.",
    description:
      "A restaurant site with an editorial hero, menu, the restaurant's story, a dining-experience page, gallery, contact details and a reserve-a-table call to action on every screen.",
    stack: ["Next.js", "TypeScript"],
    url: "https://test-restaurant-black.vercel.app",
    image: "/work/test-restaurant.jpg",
    highlights: ["Menu and gallery", "Table reservations", "Editorial typography"],
    links: [{ label: "Source", href: "https://github.com/AnantTirupati/TestRestaurant" }],
    credits: [{ ...ANANT, role: ANANT.role }],
  },
];

export const clientProjects = marketingProjects.filter((p) => p.kind === "client");
export const productProjects = marketingProjects.filter((p) => p.kind === "product");
export const sampleProjects = marketingProjects.filter((p) => p.kind === "sample");
