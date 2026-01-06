"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

import LocalizedLink from "@/components/LocalizedLink";
import { Skeleton } from "@/components/ui/skeleton";

type CategoryKey = "faq" | "usage" | "term_of_use" | "privacy";

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

export default function Page() {
  const { _ } = useLingui();
  const categoryItems = getCategoryItems(_);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="h-[60px] flex items-center px-[21px] border-b border-[#e5e7eb] bg-white">
          <h1 className="text-black text-[18px] font-bold">
            <Trans>고객센터</Trans>
          </h1>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden flex-1 bg-white px-[21px] pt-5">
        {/* Banner */}
        <LocalizedLink
          href="/support/usage"
          className="flex items-center justify-between bg-[#f9fafb] rounded-lg p-6 mb-6"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-black">
              <Trans>신규회원을 위한</Trans>
            </span>
            <span className="text-lg font-semibold text-black">
              <Trans>K-VIEWO 사용 가이드</Trans>
            </span>
          </div>
          <div className="w-[51px] h-[51px] relative">
            <Image
              src="/icons/support-mobile.svg"
              alt="Guide"
              width={51}
              height={51}
              className="object-contain"
            />
          </div>
        </LocalizedLink>

        {/* Menu Items */}
        <div className="flex flex-col">
          {categoryItems.map((item, index) => (
            <div key={item.key}>
              <LocalizedLink
                href={item.href}
                className="flex items-center justify-between py-5 px-3"
              >
                <span className="text-base font-semibold text-black">
                  {item.title}
                </span>
                <ChevronRight className="w-6 h-6 text-[#9CA3AF]" />
              </LocalizedLink>
              {index < categoryItems.length - 1 && (
                <div className="h-px bg-[#e5e7eb]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block container mx-auto px-4">
        <DesktopSupportContent />
      </div>
    </div>
  );
}

function DesktopSupportContent() {
  const { _ } = useLingui();
  const categoryItems = getCategoryItems(_);

  return (
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
                className="text-lg mt-3 block transition-colors text-[#9CA3AF] hover:text-[#111827]"
              >
                {item.title}
              </LocalizedLink>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-6 md:pl-10 py-10 flex min-h-[65vh] flex-col gap-3">
        <h2 className="text-xl font-semibold text-[#111827] leading-normal">
          <Trans>자주하는 질문</Trans>
        </h2>
        <div className="text-center py-10 text-[#9CA3AF]">
          <Trans>카테고리를 선택해주세요.</Trans>
        </div>
      </div>
    </div>
  );
}

export function SupportPageFallback() {
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
