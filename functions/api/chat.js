const MODEL = "openai/gpt-oss-120b";
// Groq's on-demand tier caps this key at 8000 tokens/minute, charged against
// (prompt tokens + max_completion_tokens) per request, not actual output —
// kept below the prior 1600 to leave headroom for more than one detailed
// question per minute without cutting a real answer short.
const MAX_COMPLETION_TOKENS = 1300;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_SYSTEM_LENGTH = 18000;

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.GROQ_API_KEY) {
    return json({ error: "Chat is not configured on this deployment." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { system, messages } = body || {};

  if (typeof system !== "string" || !system || system.length > MAX_SYSTEM_LENGTH) {
    return json({ error: "Invalid system prompt" }, 400);
  }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return json({ error: "Invalid messages" }, 400);
  }
  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      !m.content ||
      m.content.length > MAX_MESSAGE_LENGTH
    ) {
      return json({ error: "Invalid message entry" }, 400);
    }
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_completion_tokens: MAX_COMPLETION_TOKENS,
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!groqRes.ok) {
    const detail = await groqRes.text();
    if (groqRes.status === 429 || detail.includes("rate_limit_exceeded")) {
      return json({ error: "Getting a lot of questions right now — please wait a few seconds and try again.", detail }, 429);
    }
    return json({ error: "Upstream chat request failed", detail }, 502);
  }

  const data = await groqRes.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  let parsed = extractReplyJson(cleaned) || {
    reply: cleaned || "Sorry, something went wrong parsing that response.",
    widget: null,
  };

  // The model occasionally re-wraps its own JSON envelope inside the "reply"
  // string itself. If what's left still looks like raw JSON, don't show it —
  // fall back to a clean message rather than leak broken syntax to the user.
  if (typeof parsed.reply === "string" && /^\s*\{\s*"reply"\s*:/.test(parsed.reply)) {
    const unwrapped = extractReplyJson(parsed.reply);
    parsed = unwrapped || { reply: "Sorry, that answer got cut off — could you ask again?", widget: null };
  }

  // The model also sometimes forgets to put the widget in its proper field
  // and instead appends a stray {"widget": {...}} (or bare {"type": "..."})
  // blob onto the end of the reply text. Pull it out and use it as the real
  // widget instead of showing raw JSON to the user.
  parsed = siphonTrailingWidgetJson(parsed);

  return json(parsed, 200);
}

function siphonTrailingWidgetJson(parsed) {
  if (typeof parsed.reply !== "string") return parsed;
  const trimmed = parsed.reply.replace(/\s+$/, "");
  if (!trimmed.endsWith("}")) return parsed;

  let depth = 0;
  let start = -1;
  for (let i = trimmed.length - 1; i >= 0; i--) {
    if (trimmed[i] === "}") depth++;
    else if (trimmed[i] === "{") {
      depth--;
      if (depth === 0) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) return parsed;

  let obj;
  try {
    obj = JSON.parse(trimmed.slice(start));
  } catch {
    return parsed;
  }

  const extractedWidget = obj && typeof obj === "object" ? (obj.widget || (obj.type ? obj : null)) : null;
  if (!extractedWidget) return parsed;

  const cleanReply = trimmed.slice(0, start).trim();
  return {
    reply: cleanReply || parsed.reply,
    widget: parsed.widget || extractedWidget,
  };
}

// The model is expected to reply with only a JSON object, but it sometimes
// prefaces it with stray prose. Try a straight parse first, then fall back
// to pulling out the {...} substring so that leading text doesn't leak into
// the displayed reply.
function extractReplyJson(text) {
  const tryParse = (str) => {
    try {
      const obj = JSON.parse(str);
      return obj && typeof obj.reply === "string" ? obj : null;
    } catch {
      return null;
    }
  };

  const direct = tryParse(text);
  if (direct) return direct;

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  return tryParse(text.slice(start, end + 1));
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
