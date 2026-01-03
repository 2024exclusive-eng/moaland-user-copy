"use client";

import { AlertCircle, ChevronRight } from "lucide-react";

import type { Campaign } from "@/lib/api/campaign";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

import { CampaignCard } from "./CampaignCard";
import { CampaignCardSkeletonGrid } from "./CampaignCardSkeleton";

interface CampaignSectionProps {
  title?: string;
  subtitle?: string;
  campaigns: Campaign[];
  isLoading?: boolean;
  isError?: boolean;
  showViewAll?: boolean;
  viewAllHref?: string;
  hideTitle?: boolean;
  skeletonCount?: number;
}

export function CampaignSection({
  title,
  subtitle,
  campaigns,
  isLoading = false,
  isError = false,
  showViewAll = true,
  viewAllHref,
  hideTitle = false,
  skeletonCount = 5,
}: CampaignSectionProps) {
  const r = useLocalizedNavigation();

  const handleCardClick = (missionId: number) => {
    r.push(`/campaigns/${missionId}`);
  };

  const handleViewAllClick = () => {
    if (viewAllHref) {
      r.push(viewAllHref);
    }
  };

  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {!hideTitle && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {subtitle && <span className="text-red-600">{subtitle} </span>}
                {title}
              </h2>
            </div>
            {showViewAll && viewAllHref && (
              <button
                onClick={handleViewAllClick}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                더보기
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <CampaignCardSkeletonGrid count={skeletonCount} />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
            <p className="text-lg font-medium">
              캠페인을 불러오는데 실패했습니다
            </p>
            <p className="text-sm mt-1">잠시 후 다시 시도해주세요</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-lg font-medium">캠페인이 없습니다</p>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && !isError && campaigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.missionId}
                missionId={campaign.missionId}
                title={campaign.title}
                missionContent={campaign.missionContent}
                brand={campaign.brand}
                thumbnailImg={campaign.thumbnailImg}
                enrollEndDate={campaign.enrollEndDate}
                enrollCount={campaign.enrollCount}
                maxEnroll={campaign.maxEnroll}
                social={campaign.social}
                point={campaign.point}
                category={campaign.category}
                onClick={() => handleCardClick(campaign.missionId)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
