"use client";

import Link from "next/link";
import { use, useState } from "react";

import { Pagination } from "@/components/Pagination";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Mock data
const mockAnnouncements = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: "제목입니다.",
  date: "2024.08.12",
}));

export default function Page(props: PageProps) {
  const params = use(props.params);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<"notice" | "event">(
    "notice"
  );

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 pt-10 md:border-r border-[#e5e7eb]">
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
        <div className="col-span-6 md:pl-10 py-10 flex flex-col gap-5">
          <h2 className="text-xl font-bold text-[#111827]">공지사항</h2>

          {/* Announcements List */}
          {activeCategory === "notice" && (
            <>
              <div className="flex flex-col">
                {mockAnnouncements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    href={`/${params.locale}/community/${announcement.id}`}
                    className="border-b border-[#e5e7eb] px-3 py-4 flex items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 flex items-center text-sm">
                      <p className="flex-1 font-semibold text-[#111827] leading-[1.7]">
                        {announcement.title}
                      </p>
                      <p className="text-[#4b5563] leading-[1.7]">
                        {announcement.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={5}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}

          {activeCategory === "event" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
                <h2 className="text-white text-xl font-bold truncate">
                  hello 1
                </h2>

                <p className="text-white text-sm">test</p>
              </div>
              <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
                <h2 className="text-white text-xl font-bold truncate">
                  hello 1
                </h2>

                <p className="text-white text-sm">test</p>
              </div>
              <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
                <h2 className="text-white text-xl font-bold truncate">
                  hello 1
                </h2>

                <p className="text-white text-sm">test</p>
              </div>
              <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end cursor-pointer">
                <h2 className="text-white text-xl font-bold truncate">
                  hello 1
                </h2>

                <p className="text-white text-sm">test</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
