"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Globe, Search } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { use, useState } from "react";

import { Pagination } from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { WeChatQRDialog } from "@/components/WeChatQRDialog";
import { formatDate } from "@/lib/api/content";
import { getLocalizedContent } from "@/lib/localized-content";
import { useEvents, useNotices } from "@/shared/hooks/use-content";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function Page(props: PageProps) {
  const { _ } = useLingui();
  const params = use(props.params);
  const router = useLocalizedNavigation();
  const pn = usePathname();
  const nextRouter = useRouter();

  // Get locale from pathname
  const locale = pn.split("/")[1] || "ko";

  const localeLabels: Record<string, string> = {
    ko: "KO",
    zh: "CN",
    en: "EN",
  };

  const handleLocaleChange = (newLocale: string) => {
    // Replace the locale in the current path
    const pathWithoutLocale = pn.replace(/^\/[a-z]{2}/, "");
    nextRouter.push(`/${newLocale}${pathWithoutLocale || "/"}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [qrOpen, setQrOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"notice" | "event">(
    "notice",
  );

  // Always fetch notices
  const {
    notices,
    paging: noticePaging,
    isLoading: isNoticesLoading,
  } = useNotices(currentPage, 10);

  // Only fetch events when event tab is active (lazy loading)
  const {
    events,
    paging: eventPaging,
    isLoading: isEventsLoading,
  } = useEvents(activeCategory === "event" ? eventPage : null, 10);

  const handleCategoryChange = (category: "notice" | "event") => {
    setActiveCategory(category);
    if (category === "notice") {
      setCurrentPage(1);
    } else {
      setEventPage(1);
    }
  };

  return (
    <div className="min-h-[60vh] container mx-auto">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="h-[60px] flex items-center justify-between px-[21px] border-b border-[#e5e7eb]">
          <h1 className="text-black text-[18px] font-bold">
            {_(msg`커뮤니티`)}
          </h1>
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-[#4b5563] hover:text-gray-900 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {localeLabels[locale] || "KO"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-[#e5e7eb] rounded-[6px] p-1 min-w-[80px]"
              >
                <DropdownMenuItem
                  onClick={() => handleLocaleChange("ko")}
                  className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                    locale === "ko"
                      ? "text-[#EA3A50] font-semibold"
                      : "text-[#374151]"
                  }`}
                >
                  <Trans>한국어 (KO)</Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLocaleChange("zh")}
                  className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                    locale === "zh"
                      ? "text-[#EA3A50] font-semibold"
                      : "text-[#374151]"
                  }`}
                >
                  <Trans>中文 (CN)</Trans>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => router.push("/search")}
              className="p-2 hover:bg-gray-100 rounded-full -mr-2"
            >
              <Search className="w-5 h-5 text-[#111827]" />
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex h-[44px] border-b px-4 border-[#e5e7eb]">
          <button
            onClick={() => handleCategoryChange("notice")}
            className={`flex-1 flex items-center justify-center text-[16px] transition-colors relative ${
              activeCategory === "notice"
                ? "text-black font-bold"
                : "text-[#9da0a8] font-medium"
            }`}
          >
            {_(msg`공지사항`)}
            {activeCategory === "notice" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
            )}
          </button>
          <button
            onClick={() => handleCategoryChange("event")}
            className={`flex-1 flex items-center justify-center text-[16px] transition-colors relative ${
              activeCategory === "event"
                ? "text-black font-bold"
                : "text-[#9da0a8] font-medium"
            }`}
          >
            {_(msg`이벤트`)}
            {activeCategory === "event" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
            )}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-8">
        {/* Sidebar - Desktop Only */}
        <div className="hidden md:block col-span-2 md:border-r border-[#e5e7eb]">
          <div className="sticky top-0 pt-10">
            <h1 className="text-[#111827] text-2xl font-bold">
              {_(msg`커뮤니티`)}
            </h1>

            <div className="pl-3 mt-5">
              <button
                onClick={() => handleCategoryChange("notice")}
                className={`text-lg transition-colors ${
                  activeCategory === "notice"
                    ? "text-[#111827] font-semibold"
                    : "text-[#9CA3AF]"
                }`}
              >
                {_(msg`공지사항`)}
              </button>
              <button
                onClick={() => handleCategoryChange("event")}
                className={`text-lg mt-3 block transition-colors ${
                  activeCategory === "event"
                    ? "font-semibold text-[#111827]"
                    : "text-[#9CA3AF]"
                }`}
              >
                {_(msg`이벤트`)}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 md:pl-10 pt-[20px] md:py-10 px-[21px] md:px-0 min-h-[60vh] flex flex-col gap-[20px] md:gap-5">
          <h2 className="hidden md:block text-xl font-bold text-[#111827]">
            {activeCategory === "notice" ? _(msg`공지사항`) : _(msg`이벤트`)}
          </h2>

          {/* Notice List */}
          {activeCategory === "notice" && (
            <>
              <div className="flex flex-col">
                {isNoticesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="border-b border-[#e5e7eb] px-[12px] md:px-3 py-4 md:py-4 flex items-center"
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <Skeleton className="h-5 flex-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  ))
                ) : notices.length === 0 ? (
                  <div className="text-center py-10 text-[#9CA3AF] text-sm">
                    {_(msg`등록된 공지사항이 없습니다.`)}
                  </div>
                ) : (
                  notices.map((notice) => (
                    <Link
                      key={notice.id}
                      href={`/${params.locale}/community/${notice.id}`}
                      className="border-b border-[#e5e7eb] px-[12px] md:px-3 py-[16px] md:py-4 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 flex items-center justify-between gap-4">
                        <p className="flex-1 font-semibold text-[#111827] text-[14px] leading-[1.7]">
                          {getLocalizedContent(
                            notice.title,
                            notice.titleCn,
                            locale,
                          )}
                        </p>
                        <p className="text-[#4b5563] text-[14px] leading-[1.7] whitespace-nowrap">
                          {formatDate(notice.created)}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Pagination */}
              {noticePaging && noticePaging.totalPages > 1 && (
                <div className="flex justify-center pb-4 md:pb-0">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={noticePaging.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}

          {/* Event List */}
          {activeCategory === "event" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {isEventsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="rounded-lg min-h-45" />
                  ))
                ) : events.length === 0 ? (
                  <div className="col-span-full text-center py-10 text-[#9CA3AF] text-sm">
                    {_(msg`진행 중인 이벤트가 없습니다.`)}
                  </div>
                ) : (
                  events.map((event) => {
                    const eventThumbnail = event.thumbnailPath && (
                      <Image
                        src={event.thumbnailPath}
                        alt={event.name}
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="w-full h-auto transition-transform group-hover:scale-105"
                      />
                    );
                    const hasContent = !!(event.contents || event.contentsCn);
                    // wechat → QR popup; has content → on-site detail page; else → external URL
                    if (event.linkType === "wechat") {
                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setQrOpen(true)}
                          className="rounded-lg overflow-hidden group cursor-pointer"
                        >
                          {eventThumbnail}
                        </button>
                      );
                    }
                    if (hasContent) {
                      return (
                        <Link
                          key={event.id}
                          href={`/${locale}/community/event/${event.id}`}
                          className="rounded-lg overflow-hidden group"
                        >
                          {eventThumbnail}
                        </Link>
                      );
                    }
                    return (
                      <a
                        key={event.id}
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg overflow-hidden group"
                      >
                        {eventThumbnail}
                      </a>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {eventPaging && eventPaging.totalPages > 1 && (
                <div className="flex justify-center pb-4 md:pb-0">
                  <Pagination
                    currentPage={eventPage}
                    totalPages={eventPaging.totalPages}
                    onPageChange={setEventPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <WeChatQRDialog open={qrOpen} onOpenChange={setQrOpen} />
    </div>
  );
}
