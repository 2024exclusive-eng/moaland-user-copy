"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/api/content";
import { useEvents, useNotices } from "@/shared/hooks/use-content";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<"notice" | "event">(
    "notice"
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
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 md:border-r border-[#e5e7eb]">
          <div className="sticky top-0 pt-10">
            <h1 className="text-[#111827] text-2xl font-bold">커뮤니티</h1>

            <div className="pl-3 mt-5">
              <button
                onClick={() => handleCategoryChange("notice")}
                className={`text-lg transition-colors ${
                  activeCategory === "notice"
                    ? "text-[#111827] font-semibold"
                    : "text-[#9CA3AF]"
                }`}
              >
                공지사항
              </button>
              <button
                onClick={() => handleCategoryChange("event")}
                className={`text-lg mt-3 block transition-colors ${
                  activeCategory === "event"
                    ? "font-semibold text-[#111827]"
                    : "text-[#9CA3AF]"
                }`}
              >
                이벤트
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 md:pl-10 py-10 min-h-[65vh] flex flex-col gap-5">
          <h2 className="text-xl font-bold text-[#111827]">
            {activeCategory === "notice" ? "공지사항" : "이벤트"}
          </h2>

          {/* Notice List */}
          {activeCategory === "notice" && (
            <>
              <div className="flex flex-col">
                {isNoticesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="border-b border-[#e5e7eb] px-3 py-4 flex items-center"
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <Skeleton className="h-5 flex-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  ))
                ) : notices.length === 0 ? (
                  <div className="text-center py-10 text-[#9CA3AF]">
                    등록된 공지사항이 없습니다.
                  </div>
                ) : (
                  notices.map((notice) => (
                    <Link
                      key={notice.id}
                      href={`/${params.locale}/community/${notice.id}`}
                      className="border-b border-[#e5e7eb] px-3 py-4 flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 flex items-center text-sm">
                        <p className="flex-1 font-semibold text-[#111827] leading-[1.7]">
                          {notice.title}
                        </p>
                        <p className="text-[#4b5563] leading-[1.7]">
                          {formatDate(notice.created)}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Pagination */}
              {noticePaging && noticePaging.totalPages > 1 && (
                <div className="flex justify-center">
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
              <div className="grid md:grid-cols-2 gap-5">
                {isEventsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="rounded-lg min-h-45" />
                  ))
                ) : events.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-[#9CA3AF]">
                    진행 중인 이벤트가 없습니다.
                  </div>
                ) : (
                  events.map((event) => (
                    <a
                      key={event.id}
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative bg-gray-900 rounded-lg min-h-45 flex flex-col justify-end overflow-hidden group"
                    >
                      {event.thumbnailPath && (
                        <Image
                          src={event.thumbnailPath}
                          alt={event.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="relative z-10 p-5">
                        <h3 className="text-white text-xl font-bold truncate">
                          {event.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {formatDate(event.created)}
                        </p>
                      </div>
                    </a>
                  ))
                )}
              </div>

              {/* Pagination */}
              {eventPaging && eventPaging.totalPages > 1 && (
                <div className="flex justify-center">
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
    </div>
  );
}
