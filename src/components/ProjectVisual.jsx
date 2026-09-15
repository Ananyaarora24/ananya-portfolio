import { colors, font, type, radius, space } from "../styles/tokens.js";

// No project screenshots exist yet (see the Phase 3 report for what would
// improve each card). Rather than a fake UI mockup or a generic stock
// image, this builds a tasteful, code-editor-flavored placeholder purely
// from the project's own real data: its name, a fragment of its actual
// architecture, and its one-line technical signal.
export function ProjectVisual({ project }) {
  const firstLane = project.architecture?.lanes?.[0]?.steps ?? [];
  const fragment = firstLane.slice(0, 3);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", width: "100%",
      background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: radius.md,
      overflow: "hidden",
      backgroundImage: "radial-gradient(rgba(148,163,196,0.10) 1px, transparent 1px)",
      backgroundSize: "16px 16px",
    }}>
      {/* Editor-chrome header bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderBottom: `1px solid ${colors.border}`, background: "rgba(17,26,46,0.7)" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.border }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.border }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.teal }} />
        <span style={{ fontFamily: font.mono, fontSize: 10.5, color: colors.slateMuted, marginLeft: 6 }}>
          ~/{project.name.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>

      {/* Architecture fragment */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: space.sm, padding: space.lg }}>
        {fragment.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {fragment.map((step, i) => (
              <span key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontFamily: font.mono, fontSize: type.micro, color: colors.slate,
                  background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radius.sm, padding: "4px 8px",
                }}>{step}</span>
                {i < fragment.length - 1 && <span style={{ color: colors.amber }} aria-hidden="true">→</span>}
              </span>
            ))}
          </div>
        )}
        {project.technicalHighlight && (
          <div style={{ fontFamily: font.mono, fontSize: 11, color: colors.teal, lineHeight: 1.5 }}>
            <span style={{ color: colors.slateMuted }} aria-hidden="true">// </span>
            {project.technicalHighlight}
          </div>
        )}
      </div>
    </div>
  );
}
