export const GITHUB_USER = "Ananyaarora24";

// Single source of truth for identity/contact links, referenced by the
// header, hero footer, chat widgets, and the AI system prompt so they can
// never drift out of sync with each other.
export const PROFILE = {
  name: "Ananya Arora",
  tagline: "Software Engineer building AI-powered and cloud-native products",
  githubUrl: `https://github.com/${GITHUB_USER}`,
  linkedinUrl: "https://www.linkedin.com/in/ananyaaro/",
  email: "ananya.arora.tech@gmail.com",
  // No résumé file ships in the repo yet — see the implementation summary
  // for where to add public/resume.pdf.
  resumeUrl: "/resume.pdf",
};
