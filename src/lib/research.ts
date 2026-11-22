export type ResearchStatus = "Published" | "Preview";

export type ResearchPaper = {
  slug: string;
  /** Matches a project slug in marketing-projects.ts. */
  project: string;
  title: string;
  authors: string;
  affiliation: string;
  status: ResearchStatus;
  /** Shown on the card, e.g. "Preprint · v1 · 7 November 2026". */
  meta: string;
  abstract: string;
  findings: string[];
  keywords: string[];
  /** Present only for published work. */
  href?: string;
  doi?: string;
};

/**
 * Research by KaiketsuTech. Figures come from the papers' own abstracts.
 * AirGated's paper is a manuscript that has not been published or submitted,
 * so it is labelled as a preview and carries no link.
 */
export const researchPapers: ResearchPaper[] = [
  {
    slug: "nova-preprint",
    project: "nova",
    title:
      "Writing Itself Out of the Job: Design and Autobiographical Deployment of a Cost-Ordered, Self-Automating Desktop Voice Assistant",
    authors: "Aakshant Kumar",
    affiliation: "KaiketsuTech",
    status: "Published",
    meta: "Preprint · v1 · 7 November 2026 · Zenodo",
    abstract:
      "Language-model agents can now operate a personal computer, but an assistant that hands every request to such an agent costs as much on its three-hundredth day as on its first. The paper describes Nova, a voice-first assistant for one person's desktop, built around one rule: try the cheapest component that can possibly answer, and make the expensive one write itself out of the jobs it keeps being given. Requests fall through a cost-ordered cascade of intent matching, saved automations, a local fuzzy matcher, a free hosted model and finally subscription coding agents. When a kind of request repeats, the agent is asked to save it as an automation, which a static review checks and the owner approves before it can run.",
    findings: [
      "In a 30-day instrumented deployment, 70% of the owner's 185 requests never reached a paid model: 24% were answered by scripts and 46% by the free model alone.",
      "The subscription agents' usage came to US$22.39 at list price, and more than half of it (55%) was spent on the assistant's own scheduled background work rather than anything the owner asked for.",
      "The task distribution was long-tailed: 33 of 42 task types occurred once, and two of the five promotions triggered by repetition were artefacts of retries and scheduling.",
      "Three measurement errors that inflated the apparent savings are reported, with their effect sizes.",
      "A port from Windows to a GNOME desktop on Wayland is described, including a compositor extension that restores what Wayland withholds from applications.",
    ],
    keywords: ["cost-aware routing", "end-user automation", "voice assistant", "desktop agents"],
    href: "https://zenodo.org/records/24026001",
    doi: "10.5281/zenodo.24026001",
  },
  {
    slug: "airgated-manuscript",
    project: "airgated",
    title: "AirGated: A Prototype for Offline, Network-Bound Classroom Attendance with Device Keys and a Face-and-Blink Check",
    authors: "Aakshant Kumar",
    affiliation: "KaiketsuTech",
    status: "Preview",
    meta: "Manuscript · November 2026 · not yet published",
    abstract:
      "Attendance by roll call, QR code or GPS is defeated by cheap tricks: proxy answers, forwarded screenshots, spoofed coordinates. AirGated is a research prototype that runs with no cloud service. A host on the classroom network creates the Wi-Fi network and a captive portal, and marks a student present only if six gates pass on a single check-in: a fresh single-use server nonce; a server-measured round trip of at most 20 ms; a link-layer (MAC) address matching enrollment; an RSA signature from a non-extractable browser-held key; a blink liveness test with a face match against enrollment; and a limit of one roll number per MAC address in 60 seconds.",
    findings: [
      "Six independent gates, where the server rather than the phone measures proximity and makes every decision.",
      "The same code base runs on a Windows Mobile Hotspot and an Ubuntu laptop access point, with the operating-system-specific surface isolated to creating the access point, resolving an IP address to a MAC address, and the start order of the DNS responder.",
      "Field evidence is small and stated as such: an August test (3 of 3 check-ins accepted, mean round trip 5.5 ms) and a 30 September three-student trial with 17 logged events.",
      "A loopback load test shows the face engine, which analyses one clip at a time, limits throughput to about 30 check-ins per minute (29 measured) well before the latency gate is affected.",
      "A defect history from three development phases separates logic errors from ordering and environment errors.",
      "Proposes treating a changed MAC address as a re-registration trigger rather than a rejection when the device key and face still verify.",
    ],
    keywords: ["attendance", "captive portal", "device-bound keys", "liveness detection", "offline systems"],
  },
];

export const paperFor = (projectSlug: string) => researchPapers.find((p) => p.project === projectSlug);
