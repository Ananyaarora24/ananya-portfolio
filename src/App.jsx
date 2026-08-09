import { useState, useRef, useEffect } from "react";
import { Github, Linkedin, Mail, Send, X, ExternalLink, Loader2, Plus, Sparkles } from "lucide-react";

const COLORS = {
  bg: "#0B1120",
  bgCard: "#111A2E",
  bgHover: "#16223A",
  border: "#1E293B",
  amber: "#E8A33D",
  teal: "#5EEAD4",
  slate: "#CBD5E1",
  slateMuted: "#7C8AA5",
};

const GITHUB_USER = "Ananyaarora24";

// Curated write-ups pulled from her resume, keyed by exact GitHub repo slug so
// live API data can be merged with hand-written descriptions instead of
// replacing them.
const CURATED = {
  VoiceGuide: {
    name: "VoiceGuide",
    tagline: "Real-time AI navigation for visually impaired users",
    desc: "A real-time AI web app giving visually impaired users audio-based navigation and interaction. Frontend built in React, Vite, and Tailwind, integrating OpenAI Vision, Whisper, and TTS through a low-latency processing pipeline over the MediaStream API.",
    stack: ["React", "Vite", "OpenAI Vision", "Whisper", "TTS"],
    focus: "Accessibility",
    highlight: "Low-latency voice pipeline",
  },
  SimplyDesmos: {
    name: "SimplyGraph",
    tagline: "AI-powered SAT math tutor with Desmos",
    desc: "An AI-powered SAT math tutor integrating the Desmos graphing calculator for interactive problem solving and AI-generated hints. Runs on a serverless AWS backend using Lambda, Cognito, Secrets Manager, and Aurora RDS for authentication and scalable data storage.",
    stack: ["Python", "AWS Lambda", "Cognito", "Aurora", "Desmos"],
    focus: "EdTech",
    highlight: "Serverless AWS backend",
  },
  "feedback-intelligence-dashboard": {
    name: "Feedback Intelligence Dashboard",
    tagline: "Sentiment analysis built during a Cloudflare PM internship",
    desc: "Built during a Product Manager internship at Cloudflare. Runs sentiment analysis on user feedback using Workers AI (Llama 3.1), deployed entirely on Cloudflare's edge with Workers and D1.",
    stack: ["React", "Cloudflare Workers", "D1", "Workers AI"],
    focus: "Product analytics",
    highlight: "Deployed on Cloudflare's edge",
  },
  LAHacksChatbot: {
    name: "Askademia",
    tagline: "AI study assistant, MLH award winner",
    desc: "An AI study assistant built with Gemini AI and MongoDB. Won the MLH Best Domain Name Award from the GoDaddy Registry and was presented at LAHacks.",
    stack: ["Gemini AI", "MongoDB"],
    focus: "EdTech",
    highlight: "MLH Best Domain Name Award",
  },
  "Hand-Gesture-Recognition-with-Text-to-Speech": {
    name: "Hand Gesture Recognition",
    tagline: "Real-time A-Z gesture classifier with spoken feedback",
    desc: "A real-time gesture recognition system using OpenCV and Keras to classify A-Z hand gestures at 85% accuracy, with Pyttsx3 text-to-speech announcing detected gestures.",
    stack: ["OpenCV", "Keras", "Pyttsx3"],
    focus: "Computer vision",
    highlight: "85% classification accuracy",
  },
  "Academic-help-system-software": {
    name: "Academic Help System",
    tagline: "Encrypted MySQL backend for student help articles",
    desc: "A MySQL-backed system managing user accounts and help articles using Connection, PreparedStatement, and ResultSet, with encryption via javax.crypto and JSON-based serialization.",
    stack: ["Java", "MySQL"],
    focus: "Backend systems",
    highlight: "javax.crypto encryption",
  },
};

// Repos that are course assignments, practice repos, or duplicate deploy
// mirrors of a curated repo — never auto-surfaced as project cards.
const SKIP_SLUGS = new Set([
  "assingment4", "Gitpractice", "hello-ananya",
  "LAHacksChatbot-Deploy", GITHUB_USER,
]);

const FALLBACK_PROJECTS = Object.values(CURATED).map((p) => ({
  ...p,
  link: `https://github.com/${GITHUB_USER}`,
}));

