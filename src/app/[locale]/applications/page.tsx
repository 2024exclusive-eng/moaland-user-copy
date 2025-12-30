"use client";

import Image from "next/image";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { Pagination } from "@/components/Pagination";

const mockCampaigns = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  title: "[강남] 빌라드 블랑",
  description: "250,000원 상당 두피스케일링, 헤어크리닉, 헤어크리닉제 증정",
  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
  daysLeft: 3,
  applicants: 20,
  capacity: 2,
}));

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "applied" | "selected" | "registered" | "completed"
  >("applied");

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 pt-10 md:border-r border-[#e5e7eb]">
          <h1 className="text-[#111827] text-2xl font-bold">커뮤니티</h1>

          <div className="pl-3 mt-5">
            <LocalizedLink
              href="/applications"
              className="text-lg transition-colors font-semibold text-[#111827] block"
            >
              나의 캠페인
            </LocalizedLink>
            <LocalizedLink
              href="/profile"
              className="text-lg mt-3 block transition-colors text-[#9CA3AF]"
            >
              계정 정보
            </LocalizedLink>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 md:border-l border-[#e5e7eb] md:pl-10 py-10 flex flex-col gap-5.75">
          <h2 className="text-xl font-semibold text-[#111827] leading-normal">
            나의 캠페인
          </h2>

          <div className="flex flex-col gap-3">
            {/* Tab Menu */}
            <div className="border-b border-[#e5e7eb] flex items-center">
              <button
                onClick={() => setActiveTab("applied")}
                className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                  activeTab === "applied"
                    ? "border-b border-black font-bold text-[#111827]"
                    : "font-medium text-[#9ca3af]"
                }`}
              >
                신청한 캠페인{" "}
                <span
                  className={activeTab === "applied" ? "text-[#ea3a50]" : ""}
                >
                  40
                </span>
              </button>
              <button
                onClick={() => setActiveTab("selected")}
                className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                  activeTab === "selected"
                    ? "border-b border-black font-bold text-[#111827]"
                    : "font-medium text-[#9ca3af]"
                }`}
              >
                선정된 캠페인{" "}
                <span
                  className={activeTab === "selected" ? "text-[#ea3a50]" : ""}
                >
                  0
                </span>
              </button>
              <button
                onClick={() => setActiveTab("registered")}
                className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                  activeTab === "registered"
                    ? "border-b border-black font-bold text-[#111827]"
                    : "font-medium text-[#9ca3af]"
                }`}
              >
                등록한 캠페인
                <span
                  className={activeTab === "registered" ? "text-[#ea3a50]" : ""}
                >
                  0
                </span>
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                  activeTab === "completed"
                    ? "border-b border-black font-bold text-[#111827]"
                    : "font-medium text-[#9ca3af]"
                }`}
              >
                종료된 캠페인
                <span
                  className={activeTab === "completed" ? "text-[#ea3a50]" : ""}
                >
                  0
                </span>
              </button>
            </div>

            {/* Campaign List */}
            <div className="flex flex-col">
              {mockCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border-b border-[#e5e7eb] px-3 py-5 flex gap-3 items-center"
                >
                  {/* Campaign Image */}
                  <div className="w-19.5 h-19.5 rounded overflow-hidden shrink-0">
                    <Image
                      src={campaign.image}
                      width={78}
                      height={78}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Campaign Info */}
                  <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
                    <div className="flex flex-col">
                      <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-[#6b7280] leading-[1.7]">
                        {campaign.description}
                      </p>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="flex gap-1.5 items-center">
                        <Image
                          src="/images/instagram-logo.webp"
                          width={16}
                          height={16}
                          alt="logo"
                          className="object-cover"
                        />
                        <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                          {campaign.daysLeft}일 남음
                        </p>
                      </div>

                      <div className="h-2.5 w-0 border-l border-[#e5e7eb]" />

                      <p className="text-xs text-[#4b5563] leading-[1.7]">
                        신청 {campaign.applicants}/ {campaign.capacity}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <button className="h-8 px-3 rounded-md border border-[#e5e7eb] bg-transparent flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-[#ff614e] leading-normal">
                      신청취소
                    </span>
                  </button>

                  <button className="h-8 px-3 rounded-md border border-[#e5e7eb] bg-transparent flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-[#374151] leading-normal">
                      신청서 보기
                    </span>
                  </button>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
