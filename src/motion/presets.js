// Small, shared motion vocabulary. Every animation in the app is composed
// from these presets so timing/easing stays consistent instead of each
// component inventing its own duration and curve.
//
// Reduced motion is handled centrally by <MotionConfig reducedMotion="user">
// in App.jsx, which strips transforms/layout animation for users with the
// OS-level "reduce motion" preference set — these presets don't need to
// duplicate that check.

// A gentle deceleration curve — quick start, soft landing. Used everywhere
// instead of a bouncy/springy feel, to stay "confident" rather than playful.
export const EASE = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.15,  // hover/tap feedback
  base: 0.25,  // reveals, panel motion
  slow: 0.4,   // hero entrance
};

// Hero: fades/slides up once on mount, children stagger in slightly.
export const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

export const heroItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE } },
};

// Section reveal: fades/slides up as it enters the viewport while scrolling.
export const sectionReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

export const sectionViewport = { once: true, amount: 0.2, margin: "0px 0px -60px 0px" };

// Staggered grids (project cards, etc).
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

// Buttons/chips/cards — a small lift + press, nothing bouncy.
export const hoverLift = {
  whileHover: { y: -2, transition: { duration: DURATION.fast, ease: EASE } },
  whileTap: { scale: 0.97, transition: { duration: DURATION.fast, ease: EASE } },
};

// Purely a press (no lift) — used for small icon buttons.
export const tapOnly = {
  whileTap: { scale: 0.93, transition: { duration: DURATION.fast, ease: EASE } },
};

// Image hover (e.g. LinkedIn post thumbnails) — subtle zoom, no rotation.
export const imageHover = {
  whileHover: { scale: 1.04, transition: { duration: DURATION.base, ease: EASE } },
};

// Case-study side panel + its backdrop.
export const panelSlide = {
  initial: { x: 24, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { x: 24, opacity: 0, transition: { duration: DURATION.fast, ease: EASE } },
};

export const backdropFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.base } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

// Portfolio <-> chat view crossfade.
export const viewTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: DURATION.fast, ease: EASE } },
};

// Chat message bubbles as they arrive.
export const messageIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};
