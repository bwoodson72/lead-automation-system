import type { CollectionEntry } from "astro:content";

export const ARTICLES_PER_PAGE = 9;

export type ArticleEntry = CollectionEntry<"articles">;

export type ArticleTopic = {
  slug: string;
  label: string;
  description: string;
  tags: string[];
  categories?: string[];
};

export const articleTopics: ArticleTopic[] = [
  {
    slug: "client-acquisition",
    label: "Client Acquisition",
    description: "Find better prospects, create relevant conversations, and build a client pipeline you control.",
    tags: ["client-acquisition", "prospecting", "pipeline", "outreach", "qualification", "upwork"],
    categories: ["freelancing", "qualification"],
  },
  {
    slug: "pricing",
    label: "Pricing",
    description: "Price freelance development work with stronger economics, scope, risk, and commercial judgment.",
    tags: ["pricing", "project-pricing"],
    categories: ["pricing"],
  },
  {
    slug: "sales",
    label: "Sales",
    description: "Turn qualified opportunities into clear decisions, stronger proposals, and signed projects.",
    tags: ["sales", "closing", "proposal", "proposals", "objections"],
    categories: ["sales", "closing"],
  },
  {
    slug: "positioning",
    label: "Positioning",
    description: "Make it easier for the right buyer to understand what you sell, who it is for, and why it matters.",
    tags: ["positioning", "offers", "productization", "productize"],
    categories: ["positioning", "offers"],
  },
  {
    slug: "client-management",
    label: "Client Management",
    description: "Run projects with clearer onboarding, scope, delivery, change control, and client expectations.",
    tags: ["client-management", "onboarding", "change-control", "delivery", "qa", "scope-creep"],
    categories: ["client management", "delivery"],
  },
  {
    slug: "growth",
    label: "Growth & Retention",
    description: "Build repeat business, referrals, recurring revenue, and a healthier long-term freelance pipeline.",
    tags: ["growth", "retention", "referrals", "retainer", "recurring-revenue", "feast-or-famine", "marketing"],
    categories: ["growth", "retention"],
  },
  {
    slug: "ai-automation",
    label: "AI & Automation",
    description: "Use AI and automation without sacrificing evidence quality, control, or sound prospecting decisions.",
    tags: ["ai", "automation", "n8n", "architecture", "quality-control", "evidence"],
    categories: ["automation", "evidence"],
  },
];

export function sortArticles(articles: ArticleEntry[]) {
  return [...articles].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function articleMatchesTopic(article: ArticleEntry, topic: ArticleTopic) {
  const tags = article.data.tags.map((tag) => tag.toLowerCase());
  const category = article.data.category.toLowerCase();

  return (
    topic.tags.some((tag) => tags.includes(tag.toLowerCase())) ||
    topic.categories?.some((candidate) => candidate.toLowerCase() === category) ||
    false
  );
}

export function getTopicBySlug(slug: string) {
  return articleTopics.find((topic) => topic.slug === slug);
}

export function getTopicLinks(articles: ArticleEntry[]) {
  return articleTopics
    .map((topic) => ({
      ...topic,
      count: articles.filter((article) => articleMatchesTopic(article, topic)).length,
    }))
    .filter((topic) => topic.count > 0);
}
