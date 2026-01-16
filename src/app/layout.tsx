import "./globals.css";

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kviewo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "K-Viewo",
    template: "%s | K-Viewo",
  },
  description:
    "Connect with brands and grow your creator career. K-Viewo is the leading platform for creator campaigns and collaborations.",
  keywords: [
    "creator",
    "influencer",
    "campaign",
    "brand collaboration",
    "content creator",
    "marketing",
    "K-Viewo",
  ],
  authors: [{ name: "K-Viewo" }],
  creator: "K-Viewo",
  publisher: "K-Viewo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR", "zh_CN"],
    url: SITE_URL,
    siteName: "K-Viewo",
    title: "K-Viewo - Creator Campaign Platform",
    description:
      "Connect with brands and grow your creator career. K-Viewo is the leading platform for creator campaigns and collaborations.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "K-Viewo - Creator Campaign Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Viewo - Creator Campaign Platform",
    description:
      "Connect with brands and grow your creator career. K-Viewo is the leading platform for creator campaigns and collaborations.",
    images: ["/og.png"],
    creator: "@kviewo",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en`,
      ko: `${SITE_URL}/ko`,
      zh: `${SITE_URL}/zh`,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#242424" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  // Extract locale from URL for lang attribute
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const localeMatch = pathname.match(/^\/(en|ko|zh)/);
  const locale = localeMatch ? localeMatch[1] : "en";

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={`antialiased`}>
        <main>{children} </main>
      </body>
    </html>
  );
}
