import { motion } from "motion/react";
import { Download } from "lucide-react";
import { colors, type, radius } from "../styles/tokens.js";
import { PROFILE } from "../data/profile.js";
import { hoverLift } from "../motion/presets.js";

export function ResumeCTA() {
  return (
    <motion.a
      href={PROFILE.resumeUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Download résumé (PDF, opens in new tab)"
      {...hoverLift}
      style={{
        display: "flex", alignItems: "center", gap: 6, fontSize: type.body, fontWeight: 500,
        color: colors.bg, background: colors.amber, border: `1px solid ${colors.amber}`,
        borderRadius: radius.md, padding: "7px 12px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
      }}
    >
      <Download size={13} aria-hidden="true" />
      <span className="resume-cta-label">Resume</span>
    </motion.a>
  );
}
