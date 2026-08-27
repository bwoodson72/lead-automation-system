export const siteConfig = {
  name: "Developer Business Lab",
  description: "Business systems for independent developers who need to find customers, sell valuable work, validate products, and build a more repeatable independent business.",
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
