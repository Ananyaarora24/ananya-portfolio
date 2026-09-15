import { GITHUB_USER } from "./profile.js";

// Curated write-ups pulled from her resume, keyed by exact GitHub repo slug so
// live API data can be merged with hand-written descriptions instead of
// replacing them.
//
// Schema (see components/CaseStudy.jsx and components/FeaturedProjectCard.jsx
// for how each field renders):
//   name, tagline, date, summary, desc, stack, featuredStack, focus, highlight,
//   contribution[]        — "My contribution" bullets, strong-verb, hers specifically
//   technicalHighlight     — one engineering-signal sentence for the featured card
//   architecture           — { lanes: [{ label?, steps[] }], merge?[], fanOut?[] }
//   caseStudy               — { overview?, problem, challenge, decisions?[], outcome, lessons? }
//   github, demo            — real links only; omit rather than invent
//   featured                — true for the 4 cards in "Featured Work"
//
// Order matters: featured projects render in this object's insertion order.
export const CURATED = {
  SimplyDesmos: {
    name: "SimplyGraph",
    tagline: "Co-Founder · AI-powered SAT Math prep",
    date: "Sep 2025",
    summary: "An AI-powered SAT Math prep platform that pairs the real Desmos graphing calculator students use on test day with an AI assistant offering four help modes per problem.",
    desc: "Co-founded SimplyGraph, an AI-powered SAT Math prep platform with 500+ practice problems and the same Desmos graphing calculator students use on test day. An in-app AI assistant offers Hint, Solution, Teach Me, and Analyze modes alongside each problem. Backed by a serverless AWS architecture using Lambda, Cognito, Secrets Manager, and Aurora RDS to handle authentication and scalable data storage.",
    stack: ["Python", "AWS Lambda", "Cognito", "Secrets Manager", "Aurora", "Desmos"],
    featuredStack: ["Python", "AWS Lambda", "Cognito", "Aurora RDS", "Desmos"],
    focus: "EdTech",
    highlight: "Co-Founder · 500+ practice problems",
    contribution: [
      "Architected the serverless AWS backend — Lambda, Cognito, Secrets Manager, and Aurora RDS",
      "Integrated the Desmos graphing calculator with a custom AI assistant (Hint / Solution / Teach Me / Analyze)",
    ],
    technicalHighlight: "Built a serverless AWS backend — Lambda + Cognito + Secrets Manager + Aurora RDS — handling auth, data, and AI logic for a live product.",
    architecture: {
      lanes: [{ steps: ["Desmos UI (Frontend)", "AWS Lambda (AI Assistant)"] }],
      fanOut: ["Cognito — Auth", "Secrets Manager — Credentials", "Aurora RDS — Data"],
    },
    caseStudy: {
      overview: "A live, co-founded EdTech product — not a class assignment — pairing a real graphing calculator with an AI tutor on a serverless AWS backend.",
      problem: "SAT math prep tools are usually either a static calculator or a static hint bank — students get one or the other, not both working together in real time.",
      challenge: "Authentication and data storage had to scale without a managed server, so the backend runs entirely on Lambda, with Cognito for auth, Secrets Manager for credentials, and Aurora RDS for persistence.",
      decisions: [
        "Chose a fully serverless AWS stack over a traditional server so auth and data could scale without managing infrastructure.",
        "Reused Desmos's existing graphing engine instead of building a custom calculator, so engineering time went into the AI assistant and backend instead of reinventing a graphing UI.",
      ],
      outcome: "The graphing UI, AI assistant, and user data all stay in sync on a backend with no server to manage — a live, co-founded product with 500+ practice problems.",
      lessons: "Designing the auth and data boundaries before building product features made it easier to add the AI assistant modes later without re-architecting the backend.",
    },
    github: `https://github.com/${GITHUB_USER}/SimplyDesmos`,
    featured: true,
  },
  VoiceGuide: {
    name: "VoiceGuide",
    tagline: "Real-time AI navigation for visually impaired users",
    date: "Mar 2026",
    summary: "A real-time AI web app that gives visually impaired users spoken, audio-based awareness of their surroundings — point a camera, ask a question out loud, get a spoken answer back.",
    desc: "A real-time AI web app giving visually impaired users audio-based navigation and interaction. The React/Vite frontend streams live camera and voice input through OpenAI Vision, Whisper, and TTS in a low-latency pipeline built on the browser's MediaStream API.",
    stack: ["React", "Vite", "Tailwind CSS", "OpenAI Vision", "Whisper", "TTS", "MediaStream API"],
    featuredStack: ["React", "OpenAI Vision", "Whisper", "TTS", "MediaStream API"],
    focus: "Accessibility",
    highlight: "Low-latency voice pipeline",
    contribution: [
      "Built the React/Vite frontend and the real-time camera + voice capture pipeline",
      "Integrated OpenAI Vision, Whisper, and TTS into one low-latency loop over the MediaStream API",
      "Debugged end-to-end latency across three chained model calls to keep the feedback loop usable live",
    ],
    technicalHighlight: "Integrated vision, speech recognition, and text-to-speech into one low-latency accessibility pipeline.",
    architecture: {
      lanes: [
        { label: "Vision", steps: ["Camera feed", "OpenAI Vision"] },
        { label: "Voice", steps: ["Microphone", "Whisper"] },
      ],
      merge: ["TTS", "Spoken feedback"],
    },
    caseStudy: {
      overview: "Chains live camera and voice input through three AI models into one spoken feedback loop.",
      problem: "Visually impaired users need continuous, spoken awareness of their surroundings — not a static image caption, but a live loop that keeps up as the scene and their questions change.",
      challenge: "Chaining three model calls (vision, speech-to-text, text-to-speech) around a live video stream meant every added millisecond of latency was directly felt by the user, so the pipeline had to be built for low-latency, low-friction turnaround end to end.",
      decisions: [
        "Streamed camera and audio over the browser's MediaStream API instead of a native app, so it runs anywhere with just a browser.",
        "Ran vision and voice recognition as parallel calls rather than sequential, since chaining vision → speech → TTS one at a time would have made the latency worse.",
      ],
      outcome: "Camera in, spoken feedback out — a working audio-guidance loop built and demoed with teammates.",
      lessons: "Chaining three model calls around a live video stream showed how much latency budget matters in an accessibility tool — a feature that's technically correct but too slow isn't actually usable.",
    },
    github: `https://github.com/${GITHUB_USER}/VoiceGuide`,
    demo: "https://wics-hackathon-kappa.vercel.app",
    featured: true,
  },
  LAHacksChatbot: {
    name: "Askademia",
    tagline: "Conversational TA assistant · MLH award winner",
    date: "Apr 2025",
    summary: "A conversational teaching-assistant chatbot that answers student questions grounded in real course materials through a retrieval-augmented generation pipeline.",
    desc: "A conversational TA assistant that answers questions over course materials using a Retrieval-Augmented Generation pipeline: a React chat UI talks to a FastAPI backend that runs vector search over ingested course content and queries Google Gemini, all deployed on AWS via Docker with CI/CD. Presented at LAHacks, where it won the MLH Best Domain Name Award from the GoDaddy Registry.",
    stack: ["React", "FastAPI", "Vector Search", "Google Gemini", "AWS", "Docker"],
    featuredStack: ["React", "FastAPI", "Vector Search", "Google Gemini", "AWS"],
    focus: "EdTech",
    highlight: "MLH Best Domain Name Award",
    contribution: [
      "Built the React chat UI and the FastAPI backend",
      "Implemented the RAG pipeline — vector search over ingested course materials feeding Google Gemini",
      "Deployed the stack on AWS via Docker with CI/CD",
    ],
    technicalHighlight: "Built a RAG pipeline — vector search + Google Gemini — deployed on AWS with Docker and CI/CD.",
    architecture: {
      lanes: [{ steps: ["React Chat UI", "FastAPI + Vector Search (RAG)", "Google Gemini", "AWS + Docker (CI/CD)"] }],
    },
    caseStudy: {
      overview: "A hackathon-built RAG chatbot that grounds every answer in real course content instead of a generic model response.",
      problem: "Students asking questions about course materials need answers grounded in the actual course content, not a generic chatbot response.",
      challenge: "Coordinating five moving pieces — frontend, RAG backend, third-party model, ingestion, and deployment — into one working loop under hackathon time pressure.",
      decisions: [
        "Used vector search to ground answers in real course materials instead of relying on the model's own knowledge, so answers matched what was actually taught.",
        "Deployed via Docker + CI/CD on AWS instead of a manual hackathon deploy, so the demo stayed reproducible under judging.",
      ],
      outcome: "Presented at LAHacks and awarded the MLH Best Domain Name Award from the GoDaddy Registry — a fully working conversational TA assistant end to end.",
      lessons: "Coordinating five moving pieces under hackathon time pressure showed the value of getting a thin end-to-end path working before polishing any one piece.",
    },
    github: `https://github.com/${GITHUB_USER}/LAHacksChatbot`,
    featured: true,
  },
  HireMeMaybe: {
    name: "HireMeMaybe",
    tagline: "AI-assisted resume + internship application workflow",
    date: "May 2025 - Jul 2025",
    summary: "An AI-powered platform that automated internship applications and resume customization for students, using LLMs to parse and tailor each resume to the target role.",
    desc: "Built during a Principled Innovation Academy internship at ASU. An LLM-driven pipeline parsed resumes, matched them to roles, and auto-customized each application — automating 500+ internship applications at 95% parsing and matching accuracy.",
    stack: ["TypeScript", "LLMs", "NLP"],
    featuredStack: ["TypeScript", "LLMs", "NLP"],
    focus: "AI / Career Tech",
    highlight: "500+ applications automated · 95% parsing accuracy",
    contribution: [
      "Built the NLP pipeline for resume parsing and role matching",
      "Integrated LLMs to auto-customize resumes per role",
      "Automated the end-to-end application workflow across 500+ applications",
    ],
    technicalHighlight: "Built an LLM-driven resume-parsing pipeline reaching 95% accuracy across 500+ automated applications.",
    architecture: {
      lanes: [{ steps: ["Resume input", "NLP parsing", "Role matching", "LLM resume customization"] }],
    },
    caseStudy: {
      problem: "Students applying to internships spend significant time re-customizing the same resume for each role by hand — a repetitive task well suited to automation if it can be done accurately.",
      challenge: "Getting resume parsing and role matching accurate enough to trust with automation — a low-accuracy pipeline would auto-generate worse applications than doing it by hand.",
      decisions: [
        "Measured pipeline accuracy directly (95% on parsing/matching) rather than shipping automation without a quality bar.",
      ],
      outcome: "500+ internship applications automated end to end, holding 95% accuracy on parsing and role matching throughout.",
      lessons: "Automating something as personal as a resume only works if the underlying parsing is trustworthy — validating accuracy was as important as building the automation itself.",
    },
    github: `https://github.com/${GITHUB_USER}/HireMeMaybe`,
    featured: true,
  },
  "Hand-Gesture-Recognition-with-Text-to-Speech": {
    name: "Hand Gesture Recognition",
    tagline: "Real-time A-Z gesture classifier with spoken feedback",
    date: "Dec 2024",
    desc: "A real-time gesture recognition system using OpenCV and Keras to classify A-Z hand gestures at 85% accuracy, with Pyttsx3 text-to-speech announcing each detected gesture for combined visual and audio feedback.",
    stack: ["OpenCV", "Keras", "Pyttsx3"],
    focus: "Computer vision",
    highlight: "85% classification accuracy",
    contribution: [
      "Built a real-time OpenCV hand-region pipeline feeding a Keras CNN classifier",
      "Integrated Pyttsx3 text-to-speech for immediate spoken output",
    ],
    architecture: {
      lanes: [{ steps: ["Webcam feed", "OpenCV (hand region detection)", "Keras CNN (A-Z classification)", "Pyttsx3 (text-to-speech)", "Spoken + on-screen output"] }],
    },
    caseStudy: {
      problem: "Hand-sign recognition needs to run in real time off a live camera feed, and communicate results without forcing the user to read a screen.",
      challenge: "Keeping classification fast and accurate enough to run per-frame in real time, since a laggy or noisy prediction breaks the feedback loop the whole feature depends on.",
      outcome: "A real-time A-Z hand gesture classifier reaching 85% accuracy end to end, pairing visual and spoken feedback for every detected gesture.",
    },
    github: `https://github.com/${GITHUB_USER}/Hand-Gesture-Recognition-with-Text-to-Speech`,
  },
  "Academic-help-system-software": {
    name: "Academic Help System",
    tagline: "Encrypted MySQL backend for student help articles",
    date: "Oct 2024 - Dec 2024",
    desc: "A MySQL-backed system for student accounts and help articles, with JDBC for data access, javax.crypto for field-level encryption, and org.json for serialization.",
    stack: ["Java", "MySQL"],
    focus: "Backend systems",
    highlight: "Encrypted, injection-safe data layer",
    contribution: [
      "Built the JDBC data layer (Connection / PreparedStatement / ResultSet) for accounts and articles",
      "Implemented field-level encryption with javax.crypto and serialization via org.json",
    ],
    architecture: {
      lanes: [{ steps: ["Java client", "JDBC (Connection / PreparedStatement / ResultSet)", "MySQL database", "javax.crypto (encrypted fields)", "org.json (serialization)"] }],
    },
    caseStudy: {
      problem: "A student help-article system needs to persist user accounts and content safely, without leaking sensitive fields in plaintext if the database itself is ever exposed.",
      challenge: "Keeping every query parameterized through PreparedStatement while layering encryption and decryption cleanly around just the fields that needed it.",
      outcome: "An encrypted MySQL backend for student accounts and help articles, built entirely on core Java's JDBC and crypto libraries with no external framework.",
    },
    github: `https://github.com/${GITHUB_USER}/Academic-help-system-software`,
  },
  "ananya-portfolio": {
    name: "ananya-portfolio",
    tagline: "This AI-powered portfolio site, live from GitHub",
    desc: "This portfolio site itself: a React/Vite/Tailwind single-page app with an embedded AI chat assistant that answers visitor questions grounded only in her real project, experience, and education data, plus a project feed synced live from the GitHub API. Deployed as static assets with Cloudflare Pages Functions handling the chat and GitHub proxy endpoints.",
    stack: ["React", "Vite", "Tailwind CSS", "Cloudflare Pages Functions", "Groq API"],
    focus: "Portfolio",
    highlight: "The site you're looking at right now",
    contribution: [
      "Built the React/Vite/Tailwind frontend and the embedded AI chat assistant",
      "Deployed via Cloudflare Pages Functions proxying the GitHub and Groq APIs",
    ],
    architecture: {
      lanes: [{ steps: ["Visitor", "React/Vite/Tailwind UI", "Cloudflare Pages Functions (/api/chat, /api/github-projects)", "Groq API (GPT-OSS-120B)", "Grounded reply + widget"] }],
    },
    caseStudy: {
      problem: "A static portfolio page can list projects, but it can't answer a recruiter's specific follow-up question — like 'walk me through the architecture of X' — without either a wall of text or a chatbot that hallucinates details.",
      challenge: "Keeping the assistant from inventing projects, dates, or numbers meant constraining every reply to only the facts assembled into the system prompt, while keeping that prompt within request-size and rate limits without cutting real answers short.",
      outcome: "A self-hosting portfolio — this project card, and the panel you're reading now, are both fetched live from her GitHub the same way every other repo on this page is.",
    },
    github: `https://github.com/${GITHUB_USER}/ananya-portfolio`,
  },
  "HealthCare-HackPrinceton-": {
    name: "Bloom",
    tagline: "Women's health tracker built at HackPrinceton",
    desc: "Bloom, a women's health tracking app built at HackPrinceton. A Swift iOS app ('mood') gives users a day-to-day interface for logging cycle, symptom, and lifestyle data, backed by a Java/JDBC service layer managing a six-table MySQL schema.",
    stack: ["Swift", "Java", "MySQL", "JDBC"],
    focus: "HealthTech",
    highlight: "Six-table relational health schema",
    contribution: [
      "Built the Java/JDBC service layer and the six-table MySQL schema",
      "Collaborated on the SwiftUI iOS logging interface",
    ],
    architecture: {
      lanes: [{ steps: ["Bloom iOS app (SwiftUI)", "Java service layer (JDBC)", "MySQL (Users, HealthMetrics, Symptoms, OvulationFertility, Lifestyle, MedicalHistory)"] }],
    },
    caseStudy: {
      problem: "Women's health tracking spans several distinct kinds of data — cycle/fertility, symptoms, lifestyle, medical history — that most single-purpose tracking apps don't unify in one place.",
      challenge: "Designing a relational schema that could hold several different categories of health data per user without collapsing them into one unstructured blob, while keeping the JDBC layer's queries parameterized.",
      outcome: "An iOS health-tracking prototype backed by a real relational schema, built and presented at HackPrinceton.",
    },
    github: `https://github.com/${GITHUB_USER}/HealthCare-HackPrinceton-`,
  },
  "TestGame-Multiplayer": {
    name: "Multiplayer Game",
    tagline: "Real-time 2-player game over raw TCP sockets",
    desc: "A 2-player multiplayer game built with Pygame, where a threaded Python socket server tracks each player's position and relays it to the other client in real time, with a small Network wrapper class handling the client-side socket connection and position sync.",
    stack: ["Python", "Pygame", "Sockets", "Threading"],
    focus: "Networking / Games",
    highlight: "Threaded TCP server syncing 2 clients",
    contribution: [
      "Built the threaded TCP socket server tracking both players' positions",
      "Built the Pygame client and the network.py socket wrapper",
    ],
    architecture: {
      lanes: [{ steps: ["Client A (Pygame + keyboard input)", "network.py (TCP socket)", "Server.py (threaded, tracks positions)", "Client B (Pygame render)"] }],
    },
    caseStudy: {
      problem: "A local single-player game loop doesn't show you the other player — position updates need to travel between two independent Pygame clients in real time without relying on a game engine's built-in networking.",
      challenge: "Handling two concurrent client connections on one socket server without one player's request blocking the other — the reason the server spins up a threaded handler per connection.",
      outcome: "Move on one screen, see the update on the other — a two-client multiplayer loop built directly on Python sockets rather than a networking library.",
    },
    github: `https://github.com/${GITHUB_USER}/TestGame-Multiplayer`,
  },
  "Devils-Invent-UXO": {
    name: "UXO Detection Rover",
    tagline: "Autonomous rover for unexploded-ordnance detection",
    desc: "An Arduino-driven rover built at ASU's Devils Invent hackathon to help locate unexploded ordnance (UXO). An ultrasonic sensor drives obstacle avoidance while a separate capacitive sensing circuit scans for buried metal, with a Figma-designed Unity companion app visualizing the rover's readings.",
    stack: ["Arduino (C++)", "Ultrasonic sensing", "Unity", "Figma"],
    focus: "Robotics / Hardware",
    highlight: "Dual-sensor Arduino rover",
    contribution: [
      "Programmed the Arduino obstacle-avoidance and capacitive metal-sensing logic",
      "Integrated the ultrasonic sensor and drive-motor control",
    ],
    architecture: {
      lanes: [{ steps: ["Ultrasonic sensor (HC-SR04)", "Arduino (obstacle avoidance + capacitive metal sensing)", "Drive motors + servo", "Unity companion app (Figma-designed UI)"] }],
    },
    caseStudy: {
      problem: "Locating unexploded ordnance safely means driving a sensor over an area without a person walking into the hazard themselves, and without the rover blindly colliding with obstacles along the way.",
      challenge: "Combining two very different sensing jobs — ultrasonic distance for navigation and capacitive sensing for metal detection — on one Arduino loop without one blocking the timing of the other.",
      outcome: "Demoed at Devils Invent: an Arduino rover that steers around obstacles while scanning for buried metal, paired with a Unity-based visualization app.",
    },
    github: `https://github.com/${GITHUB_USER}/Devils-Invent-UXO`,
  },
};

