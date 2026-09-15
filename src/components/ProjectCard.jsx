import { motion } from "motion/react";
import { colors, font, type, radius, space } from "../styles/tokens.js";
import { hoverLift, staggerContainer, staggerItem } from "../motion/presets.js";

export function ProjectCard({ project, onOpen }) {
  return (
    <motion.button
      onClick={() => onOpen(project.name)}
      {...hoverLift}
      style={{
        textAlign: "left", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: radius.md,
        padding: space.lg, cursor: "pointer", width: "100%",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: space.sm }}>
        {/* h4: nested under the "Additional Projects" h3 on the homepage grid (in chat, it's standalone reply content) */}
        <h4 style={{ margin: 0, fontFamily: font.display, fontWeight: 600, fontSize: type.base, color: "white" }}>{project.name}</h4>
        {project.date && <div style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.slateMuted, flexShrink: 0 }}>{project.date}</div>}
      </div>
      <div style={{ fontSize: type.small, color: colors.slateMuted, marginTop: space.xs, lineHeight: 1.4 }}>{project.tagline}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: space.xs, marginTop: space.sm }}>
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal, background: "rgba(94,234,212,0.08)", padding: "2px 7px", borderRadius: radius.sm }}>{s}</span>
        ))}
      </div>
    </motion.button>
  );
}

// Entrance-staggered grid — used both for the featured-projects homepage
// grid and the chat "projects" widget.
export function ProjectGrid({ projects, onOpen, columns = "repeat(auto-fit, minmax(220px, 1fr))", viewport }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      {...(viewport ? { whileInView: "visible", viewport } : { animate: "visible" })}
      style={{ display: "grid", gridTemplateColumns: columns, gap: space.md }}
    >
      {projects.map((p) => (
        <motion.div key={p.name} variants={staggerItem}>
          <ProjectCard project={p} onOpen={onOpen} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ProjectsWidget({ names, onOpen, projects }) {
  const items = projects.filter((p) => names.includes(p.name));
  if (!items.length) return null;
  return (
    <div style={{ marginTop: space.md }}>
      <ProjectGrid projects={items} onOpen={onOpen} columns={items.length > 1 ? "1fr 1fr" : "1fr"} />
    </div>
  );
}

export function ComparisonWidget({ names, onOpen, projects }) {
  const items = projects.filter((p) => names.includes(p.name));
  if (items.length < 2) return null;
  const rows = ["focus", "highlight", "stack"];
  const rowLabel = { focus: "Focus", highlight: "Highlight", stack: "Stack" };
  return (
    <div style={{ marginTop: space.md, border: `1px solid ${colors.border}`, borderRadius: radius.md, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${items.length}, 1fr)` }}>
        <div style={{ padding: space.md, background: colors.bg }} />
        {items.map((p) => (
          <motion.button
            key={p.name}
            onClick={() => onOpen(p.name)}
            {...hoverLift}
            style={{
              padding: space.md, background: colors.bg, border: "none", borderLeft: `1px solid ${colors.border}`,
              fontFamily: font.display, fontWeight: 600, fontSize: type.body, color: "white", cursor: "pointer", textAlign: "left",
            }}>{p.name}</motion.button>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row} style={{ display: "grid", gridTemplateColumns: `120px repeat(${items.length}, 1fr)`, borderTop: `1px solid ${colors.border}` }}>
          <div style={{ padding: space.md, fontSize: type.small, color: colors.slateMuted, background: colors.bgCard }}>{rowLabel[row]}</div>
          {items.map((p) => (
            <div key={p.name + row} style={{ padding: space.md, fontSize: type.small, color: colors.slate, borderLeft: `1px solid ${colors.border}`, background: colors.bgCard }}>
              {Array.isArray(p[row]) ? p[row].join(", ") : p[row]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
