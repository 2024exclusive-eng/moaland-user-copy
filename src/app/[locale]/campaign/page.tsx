"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/Pagination";

import { LandmarkSection } from "../_components/LandmarkSection";

const categories = [
  { id: "all", label: "전체" },
  { id: "restaurant", label: "맛집" },
  { id: "hospital", label: "병원" },
  { id: "beauty", label: "뷰티" },
  { id: "culture", label: "문화" },
  { id: "accommodation", label: "숙박" },
  { id: "massage", label: "마사지" },
  { id: "etc", label: "기타" },
];

const locations = [
  { id: "all", label: "전체" },
  { id: "seoul", label: "서울" },
  { id: "busan", label: "부산" },
  { id: "jeju", label: "제주" },
  { id: "etc", label: "기타" },
];

const mockLandmarks = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    title: "랜드마크 레스토랑",
    category: "카페",
    rating: 4.5,
    reviewCount: 128,
    address: "서울시 강남구 테헤란로 427, 위워크타워 10층",
    distance: "1.2km",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    title: "멋진 레스토랑",
    category: "음식점",
    rating: 4.8,
    reviewCount: 256,
    address: "서울시 강남구 역삼동 123-45",
    distance: "2.5km",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    title: "모던 다이닝",
    category: "음식점",
    rating: 4.6,
    reviewCount: 89,
    address: "서울시 서초구 서초대로 123",
    distance: "3.1km",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    title: "힐링 카페",
    category: "카페",
    rating: 4.7,
    reviewCount: 145,
    address: "서울시 강남구 논현동 456-78",
    distance: "1.8km",
  },
];

export default function CampaignPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLocation, setActiveLocation] = useState("all");

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-5">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-[#111827] leading-[1.7]">
            캠페인 목록
          </h1>

          <div className="flex flex-col gap-3">
            {/* Category Tabs */}
            <div className="border-b border-[#E5E7EB]">
              <div className="flex items-center overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-5 py-2.5 text-base whitespace-nowrap transition-colors ${
                      activeCategory === category.id
                        ? "border-b-2 border-black font-bold text-[#111827]"
                        : "font-medium text-[#9CA3AF] hover:text-[#111827]"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
              {/* Location Pills */}
              <div className="flex items-center gap-3 flex-wrap">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setActiveLocation(location.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium leading-[1.7] transition-colors ${
                      activeLocation === location.id
                        ? "bg-[#F3F4F6] border border-black text-[#111827]"
                        : "bg-[#F3F4F6] border border-transparent text-[#111827] hover:border-[#E5E7EB]"
                    }`}
                  >
                    {location.label}
                  </button>
                ))}
              </div>

              {/* Dropdowns */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-sm font-medium text-[#111827] leading-[1.7] hover:bg-gray-50 transition-colors">
                  미디어 전체
                  <ChevronDown className="size-4" />
                </button>
                <button className="flex items-center gap-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-sm font-medium text-[#111827] leading-[1.7] hover:bg-gray-50 transition-colors">
                  마감 임박순
                  <ChevronDown className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LandmarkSection
        hideTitle
        landmarks={[
          ...mockLandmarks,
          ...mockLandmarks.map((landmark) => ({
            ...landmark,
            id: `${landmark.id}_2`,
          })),
          ...mockLandmarks.map((landmark) => ({
            ...landmark,
            id: `${landmark.id}_3`,
          })),
          ...mockLandmarks.map((landmark) => ({
            ...landmark,
            id: `${landmark.id}_4`,
          })),
        ]}
      />

      <div className="pt-10 pb-25">
        <Pagination currentPage={1} totalPages={5} />
      </div>
    </>
  );
}
