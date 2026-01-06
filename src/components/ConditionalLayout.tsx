"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

import { FloatingInquiryButton } from "@/components/FloatingInquiryButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileNavigation } from "@/components/MobileNavigation";

export function ConditionalLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // Pages where we should hide mobile header, footer, and nav
  const hideMobileLayoutPages = [
    "login",
    "register",
    "forgot-password",
    "profile",
  ];

  // Pages where we should hide only the mobile header (but keep footer and nav)
  const hideMobileHeaderPages = [
    "community",
    "campaigns",
    "support",
    "my-campaign",
  ];

  // Pages where we should hide footer but show nav
  const hideFooterPages = ["my-campaign"];

  // Pages where we should hide mobile nav
  const hideMobileNavPages = [
    "login",
    "register",
    "forgot-password",
    "profile",
  ];

  // Check if current path matches any of the excluded pages
  const shouldHideMobileLayout = hideMobileLayoutPages.some((page) =>
    pathname.includes(page)
  );

  const shouldHideMobileHeader =
    shouldHideMobileLayout ||
    hideMobileHeaderPages.some((page) => pathname.includes(page));

  const shouldHideFooter =
    shouldHideMobileLayout ||
    hideFooterPages.some((page) => pathname.includes(page));

  const shouldHideMobileNav = hideMobileNavPages.some((page) =>
    pathname.includes(page)
  );

  return (
    <>
      <Header shouldHideMobile={shouldHideMobileHeader} />
      <div>{children}</div>
      <Footer shouldHideMobile={shouldHideFooter} />
      <FloatingInquiryButton />
      {!shouldHideMobileNav && <MobileNavigation />}
    </>
  );
}
