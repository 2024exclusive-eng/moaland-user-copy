"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/api/content";
import { useNotice } from "@/shared/hooks/use-content";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default function CommunityDetailPage(props: PageProps) {
  const params = use(props.params);
  const noticeId = parseInt(params.id, 10);
  const { notice, isLoading, isError } = useNotice(noticeId);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 pt-10 border-r border-[#e5e7eb]">
          <h1 className="text-[#111827] text-2xl font-bold">커뮤니티</h1>

          <div className="pl-3 mt-5">
            <Link
              href={`/${params.locale}/community`}
              className="text-lg text-[#111827] font-semibold"
            >
              공지사항
            </Link>
            <Link
              href={`/${params.locale}/community`}
              className="text-lg mt-3 block text-[#9CA3AF]"
            >
              이벤트
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 min-h-[65vh] md:border-l border-[#e5e7eb] md:pl-10 py-10 flex flex-col gap-5">
          {/* Back Button */}
          <Link
            href={`/${params.locale}/community`}
            className="flex items-center gap-2 w-fit hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="size-6" />
            <span className="text-sm font-semibold text-[#111827] leading-[1.7]">
              목록으로
            </span>
          </Link>

          {isLoading ? (
            <>
              <div className="flex flex-col gap-2">
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
            <div className="text-center py-10 text-[#9CA3AF]">
              공지사항을 찾을 수 없습니다.
            </div>
          ) : (
            <>
              {/* Title and Date */}
              <div className="flex flex-col gap-0.5">
                <h1 className="text-lg font-semibold text-[#111827] leading-normal">
                  {notice.title}
                </h1>
                <p className="text-sm text-[#4b5563] leading-[1.7]">
                  {formatDate(notice.created)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e5e7eb] w-full" />

              {/* Content */}
              <div
                className="text-sm text-[#4b5563] leading-[1.7] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: notice.contents }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
