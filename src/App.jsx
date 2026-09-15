import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { X, ExternalLink, Loader2, Mail, Linkedin, Github, AlertCircle, Download } from "lucide-react";
import { colors, font, type, radius, space } from "./styles/tokens.js";
import { PROFILE } from "./data/profile.js";
import { SKILL_GROUPS } from "./data/skills.js";
import { EDUCATION, CERTIFICATIONS } from "./data/education.js";
import { LEADERSHIP } from "./data/experience.js";
import { FALLBACK_PROJECTS, FEATURED_NAMES, fetchGithubProjects } from "./data/projects.js";
import { buildSystemPrompt, normalizeChatText, STARTERS } from "./lib/chat.js";
import { AppHeader } from "./components/AppHeader.jsx";
import { IdentityBar } from "./components/IdentityBar.jsx";
import { SectionLabel } from "./components/Section.jsx";
import { ChatInput } from "./components/ChatInput.jsx";
import { ProjectGrid, ProjectsWidget, ComparisonWidget } from "./components/ProjectCard.jsx";
import { FeaturedProjectCard } from "./components/FeaturedProjectCard.jsx";
import { CaseStudy } from "./components/CaseStudy.jsx";
import { TimelineWidget } from "./components/TimelineWidget.jsx";
import { LinksWidget } from "./components/LinksWidget.jsx";
import { PostsWidget } from "./components/PostsWidget.jsx";
import { Reveal } from "./motion/Reveal.jsx";
import { heroContainer, heroItem, staggerContainer, sectionViewport, hoverLift, tapOnly, panelSlide, backdropFade, viewTransition, messageIn } from "./motion/presets.js";

// Consistent gap between major homepage sections — replaces four slightly
// different ad-hoc values (44/44/44/48) that had drifted apart.
const SECTION_GAP = space.xxxl;

