export const siteConfig = {
  name: "Lead Automation System",
  description:
    "Implementation guides for building evidence-first client acquisition systems for freelance web developers.",
  url: import.meta.env.SITE_URL || "",
  supportEmail: import.meta.env.PUBLIC_SUPPORT_EMAIL || "",
  commerce: { provider: "lemonsqueezy" as const },
  navigation: [
    { label: "Products", href: "/products/" },
    { label: "Compare", href: "/compare/" },
    { label: "How It Works", href: "/how-it-works/" },
    { label: "Articles", href: "/articles/" },
    { label: "FAQ", href: "/faq/" },
  ],
};
