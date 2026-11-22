export type TeamLink = { label: string; href: string };

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  links: TeamLink[];
};

/** Founders, in the order they are shown on the site. */
export const founders: TeamMember[] = [
  {
    slug: "anant-tirupati",
    name: "Anant Tirupati",
    role: "Founder & CEO",
    bio: "Founder and CEO of KaiketsuTech. Main contributor to NutriSafe and author of the gym and restaurant sample sites in our portfolio.",
    links: [
      { label: "Portfolio", href: "https://portfolio-one-blond-30.vercel.app" },
      { label: "GitHub", href: "https://github.com/AnantTirupati" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ananttirupati/" },
    ],
  },
  {
    slug: "aakshant-kumar",
    name: "Aakshant Kumar",
    role: "Co-founder & VP Tech",
    bio: "Co-founded KaiketsuTech and leads engineering and AI. Builds and ships the company's client sites, wrote the AI layer of NutriSafe, created the Narad web assistant, and is the sole author of the Nova preprint on Zenodo.",
    links: [
      { label: "Portfolio", href: "https://portfolio-psi-ten-kk79l9b7u8.vercel.app" },
      { label: "GitHub", href: "https://github.com/unexperiencedone" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/kumaraakshant" },
    ],
  },
];

export const ANANT = { name: "Anant Tirupati", role: "Founder & CEO", href: "https://github.com/AnantTirupati" };
export const AAKSHANT = { name: "Aakshant Kumar", role: "Co-founder & VP Tech", href: "https://github.com/unexperiencedone" };
