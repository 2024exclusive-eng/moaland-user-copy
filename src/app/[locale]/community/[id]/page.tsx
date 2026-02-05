"use client";

import { Trans } from "@lingui/react/macro";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/api/content";
import { getLocalizedContent } from "@/lib/localized-content";
import { useNotice } from "@/shared/hooks/use-content";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default function CommunityDetailPage(props: PageProps) {
  const params = use(props.params);
  const router = useLocalizedNavigation();
  const noticeId = parseInt(params.id, 10);
  const { notice, isLoading, isError } = useNotice(noticeId);

  return (
    <div className="container mx-auto md:px-4">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="h-[60px] flex items-center justify-between px-[21px] py-[16px] border-b border-[#e5e7eb]">
          <Link
            href={`/${params.locale}/community`}
            className="flex items-center gap-[12px] hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="size-6" />
            <span className="text-[16px] font-semibold text-black">
              <Trans>목록으로</Trans>
            </span>
          </Link>
          <button
            onClick={() => router.push("/search")}
            className="p-2 hover:bg-gray-100 rounded-full -mr-2"
          >
            <Search className="w-5 h-5 text-[#111827]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8">
        {/* Sidebar - Desktop Only */}
        <div className="hidden md:block col-span-2 pt-10 border-r border-[#e5e7eb]">
          <h1 className="text-[#111827] text-2xl font-bold">
            <Trans>커뮤니티</Trans>
          </h1>

          <div className="pl-3 mt-5">
            <Link
              href={`/${params.locale}/community`}
              className="text-lg text-[#111827] font-semibold"
            >
              <Trans>공지사항</Trans>
            </Link>
            <Link
              href={`/${params.locale}/community`}
              className="text-lg mt-3 block text-[#9CA3AF]"
            >
              <Trans>이벤트</Trans>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 min-h-[60vh] md:border-l border-[#e5e7eb] md:pl-10 pt-[20px] md:py-10 pl-[21px] pr-0 md:px-0 flex flex-col gap-[20px] md:gap-5">
          {/* Back Button - Desktop Only */}
          <Link
            href={`/${params.locale}/community`}
            className="hidden md:flex items-center gap-2 w-fit hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="size-6" />
            <span className="text-sm font-semibold text-[#111827] leading-[1.7]">
              <Trans>목록으로</Trans>
            </span>
          </Link>

          {isLoading ? (
            <>
              <div className="flex flex-col gap-[2px]">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="h-px bg-[#e5e7eb] w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </>
          ) : isError || !notice ? (
            <div className="text-center py-10 text-[#9CA3AF] text-sm">
              <Trans>공지사항을 찾을 수 없습니다.</Trans>
            </div>
          ) : (
            <>
              {/* Title and Date */}
              <div className="flex flex-col gap-[2px]">
                <h1 className="text-[18px] md:text-lg font-semibold text-[#111827] leading-[1.5]">
                  {getLocalizedContent(
                    notice.title,
                    notice.titleCn,
                    params.locale,
                  )}
                </h1>
                <p className="text-[14px] text-[#4b5563] leading-[1.7]">
                  {formatDate(notice.created)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e5e7eb] w-full" />

              {/* Content */}
              <div
                className="text-[14px] text-[#4b5563] leading-[1.7] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: getLocalizedContent(
                    notice.contents,
                    notice.contentsCn,
                    params.locale,
                  ).replaceAll("\n", "<br />"),
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
