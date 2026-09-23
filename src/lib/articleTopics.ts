import type { CollectionEntry } from "astro:content";

export const ARTICLES_PER_PAGE = 6;

export type ArticleEntry = CollectionEntry<"articles">;
export type ArticleStageSlug = "define" | "price" | "attract" | "sell" | "deliver" | "retain";

export type ArticleTopic = {
  slug: ArticleStageSlug;
  label: string;
  heading: string;
  description: string;
};

export const articleTopics: ArticleTopic[] = [
  {
    slug: "define",
    label: "Define",
    heading: "Define: What you sell",
    description: "Choosing a niche, shaping a clear service, and setting boundaries around your work.",
  },
  {
    slug: "price",
    label: "Price",
    heading: "Price: What you charge",
    description: "Pricing models, quotes, payment schedules, and knowing whether a project is worth taking.",
  },
  {
    slug: "attract",
    label: "Attract",
    heading: "Attract: How clients find you",
    description: "Marketing, case studies, outreach, social media, referrals, and agency partnerships.",
  },
  {
    slug: "sell",
    label: "Sell",
    heading: "Sell: How you close the deal",
    description: "Sales calls, proposals, negotiation, qualification, and getting projects signed.",
  },
  {
    slug: "deliver",
    label: "Deliver",
    heading: "Deliver: How the project runs",
    description: "Revisions, acceptance criteria, cancellations, handoffs, onboarding, and keeping scope under control.",
  },
  {
    slug: "retain",
    label: "Retain",
    heading: "Retain: How clients keep paying you",
    description: "Support after launch, maintenance, and turning good projects into legitimate ongoing work.",
  },
];

const stageOverrides: Record<string, ArticleStageSlug> = {
  "how-to-choose-freelance-web-development-niche-without-boxing-yourself-in": "define",
  "how-to-productize-web-development-services": "define",
  "how-to-stop-competing-with-cheap-freelancers": "define",
  "fixed-price-vs-hourly-freelance-web-development-project": "price",
  "how-to-price-freelance-web-development-project": "price",
  "how-to-structure-payment-schedule-freelance-web-development-project": "price",
  "how-to-structure-payment-terms-freelance-web-development-project": "price",
  "how-to-turn-freelance-web-development-project-into-case-study": "attract",
  "how-to-market-yourself-as-freelance-web-developer": "attract",
  "get-freelance-web-development-clients-without-upwork": "attract",
  "how-to-get-web-development-work-from-agencies": "attract",
  "how-to-ask-clients-for-referrals-without-making-it-awkward": "attract",
  "why-freelance-developers-get-stuck-in-feast-or-famine-cycle": "attract",
  "why-freelance-marketplaces-are-weak-foundation-for-freelance-business": "attract",
  "qualified-web-development-lead": "attract",
  "how-to-handle-freelance-web-development-price-objection": "sell",
  "how-to-follow-up-with-prospect-without-just-checking-in": "sell",
  "how-to-run-freelance-web-development-discovery-call": "sell",
  "what-should-freelance-web-development-proposal-include": "sell",
  "when-to-sell-paid-discovery-before-freelance-web-development-proposal": "sell",
  "when-to-send-proposal-to-freelance-client": "sell",
  "how-to-define-acceptance-criteria-freelance-web-development-project": "deliver",
  "how-to-handle-client-cancels-freelance-web-development-project": "deliver",
  "how-to-handle-client-delays-freelance-web-development-project": "deliver",
  "how-to-handle-client-revisions-freelance-web-development-project": "deliver",
  "how-to-handoff-freelance-web-development-project-to-client": "deliver",
  "how-to-onboard-freelance-web-development-client": "deliver",
  "how-to-prevent-scope-creep-web-development-projects": "deliver",
  "how-to-know-when-to-walk-away-from-freelance-web-development-client": "deliver",
  "how-to-turn-past-clients-into-repeat-revenue": "retain",
  "should-you-put-freelance-web-development-client-on-retainer-after-launch": "retain",
};

const categoryStages: Record<string, ArticleStageSlug> = {
  define: "define",
  positioning: "define",
  offers: "define",
  pricing: "price",
  price: "price",
  marketing: "attract",
  "client acquisition": "attract",
  acquisition: "attract",
  growth: "retain",
  retention: "retain",
  sales: "sell",
  closing: "sell",
  qualification: "sell",
  delivery: "deliver",
  "client management": "deliver",
  freelancing: "deliver",
  retain: "retain",
};

export function sortArticles(articles: ArticleEntry[]) {
  return [...articles].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function getArticleStageSlug(article: ArticleEntry): ArticleStageSlug {
  const override = stageOverrides[article.id];
  if (override) return override;

  const category = article.data.category.trim().toLowerCase();
  const categoryStage = categoryStages[category];
  if (categoryStage) return categoryStage;

  const tags = article.data.tags.map((tag) => tag.toLowerCase());
  if (tags.some((tag) => ["retainer", "retention", "recurring-revenue", "repeat-revenue"].includes(tag))) return "retain";
  if (tags.some((tag) => ["delivery", "client-management", "change-control", "scope-creep", "onboarding", "qa"].includes(tag))) return "deliver";
  if (tags.some((tag) => ["sales", "closing", "proposal", "proposals", "objections", "discovery"].includes(tag))) return "sell";
  if (tags.some((tag) => ["client-acquisition", "prospecting", "pipeline", "outreach", "marketing", "referrals", "agency-partnerships"].includes(tag))) return "attract";
  if (tags.some((tag) => ["pricing", "project-pricing", "payment-terms"].includes(tag))) return "price";
  if (tags.some((tag) => ["positioning", "offers", "productization", "productize", "niche"].includes(tag))) return "define";

  return "deliver";
}

export function getArticleStage(article: ArticleEntry) {
  return articleTopics.find((topic) => topic.slug === getArticleStageSlug(article)) ?? articleTopics[4];
}

export function articleMatchesTopic(article: ArticleEntry, topic: ArticleTopic) {
  return getArticleStageSlug(article) === topic.slug;
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
