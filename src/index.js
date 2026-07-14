import { PROFILE } from "./profile.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin"
};

function json(data, init = {}) {
  const headers = new Headers(JSON_HEADERS);

  for (const [key, value] of Object.entries(init.headers ?? {})) {
    headers.set(key, value);
  }

  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return json(
        {
          error: "METHOD_NOT_ALLOWED",
          message: "GETまたはHEADのみ利用できます。"
        },
        {
          status: 405,
          headers: { allow: "GET, HEAD" }
        }
      );
    }

    if (url.pathname === "/api/health") {
      return json(
        {
          status: "ok",
          service: "ivurugg-discord-widget",
          version: PROFILE.version,
          timestamp: new Date().toISOString()
        },
        {
          headers: { "cache-control": "no-store" }
        }
      );
    }

    if (url.pathname === "/api/profile") {
      return json(PROFILE, {
        headers: {
          "cache-control": "public, max-age=60, stale-while-revalidate=300"
        }
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return json(
        {
          error: "NOT_FOUND",
          message: "指定されたAPIは存在しません。"
        },
        { status: 404 }
      );
    }

    return env.ASSETS.fetch(request);
  }
};
