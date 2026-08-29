export const siteConfig = {
  name: "Developer Business Lab",
  description: "Business systems for capable independent developers who want steadier client pipelines, prices they can defend, stronger sales, and a business that does not restart from zero every month.",
  url: import.meta.env.SITE_URL || "",
  supportEmail: import.meta.env.PUBLIC_SUPPORT_EMAIL || "",
  kit: { quickstartFormUid: import.meta.env.PUBLIC_KIT_QUICKSTART_FORM_UID || "", updatesFormUid: import.meta.env.PUBLIC_KIT_UPDATES_FORM_UID || "" },
  commerce: { provider: "lemonsqueezy" as const, storeName: "Developer Business Lab" },
  navigation: [
    { label: "Start Here", href: "/start/" }, { label: "Products", href: "/products/" },
    { label: "AI Prospecting", href: "/products/ai-prospecting-system/" }, { label: "Bundles", href: "/bundles/" },
    { label: "Articles", href: "/articles/" }, { label: "About", href: "/about/" },
  ],
};
