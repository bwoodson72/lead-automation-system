import type { ArticleEntry } from "@/lib/articleTopics";
import { getArticleStageSlug } from "@/lib/articleTopics";

export type ArticleNextStep = {
  eyebrow: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function getArticleNextStep(article: ArticleEntry): ArticleNextStep {
  const stage = getArticleStageSlug(article);
  const id = article.id;

  if (stage === "define") {
    return {
      eyebrow: "Take the next step",
      title: "Turn the idea into an offer clients can understand.",
      body: "Productize Your Dev Skills takes this part of the business further, from broad technical capability to a clear service with boundaries a buyer can understand.",
      primary: { label: "See Productize Your Dev Skills", href: "/products/productize-your-dev-skills/" },
      secondary: { label: "Find where to start", href: "/start/" },
    };
  }

  if (stage === "price") {
    return {
      eyebrow: "Take the next step",
      title: "Build a pricing system you can use on the next project.",
      body: "The Web Developer Pricing System goes beyond one pricing question and gives you a repeatable way to work out what a project must cover, what the uncertainty changes, and what price and terms make sense.",
      primary: { label: "See the Pricing System", href: "/products/web-developer-pricing-system/" },
      secondary: { label: "Find where to start", href: "/start/" },
    };
  }

  if (stage === "attract") {
    if (id.includes("agenc")) {
      return {
        eyebrow: "Take the next step",
        title: "Turn agency work into a channel you can manage.",
        body: "The Agency Partnership Playbook goes deeper on finding, qualifying, testing, and managing agency relationships without letting one partner control your income.",
        primary: { label: "See the Agency Partnership Playbook", href: "/products/agency-partnership-playbook/" },
        secondary: { label: "Get the Free Quickstart", href: "/free/" },
      };
    }

    if (id.includes("case-study") || id.includes("market-yourself")) {
      return {
        eyebrow: "Take the next step",
        title: "Build the message around the work.",
        body: "Marketing for Builders takes this further by helping you turn what you do into a marketing argument buyers can understand across your site, proof, outreach, and other channels.",
        primary: { label: "See Marketing for Builders", href: "/products/marketing-for-builders/" },
        secondary: { label: "Get the Free Quickstart", href: "/free/" },
      };
    }

    return {
      eyebrow: "Take the next step",
      title: "Build a client pipeline you can keep moving.",
      body: "Client Acquisition Without Upwork takes the next step from one acquisition question to a repeatable pipeline for finding, tracking, and moving real opportunities while you are busy delivering.",
      primary: { label: "See Client Acquisition Without Upwork", href: "/products/client-acquisition-without-upwork/" },
      secondary: { label: "Get the Free Quickstart", href: "/free/" },
    };
  }

  if (stage === "sell") {
    if (id.includes("proposal") || id.includes("paid-discovery")) {
      return {
        eyebrow: "Take the next step",
        title: "Carry the deal from understanding to signed, paid work.",
        body: "The Developer Proposal & Closing Kit takes this further by carrying what you learned before the proposal into the commercial decision, agreement, payment, and project start.",
        primary: { label: "See the Proposal & Closing Kit", href: "/products/developer-proposal-closing-kit/" },
        secondary: { label: "Find where to start", href: "/start/" },
      };
    }

    return {
      eyebrow: "Take the next step",
      title: "Make the sales conversation lead somewhere clear.",
      body: "The Developer Sales Playbook goes deeper on understanding the opportunity, diagnosing what matters, and ending serious sales conversations with a clear decision and next step.",
      primary: { label: "See the Developer Sales Playbook", href: "/products/developer-sales-playbook/" },
      secondary: { label: "Find where to start", href: "/start/" },
    };
  }

  if (stage === "retain") {
    return {
      eyebrow: "Take the next step",
      title: "Turn legitimate ongoing demand into recurring revenue.",
      body: "The Freelancer Retainer System takes post-launch demand further by helping you define the service, price the full obligation, protect your capacity, and keep the relationship commercially healthy.",
      primary: { label: "See the Freelancer Retainer System", href: "/products/freelancer-retainer-system/" },
      secondary: { label: "Find where to start", href: "/start/" },
    };
  }

  return {
    eyebrow: "What needs work next?",
    title: "Fix the project problem without guessing at the next business problem.",
    body: "Start Here helps you diagnose the part of the freelance business that is actually holding you back and routes you to the smallest system that fits.",
    primary: { label: "Find Where to Start", href: "/start/" },
  };
}
