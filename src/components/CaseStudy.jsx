import { motion } from "motion/react";
import { colors, font, type, space } from "../styles/tokens.js";
import { ArchDiagram } from "./ArchDiagram.jsx";
import { staggerContainer, staggerItem } from "../motion/presets.js";

function Block({ label, children }) {
  return (
    <motion.div variants={staggerItem}>
      <div style={{ fontFamily: font.mono, fontSize: type.micro, letterSpacing: 0.4, textTransform: "uppercase", color: colors.slateMuted, marginBottom: 4 }}>{label}</div>
      {children}
    </motion.div>
  );
}

function Text({ children }) {
  return <div style={{ fontSize: type.small, color: colors.slate, lineHeight: 1.55 }}>{children}</div>;
}

function BulletList({ items, markColor }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
      {items.map((item) => (
        <li key={item} style={{ fontSize: type.small, color: colors.slate, lineHeight: 1.5, display: "flex", gap: 7 }}>
          <span style={{ color: markColor, flexShrink: 0 }} aria-hidden="true">›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Renders the full case-study structure for a project's side panel:
// Overview → Problem → My Role → Engineering Challenge → Architecture →
// Key Decisions → Outcome → What I Learned. Every section is optional and
// only renders when the project's data actually has it — lightweight
// (non-featured) projects simply show fewer sections rather than padded
// placeholder text.
export function CaseStudy({ project }) {
  const cs = project?.caseStudy;
  if (!cs) return null;
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: space.lg }}>
      {cs.overview && (
        <Block label="Overview"><Text>{cs.overview}</Text></Block>
      )}
      <Block label="Problem"><Text>{cs.problem}</Text></Block>
      {project.contribution?.length > 0 && (
        <Block label="My Role"><BulletList items={project.contribution} markColor={colors.teal} /></Block>
      )}
      <Block label="Engineering Challenge"><Text>{cs.challenge}</Text></Block>
      {project.architecture && (
        <Block label="Architecture"><ArchDiagram architecture={project.architecture} /></Block>
      )}
      {cs.decisions?.length > 0 && (
        <Block label="Key Decisions"><BulletList items={cs.decisions} markColor={colors.amber} /></Block>
      )}
      <Block label="Outcome"><Text>{cs.outcome}</Text></Block>
      {cs.lessons && (
        <Block label="What I Learned"><Text>{cs.lessons}</Text></Block>
      )}
    </motion.div>
  );
}
