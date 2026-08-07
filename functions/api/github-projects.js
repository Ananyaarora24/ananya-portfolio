const GITHUB_USER = "Ananyaarora24";
const CACHE_TTL_SECONDS = 300;

export async function onRequestGet(context) {
  const { env } = context;
  const cache = caches.default;
  const cacheKey = new Request(`https://cache.internal/github-projects/${GITHUB_USER}`);

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const headers = {
    "User-Agent": "ananya-portfolio-pages-function",
    Accept: "application/vnd.github+json",
  };
  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  const ghRes = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
    { headers }
  );

  if (!ghRes.ok) {
    return new Response(JSON.stringify({ error: "GitHub API request failed" }), {
      status: ghRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const repos = await ghRes.json();
  const response = new Response(JSON.stringify(repos), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
