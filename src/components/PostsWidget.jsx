import { motion } from "motion/react";
import { colors, font, type, radius, space } from "../styles/tokens.js";
import { POSTS } from "../data/posts.js";
import { hoverLift, imageHover } from "../motion/presets.js";

export function PostsWidget() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: space.sm, marginTop: space.sm }}>
      {POSTS.map((p) => (
        <motion.a
          key={p.title}
          href={p.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`${p.title} (opens in new tab)`}
          {...hoverLift}
          style={{
            display: "flex", gap: space.md, background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: radius.md,
            padding: space.lg, textDecoration: "none", overflow: "hidden",
          }}>
          {p.image && (
            // Decorative: the enclosing link already has a full aria-label
            // (post title) and the same title is visible as text right next
            // to this thumbnail, so a screen reader alt here would just
            // repeat it. alt="" is the correct WCAG treatment, not a gap.
            <motion.img
              src={p.image}
              alt=""
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              {...imageHover}
              style={{
                width: 64, height: 64, objectFit: "cover", borderRadius: radius.sm, flexShrink: 0,
                border: `1px solid ${colors.border}`,
              }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: space.sm }}>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: type.base, color: "white" }}>{p.title}</div>
              <div style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal, flexShrink: 0 }}>{p.date}</div>
            </div>
            <div style={{ fontSize: type.small, color: colors.slateMuted, marginTop: space.xs, lineHeight: 1.4 }}>{p.summary}</div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
