import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";
import { colors, type, radius, space } from "../styles/tokens.js";
import { PROFILE } from "../data/profile.js";
import { hoverLift } from "../motion/presets.js";

export function LinksWidget() {
  const links = [
    { label: "GitHub", href: PROFILE.githubUrl, Icon: Github, external: true },
    { label: "LinkedIn", href: PROFILE.linkedinUrl, Icon: Linkedin, external: true },
    { label: "Email", href: `mailto:${PROFILE.email}`, Icon: Mail, external: false },
  ];
  return (
    <div style={{ display: "flex", gap: space.sm, marginTop: space.sm, flexWrap: "wrap" }}>
      {links.map(({ label, href, Icon, external }) => (
        <motion.a
          key={label}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          aria-label={external ? `${label} (opens in new tab)` : label}
          {...hoverLift}
          style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: type.body, color: colors.slate,
            background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: radius.md,
            padding: "8px 12px", textDecoration: "none",
          }}>
          <Icon size={14} color={colors.teal} aria-hidden="true" /> {label}
        </motion.a>
      ))}
    </div>
  );
}
