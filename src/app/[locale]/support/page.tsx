"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { type FaqType, formatDate } from "@/lib/api/content";
import { useFaqs } from "@/shared/hooks/use-content";

type CategoryKey = "faq" | "usage" | "term_of_use" | "privacy";

const categoryToFaqType: Record<CategoryKey, FaqType> = {
  faq: "faq",
  usage: "service_guide",
  term_of_use: "terms_of_use",
  privacy: "privacy_policy",
};

function getCategoryTitles(
  _: ReturnType<typeof useLingui>["_"]
): Record<CategoryKey, string> {
  return {
    faq: _(msg`자주하는 질문`),
    usage: _(msg`서비스 이용 가이드`),
    term_of_use: _(msg`이용약관`),
    privacy: _(msg`개인정보처리방침`),
  };
}

const validCategories: CategoryKey[] = [
  "faq",
  "usage",
  "term_of_use",
  "privacy",
];

function getInitialCategory(tabParam: string | null): CategoryKey {
  if (tabParam && validCategories.includes(tabParam as CategoryKey)) {
    return tabParam as CategoryKey;
  }
  return "faq";
}

function SupportPageFallback() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        <div className="col-span-2 md:border-r border-[#e5e7eb]">
          <div className="sticky top-10 pt-10">
            <Skeleton className="h-8 w-24 mb-5" />
            <div className="pl-3 mt-5 space-y-3">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
        <div className="col-span-6 md:pl-10 py-10 flex min-h-[65vh] flex-col gap-3">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-3 py-4 border-b border-[#e5e7eb]">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SupportPageFallback />}>
      <SupportPageContent />
    </Suspense>
  );
}

function SupportPageContent() {
  const { _ } = useLingui();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Use tabParam directly to derive active category, with local override for user clicks
  const [userSelectedCategory, setUserSelectedCategory] =
    useState<CategoryKey | null>(null);

  const activeCategory = useMemo(() => {
    // If user has manually selected a category, use that
    if (userSelectedCategory !== null) {
      return userSelectedCategory;
    }
    // Otherwise, derive from URL param
    return getInitialCategory(tabParam);
  }, [userSelectedCategory, tabParam]);

  const handleCategoryChange = (category: CategoryKey) => {
    setUserSelectedCategory(category);
  };

  const faqType = categoryToFaqType[activeCategory];
  const { faqs, isLoading } = useFaqs(faqType);

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 md:border-r border-[#e5e7eb]">
          <div className="sticky top-10 pt-10">
            <h1 className="text-[#111827] text-2xl font-bold">
              <Trans>고객센터</Trans>
            </h1>

            <div className="pl-3 mt-5">
              <button
                onClick={() => handleCategoryChange("faq")}
                className={`text-lg transition-colors ${
                  activeCategory === "faq"
                    ? "text-[#111827] font-semibold"
                    : "text-[#9CA3AF]"
                }`}
              >
                <Trans>자주하는 질문</Trans>
              </button>
              <button
                onClick={() => handleCategoryChange("usage")}
                className={`text-lg mt-3 block transition-colors ${
                  activeCategory === "usage"
                    ? "font-semibold text-[#111827]"
                    : "text-[#9CA3AF]"
                }`}
              >
                <Trans>서비스 이용 가이드</Trans>
              </button>
              <button
                onClick={() => handleCategoryChange("term_of_use")}
                className={`text-lg mt-3 block transition-colors ${
                  activeCategory === "term_of_use"
                    ? "font-semibold text-[#111827]"
                    : "text-[#9CA3AF]"
                }`}
              >
                <Trans>이용약관</Trans>
              </button>
              <button
                onClick={() => handleCategoryChange("privacy")}
                className={`text-lg mt-3 block transition-colors ${
                  activeCategory === "privacy"
                    ? "font-semibold text-[#111827]"
                    : "text-[#9CA3AF]"
                }`}
              >
                <Trans>개인정보처리방침</Trans>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 md:pl-10 py-10 flex min-h-[65vh] flex-col gap-3">
          <h2 className="text-xl font-semibold text-[#111827] leading-normal">
            {getCategoryTitles(_)[activeCategory]}
          </h2>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-3 py-4 border-b border-[#e5e7eb]">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-10 text-[#9CA3AF]">
              <Trans>등록된 내용이 없습니다.</Trans>
            </div>
          ) : activeCategory === "faq" ? (
            // FAQ: Use accordion
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border-0"
                >
                  <AccordionTrigger className="px-3 py-4 hover:no-underline items-center">
                    <div className="flex flex-col items-start text-sm text-left">
                      <span className="font-semibold text-[#111827] leading-[1.7]">
                        {faq.title}
                      </span>
                      <span className="text-[#4b5563] leading-[1.7]">
                        {formatDate(faq.created)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#f3f4f6] border-b border-[#e5e7eb] px-3 py-4">
                    <div
                      className="text-sm text-[#4b5563] leading-[1.7] ck-content"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            // Other tabs: Render HTML directly
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <div
                    className="text-sm text-[#4b5563] leading-[1.7] ck-content"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
