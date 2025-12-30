"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

// Mock data - replace with API call
const mockAnnouncement = {
  id: "1",
  title: "제목입니다.",
  date: "2024.08.12",
  content: "내용입니다.",
};

export default function CommunityDetailPage(props: PageProps) {
  const params = use(props.params);
  const [activeCategory, setActiveCategory] = useState<"notice" | "event">(
    "notice"
  );
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 pt-10 border-r border-[#e5e7eb]">
          <h1 className="text-[#111827] text-2xl font-bold">커뮤니티</h1>

          <div className="pl-3 mt-5">
            <button
              onClick={() => setActiveCategory("notice")}
              className={`text-lg transition-colors ${
                activeCategory === "notice"
                  ? "text-[#111827] font-semibold"
                  : "text-[#9CA3AF]"
              }`}
            >
              공지사항
            </button>
            <button
              onClick={() => setActiveCategory("event")}
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

        {/* Main Content */}
        {activeCategory === "notice" && (
          <div className="col-span-6 md:border-l border-[#e5e7eb] md:pl-10 py-10 flex flex-col gap-5">
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

            {/* Title and Date */}
            <div className="flex flex-col gap-0.5">
              <h1 className="text-lg font-semibold text-[#111827] leading-[1.5]">
                {mockAnnouncement.title}
              </h1>
              <p className="text-sm text-[#4b5563] leading-[1.7]">
                {mockAnnouncement.date}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e5e7eb] w-full" />

            {/* Content */}
            <div className="text-sm text-[#4b5563] leading-[1.7]">
              {mockAnnouncement.content}
            </div>
          </div>
        )}

        {activeCategory === "event" && (
          <div className="col-span-6 md:pl-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
              <h2 className="text-white text-xl font-bold truncate">hello 1</h2>

              <p className="text-white text-sm">test</p>
            </div>
            <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
              <h2 className="text-white text-xl font-bold truncate">hello 1</h2>

              <p className="text-white text-sm">test</p>
            </div>
            <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
              <h2 className="text-white text-xl font-bold truncate">hello 1</h2>

              <p className="text-white text-sm">test</p>
            </div>
            <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
              <h2 className="text-white text-xl font-bold truncate">hello 1</h2>

              <p className="text-white text-sm">test</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
