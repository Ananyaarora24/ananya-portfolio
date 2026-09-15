// Shared design tokens. Colors are sourced from the CSS custom properties
// defined once in src/index.css so there is a single source of truth shared
// between plain CSS and inline-styled components.
export const colors = {
  bg: "var(--color-bg)",
  bgCard: "var(--color-bg-card)",
  bgHover: "var(--color-bg-hover)",
  border: "var(--color-border)",
  amber: "var(--color-accent-amber)",
  teal: "var(--color-accent-teal)",
  slate: "var(--color-text)",
  slateMuted: "var(--color-text-muted)",
};

export const font = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Consolidated from ~11 near-duplicate pixel values (10, 10.5, 11, 11.5, 12,
// 12.5, 13, 13.5, 14, 14.5, 15...) down to one deliberate scale. Semantic
// names describe role, not size, so usage stays readable at call sites.
export const type = {
  micro: 11,   // mono meta/eyebrow text: dates, timestamps, arch-diagram steps
  small: 12,   // secondary text: taglines, card meta, muted captions
  body: 13,    // UI text: buttons, nav links, stack tags
  base: 14,    // primary reading text: chat bubbles, paragraphs, card titles
  emphasis: 15, // tagline, large-input text
  lead: 16,    // large chat input
  title: 20,   // side-panel project heading
  display: 32, // hero h1
};

export const radius = {
  sm: 6,    // small tags/chips (stack pill, skill tag, arch-diagram step)
  md: 10,   // cards, chat bubbles, bordered content blocks
  lg: 14,   // large interactive controls (large chat input, its send button)
  pill: 999, // fully-rounded pill badges/buttons
};

export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
};
