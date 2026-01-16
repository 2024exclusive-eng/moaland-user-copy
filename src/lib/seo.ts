import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kviewo.com";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  locale?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generate SEO metadata for pages
 * @param props SEO configuration
 * @returns Next.js Metadata object
 */
export function generateSEO({
  title,
  description,
  path = "",
  locale = "en",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const imageUrl = image || "/logo.png";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ko: `${SITE_URL}/ko${path}`,
        zh: `${SITE_URL}/zh${path}`,
      },
    },
    openGraph: {
      title: title || "K-Viewo - Creator Campaign Platform",
      description:
        description ||
        "Connect with brands and grow your creator career. K-Viewo is the leading platform for creator campaigns and collaborations.",
      url,
      siteName: "K-Viewo",
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : "en_US",
      type,
      images: [
        {
          url: imageUrl,
          alt: title || "K-Viewo",
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: title || "K-Viewo - Creator Campaign Platform",
      description:
        description ||
        "Connect with brands and grow your creator career. K-Viewo is the leading platform for creator campaigns and collaborations.",
      images: [imageUrl],
    },
  };
}

/**
 * Generate JSON-LD structured data for organizations
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "K-Viewo",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "K-Viewo is the leading platform for creator campaigns and collaborations.",
    sameAs: [
      // Add your social media URLs here
      // "https://twitter.com/kviewo",
      // "https://www.facebook.com/kviewo",
      // "https://www.instagram.com/kviewo",
    ],
  };
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "K-Viewo",
    url: SITE_URL,
    description: "Creator Campaign Platform",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
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
