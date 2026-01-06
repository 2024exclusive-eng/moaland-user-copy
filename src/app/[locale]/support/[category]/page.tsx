"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { type FaqType, formatDate } from "@/lib/api/content";
import { useFaqs } from "@/shared/hooks/use-content";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

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
    privacy: _(msg`개인정보 처리방침`),
  };
}

function getCategoryItems(
  _: ReturnType<typeof useLingui>["_"]
): Array<{ key: CategoryKey; title: string; href: string }> {
  return [
    { key: "faq", title: _(msg`자주하는 질문`), href: "/support/faq" },
    {
      key: "usage",
      title: _(msg`서비스 이용 가이드`),
      href: "/support/usage",
    },
    {
      key: "term_of_use",
      title: _(msg`이용약관`),
      href: "/support/term_of_use",
    },
    {
      key: "privacy",
      title: _(msg`개인정보 처리방침`),
      href: "/support/privacy",
    },
  ];
}

const validCategories: CategoryKey[] = [
  "faq",
  "usage",
  "term_of_use",
  "privacy",
];

function isValidCategory(category: string): category is CategoryKey {
  return validCategories.includes(category as CategoryKey);
}

function SupportDetailFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header Skeleton */}
      <div className="md:hidden">
        <div className="h-[60px] flex items-center gap-3 px-[21px] border-b border-[#e5e7eb] bg-white">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="h-5 flex-1 max-w-[150px] mx-auto" />
          <div className="w-6" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 px-[21px] pt-5">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SupportDetailFallback />}>
      <SupportDetailContent />
    </Suspense>
  );
}

function SupportDetailContent() {
  const { _ } = useLingui();
  const params = useParams();
  const r = useLocalizedNavigation();
  const categoryParam = params.category as string;
  const category = categoryParam;
  const categoryTitles = getCategoryTitles(_);
  const categoryItems = getCategoryItems(_);
  const faqType = categoryToFaqType[category as keyof typeof categoryToFaqType];
  const title = categoryTitles[category as keyof typeof categoryTitles];
  const { faqs, isLoading } = useFaqs(faqType);

  // Validate category
  if (!isValidCategory(categoryParam)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#9CA3AF]">
          <Trans>유효하지 않은 카테고리입니다.</Trans>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="h-[60px] flex items-center gap-3 px-[21px] border-b border-[#e5e7eb] bg-white">
          <button
            onClick={() => r.push("/support")}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-[#09121F]" />
          </button>
          <h1 className="flex-1 text-black text-base font-semibold text-center">
            {title}
          </h1>
          {/* Spacer for centering */}
          <div className="w-6" />
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden flex-1 bg-white pt-5 px-4">
        {isLoading ? (
          <div className="px-[21px] space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-10 text-[#9CA3AF]">
            <Trans>등록된 내용이 없습니다.</Trans>
          </div>
        ) : category === "faq" ? (
          <FaqAccordionMobile faqs={faqs} />
        ) : (
          <ContentListMobile faqs={faqs} />
        )}
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block container mx-auto px-4">
        <div className="grid md:grid-cols-8">
          {/* Sidebar */}
          <div className="col-span-2 md:border-r border-[#e5e7eb]">
            <div className="sticky top-10 pt-10">
              <h1 className="text-[#111827] text-2xl font-bold">
                <Trans>고객센터</Trans>
              </h1>

              <div className="pl-3 mt-5">
                {categoryItems.map((item) => (
                  <LocalizedLink
                    key={item.key}
                    href={item.href}
                    className={`text-lg mt-3 block transition-colors ${
                      category === item.key
                        ? "text-[#111827] font-semibold"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    {item.title}
                  </LocalizedLink>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-6  md:pl-10 py-10 flex min-h-[65vh] flex-col gap-3">
            <h2 className="text-xl font-semibold text-[#111827] leading-normal">
              {title}
            </h2>

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
            ) : category === "faq" ? (
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
    </div>
  );
}

interface Faq {
  id: number;
  title: string;
  answer: string;
  created: string;
}

function FaqAccordionMobile({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="flex flex-col">
            <button
              onClick={() => toggleItem(faq.id)}
              className="flex items-center gap-2 p-3 w-full text-left"
            >
              <div className="flex-1 flex flex-col">
                <span className="text-sm font-semibold text-[#111827] leading-[1.7]">
                  {faq.title}
                </span>
                <span className="text-sm text-[#4b5563] leading-[1.7]">
                  {formatDate(faq.created)}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="w-6 h-6 text-[#9CA3AF] shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#9CA3AF] shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="bg-[#f3f4f6] border-b border-[#e5e7eb] p-3">
                <div
                  className="text-sm text-[#4b5563] leading-[1.7] ck-content"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ContentListMobile({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="px-[21px] space-y-6">
      {faqs.map((faq) => (
        <div key={faq.id}>
          <div
            className="text-sm text-[#4b5563] leading-[1.7] ck-content"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
        </div>
      ))}
    </div>
  );
}
