import { motion } from "motion/react";
import { sectionReveal, sectionViewport } from "./presets.js";

// Wraps a section so it fades/slides up the first time it scrolls into
// view. Renders a plain div (no animation props) when `as` isn't needed —
// kept intentionally tiny since this is the only scroll-reveal behavior
// used across the page.
export function Reveal({ children, style, ...props }) {
  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
