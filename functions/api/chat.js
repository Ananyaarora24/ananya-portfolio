const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 1000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_SYSTEM_LENGTH = 8000;

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.ANTHROPIC_API_KEY) {
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

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!anthropicRes.ok) {
    const detail = await anthropicRes.text();
    return json({ error: "Upstream chat request failed", detail }, 502);
  }

  const data = await anthropicRes.json();
  return json(data, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
