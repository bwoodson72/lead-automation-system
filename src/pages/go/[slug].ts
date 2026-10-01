import type { APIRoute, GetStaticPaths } from "astro";

const trackingLinks = {
  "linkedin-quickstart": {
    destination: "/free/",
    params: {
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "quickstart",
      utm_content: "profile_featured",
    },
  },
  "linkedin-first-client": {
    destination: "/articles/how-to-get-first-freelance-web-development-client/",
    params: {
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "first_client_article",
      utm_content: "linkedin_post",
    },
  },
} as const;

type TrackingSlug = keyof typeof trackingLinks;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(trackingLinks).map((slug) => ({ params: { slug } }));

export const GET: APIRoute = ({ params, site }) => {
  const slug = params.slug as TrackingSlug;
  const link = trackingLinks[slug];

  if (!link) {
    return new Response("Not found", { status: 404 });
  }

  const origin = site?.toString() ?? "https://www.developerbusinesslab.com/";
  const url = new URL(link.destination, origin);

  for (const [key, value] of Object.entries(link.params)) {
    url.searchParams.set(key, value);
  }

  return Response.redirect(url.toString(), 302);
};
