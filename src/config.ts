export const siteConfig = {
  name: "Developer Business Lab",
  description: "Business systems for capable independent developers who want steadier client pipelines, prices they can defend, stronger sales, and a business that does not restart from zero every month.",
  url: "https://www.developerbusinesslab.com",
  supportEmail: import.meta.env.PUBLIC_SUPPORT_EMAIL || "brian@brianwoodson.dev",
  analytics: {
    googleAnalyticsMeasurementId: "G-YQ65JDDLF8",
  },
  kit: {
    quickstartFormUid: import.meta.env.PUBLIC_KIT_QUICKSTART_FORM_UID || "",
    updatesFormUid: import.meta.env.PUBLIC_KIT_UPDATES_FORM_UID || "",
    // Public identifiers from the Kit form HTML supplied by the site owner.
    newsletterFormId: import.meta.env.PUBLIC_KIT_NEWSLETTER_FORM_ID || "10050944",
    newsletterFormUid: import.meta.env.PUBLIC_KIT_NEWSLETTER_FORM_UID || "46a13ded52",
  },
  commerce: { provider: "lemonsqueezy" as const, storeName: "Developer Business Lab" },
  navigation: [
    { label: "Start Here", href: "/start/" }, { label: "Products", href: "/products/" },
    { label: "Bundles", href: "/bundles/" },
    { label: "Pricing Calculator", href: "/tools/freelance-project-pricing-calculator/" },
    { label: "Articles", href: "/articles/" }, { label: "About", href: "/about/" },
  ],
};
