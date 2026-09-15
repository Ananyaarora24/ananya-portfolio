import { motion } from "motion/react";
import { Github, Linkedin, Mail, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { colors, font, type, radius, space } from "../styles/tokens.js";
import { PROFILE } from "../data/profile.js";
import { ResumeCTA } from "./ResumeCTA.jsx";
import { tapOnly } from "../motion/presets.js";

const NAV_ITEMS = [
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Certifications", "certifications"],
  ["Leadership", "leadership"],
];

// Persistent across both portfolio and chat views (goal: recruiters never
// lose navigation, résumé access, or contact links behind the chat).
export function AppHeader({ view, hasMessages, syncStatus, projectCount, onGoHome, onGoChat }) {
  return (
    <div className="app-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${space.md}px ${space.xl}px`, borderBottom: `1px solid ${colors.border}`, flexShrink: 0, gap: space.lg }}>
      <button
        onClick={() => onGoHome()}
        aria-label={`${PROFILE.name} — go to portfolio home`}
        style={{ display: "flex", alignItems: "center", gap: space.sm, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
      >
        <Sparkles size={16} color={colors.amber} aria-hidden="true" />
        <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: type.emphasis, color: "white" }}>{PROFILE.name}</span>
      </button>

      <nav aria-label="Section navigation" className="nav-scroll app-nav" style={{ display: "flex", alignItems: "center", gap: space.lg, flexWrap: "nowrap", overflowX: "auto", minWidth: 0, scrollbarWidth: "none" }}>
        {view === "chat" && (
          <button onClick={() => onGoHome()} className="navlink back-link" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: type.body, fontWeight: 500, color: colors.teal, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", padding: "4px 2px" }}>
            <ArrowLeft size={13} aria-hidden="true" /> Back to portfolio
          </button>
        )}
        {NAV_ITEMS.map(([label, id]) => (
          <button key={id} onClick={() => onGoHome(id)} className="navlink" style={{ fontSize: type.body, color: colors.slateMuted, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", padding: "4px 2px" }}>
            {label}
          </button>
        ))}
        <button onClick={onGoChat} className="navlink" style={{ fontSize: type.body, color: colors.slateMuted, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", padding: "4px 2px" }}>
          {hasMessages ? "Resume chat" : "Chat"}
        </button>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: space.sm, flexShrink: 0 }}>
        {syncStatus === "syncing" && (
          <span className="sync-status" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: type.micro, color: colors.slateMuted }}>
            <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Syncing GitHub…
          </span>
        )}
        {syncStatus === "synced" && (
          <span className="sync-status" style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal }}>
            {projectCount} projects · live from GitHub
          </span>
        )}
        {syncStatus === "fallback" && (
          <span className="sync-status" style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.amber }}>
            GitHub sync unavailable · showing cached projects
          </span>
        )}
        <ResumeCTA />
        <motion.a href={PROFILE.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile (opens in new tab)" className="icon-link" {...tapOnly} style={{ color: colors.slateMuted, display: "flex", padding: space.sm, margin: `-${space.sm}px 0`, borderRadius: radius.sm }}>
          <Github size={17} aria-hidden="true" />
        </motion.a>
        <motion.a href={PROFILE.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile (opens in new tab)" className="icon-link" {...tapOnly} style={{ color: colors.slateMuted, display: "flex", padding: space.sm, margin: `-${space.sm}px 0`, borderRadius: radius.sm }}>
          <Linkedin size={17} aria-hidden="true" />
        </motion.a>
        <motion.a href={`mailto:${PROFILE.email}`} aria-label="Send email to Ananya Arora" className="icon-link" {...tapOnly} style={{ color: colors.slateMuted, display: "flex", padding: space.sm, margin: `-${space.sm}px 0`, borderRadius: radius.sm }}>
          <Mail size={17} aria-hidden="true" />
        </motion.a>
      </div>
    </div>
  );
}
