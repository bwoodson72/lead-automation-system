export type BundleProgressionDefinition = {
  slug: string;
  step: string;
  stage: string;
  title: string;
  outcome: string;
  productSlugs: string[];
};

export type BundleRecommendation = BundleProgressionDefinition & {
  bridge: string;
};

export const bundleProgression: BundleProgressionDefinition[] = [
  {
    slug: "freelancer-starter-bundle",
    step: "01",
    stage: "Foundation",
    title: "Freelancer Starter Bundle",
    outcome: "Define what you sell, set pricing you can defend, and make the value of the work easier for buyers to understand before you add more acquisition tactics.",
    productSlugs: [
      "productize-your-dev-skills",
      "web-developer-pricing-system",
      "marketing-for-builders",
    ],
  },
  {
    slug: "client-acquisition-bundle",
    step: "02",
    stage: "Acquisition",
    title: "Client Acquisition Bundle",
    outcome: "Create more than one dependable path to qualified opportunities by connecting buyer-facing marketing, direct acquisition, and agency partnerships.",
    productSlugs: [
      "marketing-for-builders",
      "client-acquisition-without-upwork",
      "agency-partnership-playbook",
    ],
  },
  {
    slug: "freelancer-sales-system",
    step: "03",
    stage: "Sales & retention",
    title: "Freelancer Sales System",
    outcome: "Turn qualified opportunities into clear decisions, carry accepted work through closing, and turn genuine continuing client needs into recurring revenue.",
    productSlugs: [
      "developer-sales-playbook",
      "developer-proposal-closing-kit",
      "freelancer-retainer-system",
    ],
  },
  {
    slug: "freelance-developer-business-system",
    step: "04",
    stage: "Complete business",
    title: "Freelance Developer Business System",
    outcome: "Pair the integrated Launch Kit with the focused specialist systems so you have both the complete operating map and deeper guidance for the major commercial bottlenecks.",
    productSlugs: [
      "freelance-developer-launch-kit",
      "productize-your-dev-skills",
      "web-developer-pricing-system",
      "marketing-for-builders",
      "client-acquisition-without-upwork",
      "developer-sales-playbook",
      "developer-proposal-closing-kit",
      "agency-partnership-playbook",
      "freelancer-retainer-system",
    ],
  },
  {
    slug: "independent-saas-founder-system",
    step: "05",
    stage: "SaaS",
    title: "Independent SaaS Founder System",
    outcome: "Make the expensive SaaS mistakes cheaper and the useful customer signals easier to see. Move from validation to a bounded launch, early paying customers, activation, and marketing shaped by what real buyers actually do.",
    productSlugs: [
      "saas-validation-before-you-build",
      "micro-saas-launch-system",
      "the-first-10-saas-customers",
      "marketing-for-builders",
    ],
  },
  {
    slug: "complete-builder-business-library",
    step: "06",
    stage: "Library",
    title: "Complete Builder Business Library",
    outcome: "Keep the business knowledge you need as the work expands from freelance services into repeat revenue, automation, products, and SaaS. One connected library instead of relearning the commercial side every time the business changes shape.",
    productSlugs: [],
  },
];

const recommendationByProduct: Record<string, { bundleSlug: string; bridge: string }> = {
  "productize-your-dev-skills": {
    bundleSlug: "freelancer-starter-bundle",
    bridge: "You are defining what the business sells. The Starter Bundle connects that decision to pricing and buyer-facing marketing so the foundation works as one system.",
  },
  "web-developer-pricing-system": {
    bundleSlug: "freelancer-starter-bundle",
    bridge: "Pricing gets easier to defend when the offer is clear and the value is visible. The Starter Bundle connects all three decisions.",
  },
  "marketing-for-builders": {
    bundleSlug: "freelancer-starter-bundle",
    bridge: "Marketing works better when the offer and pricing behind it are already deliberate. The Starter Bundle connects those foundation decisions.",
  },
  "client-acquisition-without-upwork": {
    bundleSlug: "client-acquisition-bundle",
    bridge: "Direct acquisition is one channel. The Client Acquisition Bundle adds the marketing and agency-partnership systems that give you more than one way to keep qualified opportunities coming.",
  },
  "agency-partnership-playbook": {
    bundleSlug: "client-acquisition-bundle",
    bridge: "Agency relationships are strongest as one acquisition channel inside a broader pipeline. The Client Acquisition Bundle connects partnerships to your marketing and direct acquisition systems.",
  },
  "developer-sales-playbook": {
    bundleSlug: "freelancer-sales-system",
    bridge: "A good sales conversation still needs a clean path through proposal, closing, and continuing client value. The Freelancer Sales System connects that entire stage.",
  },
  "developer-proposal-closing-kit": {
    bundleSlug: "freelancer-sales-system",
    bridge: "A proposal works best when the sales process before it and the recurring-value decision after delivery are connected. The Freelancer Sales System joins those pieces.",
  },
  "freelancer-retainer-system": {
    bundleSlug: "freelancer-sales-system",
    bridge: "Recurring revenue starts before the project ends. The Freelancer Sales System connects qualification, closing, and continuing client value instead of treating the retainer as an isolated add-on.",
  },
  "freelance-developer-launch-kit": {
    bundleSlug: "freelance-developer-business-system",
    bridge: "The Launch Kit gives you the integrated operating system. The complete Business System adds the focused specialist guides when you want to go deeper at each major stage.",
  },
};

export const getBundleProgressionDefinition = (slug: string) =>
  bundleProgression.find((bundle) => bundle.slug === slug);

export const getBundleRecommendation = (productSlug: string): BundleRecommendation | undefined => {
  const recommendation = recommendationByProduct[productSlug];
  if (!recommendation) return undefined;

  const bundle = getBundleProgressionDefinition(recommendation.bundleSlug);
  return bundle ? { ...bundle, bridge: recommendation.bridge } : undefined;
};
