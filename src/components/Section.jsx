import { colors, font, type, space } from "../styles/tokens.js";

// Renders a real heading element (not a styled div) so the page has a
// proper document outline for screen readers and search engines, while
// keeping the existing small-caps mono label look.
export function SectionLabel({ children, as: Tag = "h2", id }) {
  return (
    <Tag
      id={id}
      style={{
        margin: 0, fontFamily: font.mono, fontSize: type.micro, fontWeight: 500, letterSpacing: 0.5,
        textTransform: "uppercase", color: colors.slateMuted, marginBottom: space.md,
      }}
    >
      {children}
    </Tag>
  );
}
