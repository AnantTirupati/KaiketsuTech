export type TeamLink = { label: string; href: string };

export type TeamMember = {
  slug: string;
  name: string;
  /** Position in the company, such as Founder & CEO. */
  role: string;
  /** Functional lead role, such as AI/ML Lead. */
  focus: string;
  bio: string;
  links: TeamLink[];
};

/** Leadership, in the order they are shown on the site. */
export const founders: TeamMember[] = [
  {
    slug: "anant-tirupati",
    name: "Anant Tirupati",
    role: "Founder & CEO",
    focus: "Fullstack & Operations Lead",
    bio: "Founder and CEO of KaiketsuTech. Leads fullstack development and operations. Main contributor to NutriSafe and author of the gym and restaurant sample sites in our portfolio.",
    links: [
      { label: "Portfolio", href: "https://portfolio-one-blond-30.vercel.app" },
      { label: "GitHub", href: "https://github.com/AnantTirupati" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ananttirupati/" },
    ],
  },
  {
    slug: "aakshant-kumar",
    name: "Aakshant Kumar",
    role: "Co-founder & VP",
    focus: "AI/ML Lead",
    bio: "Co-founder and VP of KaiketsuTech, and its AI/ML lead. Builds and ships the company's client sites, wrote the AI layer of NutriSafe, created the Narad web assistant, and is the sole author of the Nova preprint on Zenodo.",
    links: [
      { label: "Portfolio", href: "https://portfolio-psi-ten-kk79l9b7u8.vercel.app" },
      { label: "GitHub", href: "https://github.com/unexperiencedone" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/kumaraakshant" },
    ],
  },
  {
    slug: "mukesh-yadav",
    name: "Mukesh Yadav",
    role: "Co-founder & VP",
    focus: "Management & Hiring",
    bio: "Co-founder and VP of Management and Hiring at KaiketsuTech. Leads recruitment, intern cohorts and team operations.",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/mukesh-yadav-550971377/" }],
  },
];

export const ANANT = { name: "Anant Tirupati", role: "Founder & CEO", href: "https://github.com/AnantTirupati" };
export const AAKSHANT = { name: "Aakshant Kumar", role: "Co-founder & VP", href: "https://github.com/unexperiencedone" };
