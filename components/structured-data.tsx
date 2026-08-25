import Script from "next/script";

interface ArticleSchemaProps {
  title: string;
  description: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  url: string;
}

interface FAQSchemaProps {
  question: string;
  answer: string;
}

interface WebSiteSchemaProps {
  name: string;
  url: string;
  description: string;
}

export function ArticleSchema({
  title,
  description,
  author = "Hunter Alpha Hub",
  publishedAt,
  updatedAt,
  image,
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Organization",
      name: author,
    },
    datePublished: publishedAt,
    dateModified: updatedAt,
    image: image,
    url: url,
  };

  return (
    <Script
      id={`article-schema-${title.replace(/\s+/g, "-").toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: FAQSchemaProps[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema({ name, url, description }: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name,
    url: url,
    description: description,
    publisher: {
      "@type": "Organization",
      name: "Hunter Alpha Hub",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbListSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// GEO: Table schema for comparison/spec tables — lets AI extract tabular data directly
export function TableSchema({
  about,
  tableId,
  caption,
}: {
  about: string;
  tableId: string;
  caption: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Table",
    about: about,
    identifier: tableId,
    caption: caption,
  };
  return (
    <Script
      id={`table-schema-${tableId}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// GEO: Speakable for TL;DR / key summary targeting voice and AI overview
export function SpeakableSchema({ url, cssSelector }: { url: string; cssSelector: string[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector,
    },
  };
  return (
    <Script
      id="speakable-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// GEO: ItemList for tracker index — used on homepage
export function ItemListSchema({ items }: { items: { name: string; url: string; description?: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  };
  return (
    <Script
      id="itemlist-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
