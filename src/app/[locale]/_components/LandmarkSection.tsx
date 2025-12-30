"use client";

import { ChevronRight } from "lucide-react";

import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

import { LandmarkCard } from "./LandmarkCard";

interface Landmark {
  id: string;
  image: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance?: string;
  isFavorite?: boolean;
}

interface LandmarkSectionProps {
  title?: string;
  subtitle?: string;
  landmarks: Landmark[];
  showViewAll?: boolean;
  hideTitle?: boolean;
}

export function LandmarkSection({
  title,
  subtitle,
  landmarks,
  showViewAll = true,
  hideTitle = false,
}: LandmarkSectionProps) {
  const r = useLocalizedNavigation();
  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {hideTitle ? null : (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {subtitle && <span className="text-red-600">{subtitle} </span>}
                {title}
              </h2>
            </div>
            {showViewAll && (
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
                더보기
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {landmarks.map((landmark) => (
            <LandmarkCard
              onClick={() => {
                r.push("/campaign/1");
              }}
              key={`${title}_${subtitle}_${landmark.id}`}
              {...landmark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