async function fetchGithubProjects() {
  const res = await fetch(`/api/github-projects`);
  if (!res.ok) throw new Error("GitHub API request failed");
  const repos = await res.json();
  return repos
    .filter((r) => !SKIP_SLUGS.has(r.name))
    .filter((r) => CURATED[r.name] || !r.fork)
    .map((r) => {
      const curated = CURATED[r.name];
      if (curated) return { ...curated, link: r.html_url };
      const tagline = r.description || `A ${r.language || "code"} project on Ananya's GitHub`;
      return {
        name: r.name,
        tagline,
        desc: r.description || `${tagline}. See the repository for full details.`,
        stack: r.language ? [r.language] : [],
        focus: "From GitHub",
        highlight: r.stargazers_count ? `${r.stargazers_count} stars` : "Auto-synced from GitHub",
        link: r.html_url,
      };
    });
}

// Manually maintained — LinkedIn has no public API for fetching a user's
// posts, so this list is updated by hand whenever Ananya posts something
// worth surfacing. Newest first.
const POSTS = [
  {
    title: "Attending the Claude Impact Lab in San Francisco",
    summary: "Spent the day at Anthropic's Claude Impact Lab in SF, learning from builders experimenting with AI and swapping ideas with the community.",
    date: "Aug 2026",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7491890734128623616/",
    image: null,
  },
  {
    title: "Moved to San Francisco to start the next chapter",
    summary: "After graduating summa cum laude from ASU, moved to SF to be closer to the tech community — kicked things off at an \"Agents That Pay\" event on agentic payments infrastructure.",
    date: "Aug 2026",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7491194696707379200/",
    image: "/linkedin/moved-to-sf.jpg",
  },
  {
    title: "Graduated from Arizona State University 🎓",
    summary: "Graduated summa cum laude with a B.S. in Computer Science and a 3.93 GPA, capping four years of leadership with WiCS and the Coalition of International Students.",
    date: "Jun 2026",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7467379819509436416/",
    image: "/linkedin/graduation.jpg",
  },
  {
    title: "Wrapped up her ASU Capstone project",
    summary: "Delivered the DigiClips AWS Lightsail capstone project, gaining hands-on experience with AWS deployment, HTTPS/SSL, reverse proxies, and production support.",
    date: "May 2026",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7460095715202035712/",
    image: "/linkedin/capstone.jpg",
  },
  {
    title: "🚀 VoiceGuide — AI navigation for the visually impaired",
    summary: "Built an AI-powered web app with teammates that narrates surroundings in real time using OpenAI Vision, Whisper, and TTS, helping blind and low-vision users navigate independently.",
    date: "Apr 2026",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7448037094490308608/",
    image: "/linkedin/voiceguide-demo.jpg",
  },
  {
    title: "Named to the Dean's List — Fall 2025",
    summary: "Recognized for a 4.27 GPA at ASU's Ira A. Fulton Schools of Engineering while balancing coursework with leadership and volunteering.",
    date: "Jan 2026",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7416856556333350912/",
    image: "/linkedin/deans-list.jpg",
  },
  {
    title: "Volunteering with JA BizTown",
    summary: "Spent the day helping 4th and 5th graders run simulated businesses through Junior Achievement's BizTown program, teaching teamwork and financial literacy.",
    date: "Jan 2026",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7416139330693431296/",
    image: "/linkedin/ja-biztown.jpg",
  },
  {
    title: "✨ Reflecting on a semester as WiCS Mentorship Director ✨",
    summary: "Presented at the WiCS Final Semester Banquet after a semester guiding five mentee teams, plus a visit to Intel's office that shaped her interest in cloud engineering.",
    date: "Nov 2025",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7399201411168862209/",
    image: "/linkedin/wics-banquet.jpg",
  },
  {
    title: "🌟 Grateful, Inspired, and Empowered after GHC 2025 🌟",
    summary: "Spent four days at the Grace Hopper Celebration in Chicago, connecting with professionals from Amazon, Cloudflare, NVIDIA, and more around cloud computing and AI.",
    date: "Nov 2025",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7394026167994867712/",
    image: "/linkedin/ghc2025.jpg",
  },
];