export default function Portfolio() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidePanel, setSidePanel] = useState(null);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [syncStatus, setSyncStatus] = useState("syncing");
  // Decoupled from `messages` on purpose: switching to the portfolio view
  // must never clear chat history (see AppHeader "Back to portfolio").
  const [view, setView] = useState("home");
  const [pendingScroll, setPendingScroll] = useState(null);
  const scrollRef = useRef(null);
  const heroScrollRef = useRef(null);

  useEffect(() => {
    if (view === "chat" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, view]);

  useEffect(() => {
    if (view !== "home" || !pendingScroll) return;
    const id = requestAnimationFrame(() => {
      if (pendingScroll === "__top__") {
        heroScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(pendingScroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setPendingScroll(null);
    });
    return () => cancelAnimationFrame(id);
  }, [view, pendingScroll]);

  useEffect(() => {
    let cancelled = false;
    fetchGithubProjects()
      .then((live) => {
        if (cancelled || !live.length) return;
        setProjects(live);
        setSyncStatus("synced");
      })
      .catch(() => {
        if (!cancelled) setSyncStatus("fallback");
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!sidePanel) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setSidePanel(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidePanel]);

  function goHome(id) {
    setView("home");
    setPendingScroll(id || "__top__");
  }

  function goChat() {
    if (messages.length > 0) setView("chat");
    else goHome("chat");
  }

  async function send(text) {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user", content: q }];
    setMessages(next);
    setView("chat");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(projects),
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", isError: true, content: data.error || "Something went wrong on my end — please try again, or use the Resume / Email links above.", widget: null }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: normalizeChatText(data.reply), widget: data.widget }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", isError: true, content: "Couldn't reach the assistant just now — please try again, or use the Resume / Email links above.", widget: null }]);
    } finally {
      setLoading(false);
    }
  }

  const panelProject = sidePanel ? projects.find((p) => p.name === sidePanel) : null;
  // Ordered by FEATURED_NAMES (Ananya's requested priority), not by sync
  // recency, so the featured order stays stable whether or not GitHub sync
  // has landed yet.
  const featuredProjects = FEATURED_NAMES.map((name) => projects.find((p) => p.name === name)).filter(Boolean);
  const additionalProjects = projects.filter((p) => !FEATURED_NAMES.includes(p.name));

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ background: colors.bg, height: "100vh", display: "flex", fontFamily: font.body, overflow: "hidden" }}>
        <style>{`
          ::placeholder { color: ${colors.slateMuted}; }
          .chip:hover { background: ${colors.bgHover} !important; }
          .icon-link:hover { background: ${colors.bgHover} !important; }
          .navlink { transition: color 0.15s; }
          .navlink:hover { color: white !important; }
          .back-link:hover { opacity: 0.8; }
          .nav-scroll::-webkit-scrollbar { display: none; }
          .pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
          @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

          /* Featured Work grid — 2-up on desktop, "lg" cards span the full
             row; a lg card's visual sits beside its text on wide screens
             and stacks above it everywhere narrower, so it never gets
             overly tall on mobile. */
          .featured-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: ${space.xl}px; }
          .featured-card-main { display: flex; flex-direction: column; }
          .featured-card-ctas { flex-direction: row; }
          .project-visual { min-height: 150px; }
          .featured-card-lg .project-visual { min-height: 190px; }
          @media (min-width: 860px) {
            .featured-card-lg { flex-direction: row !important; }
            .featured-card-lg .featured-card-main { flex: 1 1 auto; flex-direction: row !important; align-items: stretch; min-width: 0; }
            .featured-card-lg .project-visual { flex: 0 0 42%; min-height: auto; }
            .featured-card-lg .featured-card-ctas { flex-direction: column !important; justify-content: center; border-top: none !important; border-left: 1px solid ${colors.border}; }
          }
          @media (max-width: 720px) {
            .featured-grid { grid-template-columns: 1fr; }
          }
          .cta-link:hover { color: white !important; }
          .cta-arrow-icon { transition: transform 0.15s ease; }
          .cta-arrow:hover .cta-arrow-icon { transform: translateX(3px); }

          /* Architecture diagram: horizontal chain on desktop, stacks to a
             vertical flow (arrow rotated to point down) on narrow screens. */
          .arch-arrow { transition: transform 0.15s ease; }
          @media (max-width: 480px) {
            .arch-lane { flex-direction: column !important; align-items: flex-start !important; }
            .arch-arrow { transform: rotate(90deg); margin-left: 4px; }
          }

          @media (max-width: 720px) {
            .sync-status { display: none !important; }
          }
          @media (max-width: 1200px) {
            .app-header { flex-wrap: wrap; row-gap: ${space.sm}px; }
            .app-nav { order: 3; flex-basis: 100%; width: 100%; }
          }
          @media (max-width: 480px) {
            .resume-cta-label { display: none !important; }
            .app-header { padding-left: ${space.lg}px !important; padding-right: ${space.lg}px !important; }
            .hero-scroll, .chat-scroll, .chat-input-bar { padding-left: ${space.lg}px !important; padding-right: ${space.lg}px !important; }
            .side-panel { padding: ${space.lg}px !important; }
          }
          @media (max-width: 860px) {
            .side-panel { position: fixed !important; inset: 0 !important; width: 100% !important; z-index: 50; }
            .side-panel-backdrop { display: block !important; }
          }
        `}</style>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <AppHeader
            view={view}
            hasMessages={messages.length > 0}
            syncStatus={syncStatus}
            projectCount={projects.length}
            onGoHome={goHome}
            onGoChat={goChat}
          />

          <AnimatePresence mode="wait">
            {view === "home" ? (
              <motion.div key="home" {...viewTransition} ref={heroScrollRef} className="hero-scroll" style={{ flex: 1, overflowY: "auto", padding: `${space.xxxl}px ${space.xl}px ${space.huge}px` }}>
                <div style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}>
                  {/* Agent hero */}
                  <motion.div variants={heroContainer} initial="hidden" animate="visible" style={{ textAlign: "center", marginBottom: SECTION_GAP, paddingTop: space.sm }}>
                    <motion.div variants={heroItem} style={{
                      display: "inline-flex", alignItems: "center", gap: 7, fontFamily: font.mono,
                      fontSize: type.micro, color: colors.teal, background: "rgba(94,234,212,0.08)", border: `1px solid ${colors.border}`,
                      borderRadius: radius.pill, padding: "5px 12px", marginBottom: space.lg,
                    }}>
                      <span className="pulse-dot" aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: colors.teal, display: "inline-block" }} />
                      AI agent online · ask me anything
                    </motion.div>
                    <motion.h1 variants={heroItem} style={{ fontFamily: font.display, fontWeight: 700, fontSize: type.display, color: "white", marginBottom: space.sm }}>
                      {PROFILE.name}
                    </motion.h1>
                    <motion.p variants={heroItem} style={{ color: colors.teal, fontSize: type.emphasis, fontFamily: font.display, fontWeight: 600, marginBottom: space.lg }}>
                      {PROFILE.tagline}
                    </motion.p>

                    <motion.div variants={heroItem}>
                      <IdentityBar />
                    </motion.div>

                    <motion.div variants={heroItem} id="chat" style={{ maxWidth: 620, margin: "0 auto" }}>
                      <ChatInput
                        onSend={send} loading={loading}
                        large
                        placeholder="Ask about her projects, skills, or experience…"
                      />
                      <div style={{ display: "flex", flexWrap: "wrap", gap: space.sm, marginTop: space.md, justifyContent: "center" }}>
                        {STARTERS.map((s) => (
                          <motion.button key={s} className="chip" onClick={() => send(s)} {...hoverLift} style={{
                            fontSize: type.body, color: colors.slate, background: colors.bgCard, border: `1px solid ${colors.border}`,
                            borderRadius: radius.pill, padding: "7px 13px", cursor: "pointer",
                          }}>{s}</motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={heroItem} style={{ display: "flex", gap: space.lg, justifyContent: "center", marginTop: space.xl, flexWrap: "wrap", alignItems: "center" }}>
                      <a href="#skills" onClick={(e) => { e.preventDefault(); goHome("skills"); }} className="navlink" style={{ fontSize: type.body, color: colors.slateMuted, textDecoration: "underline" }}>
                        Or browse her work below ↓
                      </a>
                      <span style={{ color: colors.border }} aria-hidden="true">·</span>
                      <a href={`mailto:${PROFILE.email}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: type.body, color: colors.slateMuted, textDecoration: "none" }}><Mail size={12} aria-hidden="true" /> Email</a>
                      <a href={PROFILE.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in new tab)" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: type.body, color: colors.slateMuted, textDecoration: "none" }}><Linkedin size={12} aria-hidden="true" /> LinkedIn</a>
                      <a href={PROFILE.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub (opens in new tab)" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: type.body, color: colors.slateMuted, textDecoration: "none" }}><Github size={12} aria-hidden="true" /> GitHub</a>
                    </motion.div>
                  </motion.div>

                  {/* Skills */}
                  <Reveal id="skills" style={{ marginBottom: SECTION_GAP }}>
                    <SectionLabel>Skills</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: space.sm }}>
                      {SKILL_GROUPS.map((g) => (
                        <div key={g.label} style={{ display: "flex", alignItems: "baseline", gap: space.md, flexWrap: "wrap" }}>
                          <div style={{ fontSize: type.small, color: colors.slateMuted, width: 88, flexShrink: 0 }}>{g.label}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: space.sm }}>
                            {g.items.map((s) => (
                              <span key={s} style={{
                                fontFamily: font.mono, fontSize: type.body, color: colors.teal,
                                background: "rgba(94,234,212,0.08)", border: `1px solid ${colors.border}`, padding: "5px 10px", borderRadius: radius.sm,
                              }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Reveal>

                  {/* Featured work */}
                  <div id="projects" style={{ marginBottom: SECTION_GAP }}>
                    <SectionLabel>Featured Work</SectionLabel>
                    <motion.div
                      variants={staggerContainer} initial="hidden" whileInView="visible" viewport={sectionViewport}
                      className="featured-grid"
                    >
                      {featuredProjects.map((p, i) => (
                        <FeaturedProjectCard key={p.name} project={p} onOpen={setSidePanel} size={i < 2 ? "lg" : "md"} />
                      ))}
                    </motion.div>

                    {additionalProjects.length > 0 && (
                      <div style={{ marginTop: SECTION_GAP }}>
                        <SectionLabel as="h3">Additional Projects</SectionLabel>
                        <ProjectGrid projects={additionalProjects} onOpen={setSidePanel} viewport={sectionViewport} />
                      </div>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: space.sm, marginTop: space.md, alignItems: "center" }}>
                      <button className="chip" onClick={() => send("Show me all her projects")} style={{
                        fontSize: type.body, color: colors.slateMuted, background: "none", border: "none",
                        cursor: "pointer", padding: 0, textDecoration: "underline",
                      }}>See all {projects.length} projects →</button>
                      <span style={{ fontSize: type.small, color: colors.slateMuted }}>· click a project, or ask the AI, for the full engineering story</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <Reveal id="experience" style={{ marginBottom: SECTION_GAP }}>
                    <SectionLabel>Experience</SectionLabel>
                    <TimelineWidget />
                  </Reveal>

                  {/* Certifications + Education */}
                  <Reveal id="certifications" style={{ marginBottom: SECTION_GAP, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: space.xl }}>
                    <div>
                      <SectionLabel>Certifications</SectionLabel>
                      {CERTIFICATIONS.map((c) => (
                        <div key={c.name} style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: space.lg }}>
                          {c.url ? (
                            <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} (opens in new tab)`} style={{ fontFamily: font.display, fontWeight: 600, fontSize: type.base, color: "white", textDecoration: "none" }}>
                              {c.name}
                            </a>
                          ) : (
                            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: type.base, color: "white" }}>{c.name}</div>
                          )}
                          <div style={{ fontSize: type.small, color: colors.slateMuted, marginTop: 3 }}>{c.org} · {c.date}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <SectionLabel id="education">Education</SectionLabel>
                      <div style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: space.lg }}>
                        <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: type.base, color: "white" }}>{EDUCATION.school}</div>
                        <div style={{ fontSize: type.small, color: colors.slateMuted, marginTop: 3 }}>{EDUCATION.degree} · {EDUCATION.location}</div>
                        <div style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal, marginTop: space.xs }}>{EDUCATION.dates} · {EDUCATION.gpa}</div>
                      </div>
                    </div>
                  </Reveal>

                  {/* Leadership */}
                  <Reveal id="leadership" style={{ marginBottom: SECTION_GAP }}>
                    <SectionLabel>Leadership</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: space.sm }}>
                      {LEADERSHIP.map((l) => (
                        <div key={l.role} style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: space.lg }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: space.sm }}>
                            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: type.base, color: "white" }}>{l.role}</div>
                            <div style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal }}>{l.dates}</div>
                          </div>
                          <div style={{ fontSize: type.small, color: colors.slateMuted, marginTop: 2 }}>{l.org}</div>
                          <div style={{ fontSize: type.small, color: colors.slate, marginTop: space.xs, lineHeight: 1.5 }}>{l.desc}</div>
                        </div>
                      ))}
                    </div>
                  </Reveal>

                  {/* Recruiter contact CTA */}
                  <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: space.xl, textAlign: "center" }}>
                    <SectionLabel>Interested in working together?</SectionLabel>
                    <p style={{ fontSize: type.small, color: colors.slateMuted, maxWidth: 440, margin: "0 auto", marginBottom: space.lg, lineHeight: 1.5 }}>
                      Open to full-time Software Engineering, AI, and Cloud roles.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: space.sm, justifyContent: "center" }}>
                      <motion.a href={`mailto:${PROFILE.email}`} className="cta-link" {...hoverLift} style={{
                        display: "flex", alignItems: "center", gap: 6, fontSize: type.body, color: colors.slate,
                        background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "8px 14px", textDecoration: "none",
                      }}><Mail size={14} aria-hidden="true" /> Email</motion.a>
                      <motion.a href={PROFILE.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in new tab)" className="cta-link" {...hoverLift} style={{
                        display: "flex", alignItems: "center", gap: 6, fontSize: type.body, color: colors.slate,
                        background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: radius.md, padding: "8px 14px", textDecoration: "none",
                      }}><Linkedin size={14} aria-hidden="true" /> LinkedIn</motion.a>
                      <motion.a href={PROFILE.resumeUrl} target="_blank" rel="noreferrer" aria-label="Download résumé (PDF, opens in new tab)" {...hoverLift} style={{
                        display: "flex", alignItems: "center", gap: 6, fontSize: type.body, color: colors.bg,
                        background: colors.amber, border: `1px solid ${colors.amber}`, borderRadius: radius.md, padding: "8px 14px", textDecoration: "none",
                      }}><Download size={14} aria-hidden="true" /> Resume</motion.a>
                    </div>
                    <button className="chip" onClick={() => goHome("__top__")} style={{
                      marginTop: space.xl, fontSize: type.small, color: colors.slateMuted, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline",
                    }}>↑ Or ask the AI agent at the top</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="chat" {...viewTransition} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <div ref={scrollRef} role="log" aria-live="polite" aria-relevant="additions" className="chat-scroll" style={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden", padding: space.xl }}>
                  <div style={{ maxWidth: 680, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: space.lg, boxSizing: "border-box" }}>
                    {messages.map((m, i) => (
                      <motion.div key={i} {...messageIn} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", minWidth: 0 }}>
                        <div style={{
                          display: "flex", alignItems: "flex-start", gap: 8,
                          maxWidth: "85%", background: m.role === "user" ? colors.amber : colors.bgCard,
                          color: m.role === "user" ? colors.bg : colors.slate,
                          padding: "10px 16px", borderRadius: radius.md, fontSize: type.base, lineHeight: 1.6, whiteSpace: "pre-wrap",
                          overflowWrap: "break-word", wordBreak: "break-word",
                          border: m.isError ? `1px solid ${colors.amber}` : "none",
                        }}>
                          {m.isError && <AlertCircle size={15} color={colors.amber} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />}
                          <span>{m.content}</span>
                        </div>
                        {m.role === "assistant" && m.widget?.type === "projects" && (
                          <div style={{ width: "85%" }}><ProjectsWidget names={m.widget.names} onOpen={setSidePanel} projects={projects} /></div>
                        )}
                        {m.role === "assistant" && m.widget?.type === "comparison" && (
                          <div style={{ width: "85%" }}><ComparisonWidget names={m.widget.names} onOpen={setSidePanel} projects={projects} /></div>
                        )}
                        {m.role === "assistant" && m.widget?.type === "timeline" && (
                          <div style={{ width: "85%" }}><TimelineWidget /></div>
                        )}
                        {m.role === "assistant" && m.widget?.type === "links" && (
                          <div style={{ width: "85%" }}><LinksWidget /></div>
                        )}
                        {m.role === "assistant" && m.widget?.type === "posts" && (
                          <div style={{ width: "85%" }}><PostsWidget /></div>
                        )}
                      </motion.div>
                    ))}
                    {loading && (
                      <div role="status" aria-label="Assistant is typing">
                        <Loader2 size={16} className="animate-spin" color={colors.teal} aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="chat-input-bar" style={{ padding: `${space.lg}px ${space.xl}px ${space.xl}px` }}>
                  <div style={{ maxWidth: 680, margin: "0 auto" }}>
                    <ChatInput onSend={send} loading={loading} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {panelProject && (
            <>
              <motion.div key="backdrop" className="side-panel-backdrop" onClick={() => setSidePanel(null)} {...backdropFade} style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
              <motion.div key="panel" className="side-panel" role="dialog" aria-modal="true" aria-label={`${panelProject.name} project details`} {...panelSlide} style={{ width: 340, borderLeft: `1px solid ${colors.border}`, background: colors.bgCard, padding: space.xl, overflowY: "auto", flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal }}>{panelProject.focus}</span>
                  <motion.button onClick={() => setSidePanel(null)} aria-label="Close project details" {...tapOnly} style={{ background: "none", border: "none", color: colors.slateMuted, cursor: "pointer", padding: space.sm, margin: -space.sm }}><X size={18} aria-hidden="true" /></motion.button>
                </div>
                <h2 style={{ fontFamily: font.display, fontWeight: 700, fontSize: type.title, color: "white", marginTop: space.sm }}>{panelProject.name}</h2>
                <p style={{ fontSize: type.base, color: colors.slate, lineHeight: 1.6, marginTop: space.md }}>{panelProject.summary || panelProject.desc}</p>
                <div style={{ marginTop: space.lg }}>
                  <div style={{ fontSize: type.small, color: colors.slateMuted, marginBottom: space.xs }}>Stack</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: space.xs }}>
                    {panelProject.stack.map((s) => (
                      <span key={s} style={{ fontFamily: font.mono, fontSize: type.micro, color: colors.teal, background: "rgba(94,234,212,0.08)", padding: "3px 8px", borderRadius: radius.sm }}>{s}</span>
                    ))}
                  </div>
                </div>
                {panelProject.caseStudy && (
                  <div style={{ marginTop: space.xl, borderTop: `1px solid ${colors.border}`, paddingTop: space.lg }}>
                    <CaseStudy project={panelProject} />
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: space.lg, marginTop: space.xl }}>
                  <a href={panelProject.link || panelProject.github} target="_blank" rel="noreferrer" aria-label={`View ${panelProject.name} on GitHub (opens in new tab)`} style={{
                    display: "inline-flex", alignItems: "center", gap: 6, fontSize: type.body, color: colors.amber, textDecoration: "none",
                  }}>
                    View on GitHub <ExternalLink size={13} aria-hidden="true" />
                  </a>
                  {panelProject.demo && (
                    <a href={panelProject.demo} target="_blank" rel="noreferrer" aria-label={`${panelProject.name} live demo (opens in new tab)`} style={{
                      display: "inline-flex", alignItems: "center", gap: 6, fontSize: type.body, color: colors.teal, textDecoration: "none",
                    }}>
                      Live Demo <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
