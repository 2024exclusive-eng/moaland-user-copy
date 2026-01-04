"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import Image from "next/image";

import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

type CategoryType = "guide" | "inquiry" | "filter";

interface Category {
  icon: React.ReactNode;
  label: string;
  value?: string; // API category value
  type: CategoryType;
}

interface CategoryIconsProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
}

const KAKAO_INQUIRY_URL = "http://pf.kakao.com/_IRpxhn";

export function CategoryIcons({
  selectedCategory,
  onCategoryChange,
}: CategoryIconsProps = {}) {
  const { _ } = useLingui();
  const { push } = useLocalizedNavigation();

  const categories: Category[] = [
    {
      icon: (
        <Image src="/icons/guide.svg" width={43} height={43} alt="guide" />
      ),
      label: _(msg`이용가이드`),
      value: undefined,
      type: "guide",
    },
    {
      icon: (
        <Image
          src="/icons/restaurant.svg"
          width={43}
          height={43}
          alt="restaurant"
        />
      ),
      label: _(msg`맛집`),
      value: "restaurant",
      type: "filter",
    },
    {
      icon: (
        <Image src="/icons/hospital.svg" width={43} height={43} alt="hospital" />
      ),
      label: _(msg`병원`),
      value: "Hospital",
      type: "filter",
    },
    {
      icon: (
        <Image src="/icons/beauty.svg" width={43} height={43} alt="beauty" />
      ),
      label: _(msg`뷰티`),
      value: "Beauty",
      type: "filter",
    },
    {
      icon: (
        <Image src="/icons/culture.svg" width={43} height={43} alt="culture" />
      ),
      label: _(msg`문화`),
      value: "Culture",
      type: "filter",
    },
    {
      icon: (
        <Image src="/icons/stays.svg" width={43} height={43} alt="stays" />
      ),
      label: _(msg`숙박`),
      value: "Stay",
      type: "filter",
    },
    {
      icon: (
        <Image src="/icons/massage.svg" width={43} height={43} alt="massage" />
      ),
      label: _(msg`마사지`),
      value: "Massage",
      type: "filter",
    },
    {
      icon: (
        <Image src="/icons/inquire.svg" width={43} height={43} alt="inquire" />
      ),
      label: _(msg`광고문의`),
      value: undefined,
      type: "inquiry",
    },
  ];

  const handleCategoryClick = (category: Category) => {
    switch (category.type) {
      case "guide":
        // Redirect to support page with usage tab
        push("support?tab=usage");
        break;
      case "inquiry":
        // Open Kakao inquiry in new tab
        window.open(KAKAO_INQUIRY_URL, "_blank", "noopener,noreferrer");
        break;
      case "filter":
        if (onCategoryChange && category.value) {
          // If we have a callback, use it (for in-page filtering)
          if (selectedCategory === category.value) {
            onCategoryChange(undefined);
          } else {
            onCategoryChange(category.value);
          }
        } else if (category.value) {
          // Otherwise, navigate to campaigns page with category
          push(`campaigns?category=${category.value}`);
        }
        break;
    }
  };

  return (
    <section className="bg-white pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-6.5 overflow-x-auto flex-wrap">
          {categories.map((category, index) => {
            const isSelected =
              category.type === "filter" &&
              category.value &&
              selectedCategory === category.value;

            return (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col items-center gap-2 min-w-20 transition-opacity cursor-pointer hover:opacity-80"
              >
                <div
                  className={`w-20 h-20 border rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-red-600 bg-red-50"
                      : "border-[#E5E7EB] bg-[#F9FAFB]"
                  }`}
                >
                  {category.icon}
                </div>
                <span
                  className={`text-xs text-center whitespace-nowrap ${
                    isSelected ? "text-red-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
