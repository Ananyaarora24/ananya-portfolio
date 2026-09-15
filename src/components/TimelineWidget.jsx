import { colors, font, type, space } from "../styles/tokens.js";
import { EXPERIENCE } from "../data/experience.js";

export function TimelineWidget() {
  return (
    <div style={{ marginTop: space.sm, display: "flex", flexDirection: "column", gap: 0 }}>
      {EXPERIENCE.map((e, i) => (
        <div key={e.role} style={{ display: "flex", gap: space.md }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.amber, marginTop: 6 }} />
            {i < EXPERIENCE.length - 1 && <div style={{ width: 1, flex: 1, background: colors.border, minHeight: 30 }} />}
          </div>
          <div style={{ paddingBottom: space.lg }}>
            <div style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal }}>{e.dates}</div>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: type.base, color: "white", marginTop: 2 }}>{e.role}</div>
            <div style={{ fontSize: type.small, color: colors.slateMuted }}>{e.org}</div>
            <div style={{ fontSize: type.small, color: colors.slate, marginTop: space.xs, lineHeight: 1.5 }}>{e.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