const EXPERIENCE = [
  { role: "Entrepreneurship Student Grader", org: "Arizona State University", dates: "Aug 2025 - May 2026", desc: "Evaluated 100-150+ assignments weekly with AI-assisted tools; contributed to a 10% improvement in course performance across 50+ students." },
  { role: "Intern", org: "Principled Innovation Academy, ASU", dates: "May 2025 - Jul 2025", desc: "Built an AI-powered platform automating 500+ internship applications; NLP pipelines hit 95% accuracy in resume parsing and role matching." },
  { role: "Undergraduate Teaching Assistant", org: "Intro to Engineering, ASU", dates: "Aug 2024 - Dec 2024", desc: "Supported 40 students with MATLAB and Arduino projects; built an interactive graph-based game to teach programming logic." },
  { role: "Cloud Support Engineer", org: "eWebGuru, India", dates: "May 2024 - Jul 2024", desc: "Managed 30+ Linux/Windows servers, configured Apache, DNS, and SSL, and supported 70+ hosting clients." },
];

function buildSystemPrompt(projects) {
  const projectNames = projects.map((p) => p.name).join(", ");
  return `
You are the AI assistant embedded in Ananya Arora's portfolio site. Visitors chat with you to learn about her.

Respond ONLY using the facts below. Never invent projects, employers, dates, or numbers.

EDUCATION: Arizona State University, B.S. Computer Science, Aug 2022 - May 2026, GPA 3.93. AWS Certified Cloud Practitioner (2025).
SKILLS: Python, Java, C/C++, SQL, Swift, AWS (EC2, S3, Lambda, Cognito, Route 53, Lightsail), Cloudflare Workers/D1/Workers AI, MySQL, MongoDB, Aurora, OpenCV, TensorFlow, Keras, Hugging Face, Git/GitHub, Linux, Figma.
LEADERSHIP: Mentorship Program Director, Women in Computer Science at ASU (Jan 2025-present). Public Relations Director, ASU Coalition of International Students.
She recently moved to San Francisco after graduating and is open to full-time software engineering / AI roles.

CONTACT & LINKS: GitHub: https://github.com/Ananyaarora24 | LinkedIn: https://www.linkedin.com/in/ananyaaro/ | Email: ananya.arora.tech@gmail.com
When asked for her GitHub, LinkedIn, portfolio links, or how to contact/reach her, state the relevant link(s) directly in your reply (write out the full URL) and set widget to {"type": "links"}.

RECENT LINKEDIN POSTS: ${POSTS.map((p) => `"${p.title}" (${p.date}) — ${p.summary}`).join(" | ")}
When asked about her recent LinkedIn posts, activity, or what she's been posting about, summarize from the list above and set widget to {"type": "posts"}.

Available project names (use EXACTLY these strings when referencing projects, pulled live from her GitHub): ${projectNames}
This list reflects ALL ${projects.length} of her current public, non-fork GitHub repositories, synced live moments ago. If asked how many repos or projects she has, answer with exactly ${projects.length} — do not hedge or say there might be more.
Available experience entries: ${EXPERIENCE.map((e) => e.role + " at " + e.org).join(", ")}

Respond with ONLY valid JSON (no markdown fences, no preamble), matching exactly this shape:
{"reply": "2-4 sentence conversational answer, third person", "widget": WIDGET}

WIDGET is one of:
- null (for general questions with no specific project/timeline/contact focus)
- {"type": "projects", "names": ["Exact Project Name", ...]} — 1 to 4 names, when discussing specific project(s)
- {"type": "timeline"} — when asked about her career, experience, or work history
- {"type": "comparison", "names": ["Exact Project Name", "Exact Project Name"]} — exactly 2-3 names, only when asked to compare projects
- {"type": "links"} — when asked for GitHub, LinkedIn, portfolio, or contact info
- {"type": "posts"} — when asked about her recent LinkedIn posts or activity

If a question can't be answered from the facts above, set widget to null and say you don't have that detail, suggesting they email ananya.arora.tech@gmail.com.
`.trim();
}

const STARTERS = [
  "What has she built with AI?",
  "Walk me through her experience",
  "Compare her AI projects",
  "Does she know AWS?",
];

