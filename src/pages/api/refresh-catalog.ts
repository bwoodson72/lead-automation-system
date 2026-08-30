import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHook) {
    return new Response("VERCEL_DEPLOY_HOOK_URL is not configured.", { status: 503 });
  }

  const deployHookUrl = new URL(deployHook);
  if (deployHookUrl.protocol !== "https:" || deployHookUrl.hostname !== "api.vercel.com") {
    return new Response("VERCEL_DEPLOY_HOOK_URL is invalid.", { status: 503 });
  }

  const response = await fetch(deployHookUrl, { method: "POST", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    return new Response("Vercel rejected the catalog rebuild request.", { status: 502 });
  }

  return Response.json({ accepted: true }, { status: 202 });
};