// Repos that are course assignments, practice repos, or duplicate deploy
// mirrors of a curated repo — never auto-surfaced as project cards.
export const SKIP_SLUGS = new Set([
  "assingment4", "Gitpractice", "hello-ananya",
  "LAHacksChatbot-Deploy", GITHUB_USER,
]);

export const FALLBACK_PROJECTS = Object.values(CURATED).map((p) => ({
  ...p,
  link: p.github,
}));

// Preserves CURATED's insertion order (Ananya's requested priority order).
export const FEATURED_PROJECTS = Object.values(CURATED).filter((p) => p.featured);
export const FEATURED_NAMES = FEATURED_PROJECTS.map((p) => p.name);

// Turns the structured `architecture` object into a flat "A → B → C" style
// string for the AI system prompt — one source of truth, two presentations.
export function flattenArchitecture(architecture) {
  if (!architecture?.lanes?.length) return null;
  const parts = architecture.lanes.map((lane) => {
    const chain = lane.steps.join(" → ");
    return lane.label ? `${lane.label}: ${chain}` : chain;
  });
  if (architecture.merge) parts.push(`together → ${architecture.merge.join(" → ")}`);
  if (architecture.fanOut) parts.push(`branching to → ${architecture.fanOut.join(", ")}`);
  return parts.join("; ");
}

export async function fetchGithubProjects() {
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
