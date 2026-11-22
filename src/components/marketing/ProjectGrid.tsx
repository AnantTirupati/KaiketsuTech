import { KtRevealLink } from "@/components/marketing/kt/KtRevealLink";
import { statusLabel, type MarketingProject } from "@/lib/marketing-projects";

/** Thumbnail grid shared by the Work and Portfolio pages. */
export function ProjectGrid({ projects }: { projects: MarketingProject[] }) {
  return (
    <div className="kt-work-grid">
      {projects.map((project, i) => (
        <KtRevealLink key={project.slug} index={i} className="kt-work-card" href={`/showcase/${project.slug}`}>
          <div className="kt-work-thumb">
            {project.image ? (
              <img
                src={project.image}
                alt={project.imageAlt ?? `${project.name} homepage`}
                className="kt-work-thumb-img"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
            ) : (
              <div className="kt-u-halftone" aria-hidden="true" />
            )}
            <div className="kt-work-cap">
              <span
                className="kt-t-mono"
                style={{ display: "inline-block", marginBottom: 10, color: "var(--ink)" }}
              >
                {statusLabel(project)}
              </span>
              <h3 className="kt-t-h3">{project.name}</h3>
              <div className="kt-work-meta">
                <span className="kt-t-mono">{project.category}</span>
                <span className="kt-t-mono">{project.year}</span>
                <span className="kt-t-mono">{project.stack[0]}</span>
              </div>
            </div>
          </div>
        </KtRevealLink>
      ))}
    </div>
  );
}
