import type { Metadata } from "next";
import Reveal from "@/components/marketing/Reveal";
import MagneticButton from "@/components/marketing/MagneticButton";
import KineticText from "@/components/marketing/KineticText";

export const metadata: Metadata = {
  title: "About | KaiketsuTech",
  description: "KaiketsuTech is a crew of student developers who build real client work together.",
};

export default function AboutPage() {
  return (
    <>
      <section className="px-[6vw] pb-[8vh] pt-[12vh]">
        <Reveal>
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            About
          </div>
          <KineticText
            as="h1"
            className="max-w-[18ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]"
            text="解決 — kaiketsu, “solution.”"
          />
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-marketing-muted">
            KaiketsuTech started as a handful of friends who kept getting asked to build things —
            school websites, event registration pages, booking systems — and realized we&rsquo;d
            rather do it as a crew than one-off freelance gigs. The name is literal: kaiketsu is the
            Japanese word for &ldquo;solution.&rdquo; That&rsquo;s the whole job description.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <Reveal className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
              How we&rsquo;re structured
            </h2>
            <p className="text-[17px] leading-relaxed text-marketing-fg/90">
              Two things happen under one roof. Client work — real sites and systems for real
              businesses and institutions, built and shipped by the crew. And crew-building — we
              scout student developers who can already ship, bring them in, and grow the team as the
              work grows.
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
              What funds what
            </h2>
            <p className="text-[17px] leading-relaxed text-marketing-fg/90">
              Client work isn&rsquo;t a side hustle to our own ideas — it&rsquo;s the funding model
              for them. Revenue from shipping other people&rsquo;s products is what lets us spend
              time on research work, and on bringing on more student developers as interns rather
              than treating the crew as fixed.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <Reveal>
          <h2 className="mb-4 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            The crew
          </h2>
          <p className="max-w-[56ch] text-[17px] leading-relaxed text-marketing-fg/90">
            Team profiles are going up here as the crew signs off on photos and bios — this section
            is intentionally not filled with placeholder headshots. Check the{" "}
            <a href="/careers" className="text-marketing-accent hover:underline">
              careers page
            </a>{" "}
            if you want to be one of the names that lands here.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[10vh]">
        <Reveal>
          <h2 className="max-w-[18ch] font-marketing-sans text-[clamp(28px,4.5vw,48px)] font-bold">
            Want to work with us, or work here?
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton href="/contact">Start a project</MagneticButton>
            <MagneticButton href="/careers" variant="outline">
              Join the crew
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
