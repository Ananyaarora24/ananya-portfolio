import { motion } from "motion/react";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { colors, font, type, radius, space } from "../styles/tokens.js";
import { hoverLift, imageHover } from "../motion/presets.js";
import { ProjectVisual } from "./ProjectVisual.jsx";

// The strong, editorial treatment for the 4 highest-priority projects —
// deliberately distinct from the compact ProjectCard used for everything
// else, so "Featured Work" reads as real case studies rather than a list.
//
// Layout direction (stacked vs. side-by-side) is driven entirely by CSS
// classes + media queries (see App.jsx's global <style>), not inline
// styles, so `size="lg"` only goes horizontal on desktop and always stacks
// cleanly on mobile.
export function FeaturedProjectCard({ project, onOpen, size = "md" }) {
  const isLarge = size === "lg";
  const contribution = project.contribution?.slice(0, 2) ?? [];
  const stack = project.featuredStack?.length ? project.featuredStack : project.stack.slice(0, 5);

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
      className={`featured-card${isLarge ? " featured-card-lg" : ""}`}
      style={{
        gridColumn: isLarge ? "1 / -1" : undefined,
        display: "flex", flexDirection: "column",
        border: `1px solid ${colors.border}`, borderRadius: radius.md, background: colors.bgCard, overflow: "hidden",
      }}
    >
      <motion.button
        onClick={() => onOpen(project.name)}
        {...hoverLift}
        className="featured-card-main"
        style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <motion.div {...imageHover} className="project-visual">
          <ProjectVisual project={project} />
        </motion.div>

        <div style={{ padding: space.xl, display: "flex", flexDirection: "column", gap: space.sm, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: space.sm }}>
            <h3 style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: isLarge ? type.title : type.emphasis, color: "white" }}>{project.name}</h3>
            {project.date && <span style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.slateMuted, flexShrink: 0 }}>{project.date}</span>}
          </div>
          <div style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal }}>{project.tagline}</div>

          <p style={{ margin: 0, fontSize: type.base, color: colors.slate, lineHeight: 1.55 }}>{project.summary || project.desc}</p>

          {project.caseStudy?.problem && (
            <div style={{ fontSize: type.small, color: colors.slateMuted, lineHeight: 1.5 }}>
              <span style={{ fontFamily: font.mono, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>Problem — </span>
              {project.caseStudy.problem}
            </div>
          )}

          {contribution.length > 0 && (
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {contribution.map((c) => (
                <li key={c} style={{ fontSize: type.small, color: colors.slate, lineHeight: 1.5, display: "flex", gap: 6 }}>
                  <span style={{ color: colors.teal, flexShrink: 0 }} aria-hidden="true">›</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
            {stack.map((s) => (
              <span key={s} style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal, background: "rgba(94,234,212,0.08)", padding: "2px 8px", borderRadius: radius.sm }}>{s}</span>
            ))}
          </div>
        </div>
      </motion.button>

      <div className="featured-card-ctas" style={{ display: "flex", alignItems: "center", gap: space.lg, padding: `${space.md}px ${space.xl}px`, borderTop: `1px solid ${colors.border}` }}>
        <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.name} on GitHub (opens in new tab)`} className="cta-link" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: type.body, color: colors.slateMuted, textDecoration: "none" }}>
          <Github size={13} aria-hidden="true" /> GitHub
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`${project.name} live demo (opens in new tab)`} className="cta-link" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: type.body, color: colors.slateMuted, textDecoration: "none" }}>
            <ExternalLink size={13} aria-hidden="true" /> Demo
          </a>
        )}
        <button onClick={() => onOpen(project.name)} className="cta-link cta-arrow" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: type.body, color: colors.amber, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          Case Study <ArrowRight size={13} aria-hidden="true" className="cta-arrow-icon" />
        </button>
      </div>
    </motion.article>
  );
}
