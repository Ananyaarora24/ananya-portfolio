import { colors, font, type, radius, space } from "../styles/tokens.js";

const ITEMS = [
  { label: "Software Engineer" },
  { label: "AI / Cloud / Full Stack" },
  { label: "Open to full-time opportunities", live: true },
];

// Concise, scannable status row so a recruiter gets role + focus +
// availability at a glance without reading the tagline paragraph or asking
// the AI assistant.
export function IdentityBar() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: space.sm, justifyContent: "center", marginBottom: space.lg }}>
      {ITEMS.map((item) => (
        <span key={item.label} style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontFamily: font.mono, fontSize: type.micro,
          color: item.live ? colors.teal : colors.slate,
          background: item.live ? "rgba(94,234,212,0.08)" : colors.bgCard,
          border: `1px solid ${colors.border}`, borderRadius: radius.pill, padding: "5px 12px",
        }}>
          {item.live && (
            <span className="pulse-dot" aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: colors.teal, display: "inline-block" }} />
          )}
          {item.label}
        </span>
      ))}
    </div>
  );
}
