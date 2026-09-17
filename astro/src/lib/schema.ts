/**
 * JSON-LD builders, mirrored 1:1 from the Next app's `components/structured-data.tsx`
 * so the migration does not change a single byte of what crawlers already read.
 * Shape parity is the contract; if you edit one, edit both until Phase 4.
 */
export const SITE = "https://www.hunteralphahub.com";
export const PUBLISHER = "OpenRouter Model Hub";
/**
 * The title suffix the live Next app appends via its metadata template. The site
 * identity is "OpenRouter Model Hub" (ADR-0004) even though the brand lockup
 * reads HunterAlphaHub, so the suffix has to stay exactly this until Phase 4.
 */
export const SITE_NAME = "OpenRouter Model Hub";

export function articleSchema(input: {
  title: string;
  description: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  url: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    author: { "@type": "Organization", name: input.author ?? PUBLISHER },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    image: input.image,
    url: input.url,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListSchema(name: string, items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/** Blog hub schema — mirrors the live /blog page exactly. */
export function blogSchema(input: { name: string; url: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: input.name,
    url: input.url,
    description: input.description,
    publisher: { "@type": "Organization", name: PUBLISHER },
  };
}

/** Homepage schema — mirrors the live / page's WebSite + publisher pair. */
export function webSiteSchema(input: { name: string; url: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    description: input.description,
    publisher: { "@type": "Organization", name: PUBLISHER },
  };
}

/**
 * WebApplication schema for the pricing calculator.
 *
 * One field differs from the live version on purpose: it says
 * "Requires JavaScript". The Astro build server-renders the default estimate —
 * the live page ships the form controls and computes every number in the
 * browser, so the page had no cost figures in its HTML at all. Since the new
 * one does work without JavaScript, claiming otherwise would be a false
 * statement in structured data, which is worse than a difference.
 */
export function webApplicationSchema(input: { name: string; url: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    url: input.url,
    description: input.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Serves a default monthly-cost estimate without JavaScript; JavaScript recalculates as you change the inputs.",
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
    },
  };
}