function ProjectCard({ project, onOpen }) {
  return (
    <button onClick={() => onOpen(project.name)} style={{
      textAlign: "left", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10,
      padding: 14, cursor: "pointer", width: "100%",
    }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: "white" }}>{project.name}</div>
      <div style={{ fontSize: 12.5, color: COLORS.slateMuted, marginTop: 4, lineHeight: 1.4 }}>{project.tagline}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: COLORS.teal, background: "rgba(94,234,212,0.08)", padding: "2px 7px", borderRadius: 5 }}>{s}</span>
        ))}
      </div>
    </button>
  );
}

function ProjectsWidget({ names, onOpen, projects }) {
  const items = projects.filter((p) => names.includes(p.name));
  if (!items.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: items.length > 1 ? "1fr 1fr" : "1fr", gap: 10, marginTop: 10 }}>
      {items.map((p) => <ProjectCard key={p.name} project={p} onOpen={onOpen} />)}
    </div>
  );
}

function ComparisonWidget({ names, onOpen, projects }) {
  const items = projects.filter((p) => names.includes(p.name));
  if (items.length < 2) return null;
  const rows = ["focus", "highlight", "stack"];
  const rowLabel = { focus: "Focus", highlight: "Highlight", stack: "Stack" };
  return (
    <div style={{ marginTop: 10, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${items.length}, 1fr)` }}>
        <div style={{ padding: 10, background: COLORS.bg }} />
        {items.map((p) => (
          <button key={p.name} onClick={() => onOpen(p.name)} style={{
            padding: 10, background: COLORS.bg, border: "none", borderLeft: `1px solid ${COLORS.border}`,
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, color: "white", cursor: "pointer", textAlign: "left",
          }}>{p.name}</button>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row} style={{ display: "grid", gridTemplateColumns: `120px repeat(${items.length}, 1fr)`, borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ padding: 10, fontSize: 11.5, color: COLORS.slateMuted, background: COLORS.bgCard }}>{rowLabel[row]}</div>
          {items.map((p) => (
            <div key={p.name + row} style={{ padding: 10, fontSize: 12, color: COLORS.slate, borderLeft: `1px solid ${COLORS.border}`, background: COLORS.bgCard }}>
              {Array.isArray(p[row]) ? p[row].join(", ") : p[row]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LinksWidget() {
  const links = [
    { label: "GitHub", href: "https://github.com/Ananyaarora24", Icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ananyaaro/", Icon: Linkedin },
    { label: "Email", href: "mailto:ananya.arora.tech@gmail.com", Icon: Mail },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
      {links.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.slate,
          background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8,
          padding: "8px 12px", textDecoration: "none",
        }}>
          <Icon size={14} color={COLORS.teal} /> {label}
        </a>
      ))}
    </div>
  );
}

function PostsWidget() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
      {POSTS.map((p) => (
        <a key={p.title} href={p.link} target="_blank" rel="noreferrer" style={{
          display: "flex", gap: 12, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10,
          padding: 14, textDecoration: "none",
        }}>
          {p.image && (
            <img src={p.image} alt="" style={{
              width: 64, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0,
              border: `1px solid ${COLORS.border}`,
            }} />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13.5, color: "white" }}>{p.title}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: COLORS.teal, flexShrink: 0 }}>{p.date}</div>
            </div>
            <div style={{ fontSize: 12.5, color: COLORS.slateMuted, marginTop: 4, lineHeight: 1.4 }}>{p.summary}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

function TimelineWidget() {
  return (
    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 0 }}>
      {EXPERIENCE.map((e, i) => (
        <div key={e.role} style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.amber, marginTop: 6 }} />
            {i < EXPERIENCE.length - 1 && <div style={{ width: 1, flex: 1, background: COLORS.border, minHeight: 30 }} />}
          </div>
          <div style={{ paddingBottom: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: COLORS.teal }}>{e.dates}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13.5, color: "white", marginTop: 2 }}>{e.role}</div>
            <div style={{ fontSize: 12, color: COLORS.slateMuted }}>{e.org}</div>
            <div style={{ fontSize: 12.5, color: COLORS.slate, marginTop: 4, lineHeight: 1.5 }}>{e.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidePanel, setSidePanel] = useState(null);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [syncStatus, setSyncStatus] = useState("syncing");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

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

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
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
        setMessages((prev) => [...prev, { role: "assistant", content: data.error || "Something went wrong.", widget: null }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, widget: data.widget }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Couldn't reach the assistant just now — please try again.", widget: null }]);
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;
  const panelProject = sidePanel ? projects.find((p) => p.name === sidePanel) : null;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        ::placeholder { color: ${COLORS.slateMuted}; }
        .chip:hover { background: ${COLORS.bgHover} !important; }
      `}</style>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
          <button onClick={() => setMessages([])} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
            <Sparkles size={16} color={COLORS.amber} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: "white" }}>Ananya Arora</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {syncStatus === "syncing" && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: COLORS.slateMuted }}>
                <Loader2 size={12} className="animate-spin" /> Syncing GitHub…
              </span>
            )}
            {syncStatus === "synced" && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.teal }}>
                {projects.length} projects · live from GitHub
              </span>
            )}
            {syncStatus === "fallback" && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.amber }}>
                GitHub sync unavailable · showing cached projects
              </span>
            )}
            <a href="https://github.com/Ananyaarora24" target="_blank" rel="noreferrer" style={{ color: COLORS.slateMuted }}><Github size={17} /></a>
            <a href="https://linkedin.com/in/ananyaaro" target="_blank" rel="noreferrer" style={{ color: COLORS.slateMuted }}><Linkedin size={17} /></a>
            <a href="mailto:ananya.arora.tech@gmail.com" style={{ color: COLORS.slateMuted }}><Mail size={17} /></a>
          </div>
        </div>

        {empty ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ width: "100%", maxWidth: 620, textAlign: "center" }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 30, color: "white", marginBottom: 8 }}>
                Ask me about Ananya
              </h1>
              <p style={{ color: COLORS.slateMuted, fontSize: 14.5, marginBottom: 28 }}>
                CS graduate · AI, cloud, and backend systems · San Francisco
              </p>
              <ChatInput input={input} setInput={setInput} onSend={() => send()} loading={loading} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 18 }}>
                {STARTERS.map((s) => (
                  <button key={s} className="chip" onClick={() => send(s)} style={{
                    fontSize: 13, color: COLORS.slate, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                    borderRadius: 20, padding: "8px 14px", cursor: "pointer",
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%", background: m.role === "user" ? COLORS.amber : COLORS.bgCard,
                      color: m.role === "user" ? COLORS.bg : COLORS.slate,
                      padding: "10px 14px", borderRadius: 12, fontSize: 14.5, lineHeight: 1.55,
                    }}>
                      {m.content}
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
                  </div>
                ))}
                {loading && <Loader2 size={16} className="animate-spin" color={COLORS.teal} />}
              </div>
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                <ChatInput input={input} setInput={setInput} onSend={() => send()} loading={loading} />
              </div>
            </div>
          </>
        )}
      </div>

      {panelProject && (
        <div style={{ width: 340, borderLeft: `1px solid ${COLORS.border}`, background: COLORS.bgCard, padding: 24, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.teal }}>{panelProject.focus}</span>
            <button onClick={() => setSidePanel(null)} style={{ background: "none", border: "none", color: COLORS.slateMuted, cursor: "pointer" }}><X size={18} /></button>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "white", marginTop: 8 }}>{panelProject.name}</h2>
          <p style={{ fontSize: 13.5, color: COLORS.slate, lineHeight: 1.6, marginTop: 12 }}>{panelProject.desc}</p>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11.5, color: COLORS.slateMuted, marginBottom: 6 }}>Stack</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {panelProject.stack.map((s) => (
                <span key={s} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.teal, background: "rgba(94,234,212,0.08)", padding: "3px 8px", borderRadius: 6 }}>{s}</span>
              ))}
            </div>
          </div>
          <a href={panelProject.link} target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 20, fontSize: 13, color: COLORS.amber, textDecoration: "none",
          }}>
            View on GitHub <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

function ChatInput({ input, setInput, onSend, loading }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "6px 6px 6px 16px" }}>
      <Plus size={16} color={COLORS.slateMuted} />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Ask about her projects, skills, or experience..."
        style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 14, padding: "10px 0" }}
      />
      <button onClick={onSend} disabled={loading} style={{
        width: 34, height: 34, borderRadius: 10, background: COLORS.amber, border: "none",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
      }}>
        <Send size={15} color={COLORS.bg} />
      </button>
    </div>
  );
}
