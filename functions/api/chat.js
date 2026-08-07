const MODEL = "openai/gpt-oss-120b";
const MAX_COMPLETION_TOKENS = 1000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_SYSTEM_LENGTH = 8000;

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
    return json({ error: "Upstream chat request failed", detail }, 502);
  }

  const data = await groqRes.json();
  const raw = data.choices?.[0]?.message?.content || "";

  let parsed;
  try {
    parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    parsed = { reply: raw || "Sorry, something went wrong parsing that response.", widget: null };
  }

  return json(parsed, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
