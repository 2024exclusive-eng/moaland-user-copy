"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, use, useState } from "react";

import { CampaignCard } from "@/app/[locale]/_components/CampaignCard";
import { CampaignCardSkeleton } from "@/app/[locale]/_components/CampaignCardSkeleton";
import { Pagination } from "@/components/Pagination";
import { useCampaigns } from "@/shared/hooks/use-campaigns";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const r = useLocalizedNavigation();

  const { campaigns, paging, isLoading } = useCampaigns({
    search: keyword || undefined,
    page: currentPage,
    item: 12,
  });

  const handleCampaignClick = (missionId: number) => {
    r.push(`/campaigns/${missionId}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-[65vh]">
      {/* Search Result Title */}
      <h1 className="text-2xl font-bold text-[#111827] leading-[1.7] mb-10">
        {keyword && (
          <>
            <span className="text-[#EA3A50]">&apos;{keyword}&apos;</span>{" "}
            <span>검색결과</span>
          </>
        )}
        {!keyword && <span>검색</span>}
      </h1>

      {/* Campaign Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-[#9CA3AF]">
          {keyword ? (
            <>
              <p className="text-lg mb-2">
                &apos;{keyword}&apos;에 대한 검색결과가 없습니다.
              </p>
              <p className="text-sm">다른 검색어로 다시 검색해 보세요.</p>
            </>
          ) : (
            <p className="text-lg">검색어를 입력해주세요.</p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.missionId}
                missionId={campaign.missionId}
                title={campaign.title}
                brand={campaign.brand}
                thumbnailImg={campaign.thumbnailImg}
                enrollEndDate={campaign.enrollEndDate}
                enrollCount={campaign.enrollCount}
                maxEnroll={campaign.maxEnroll}
                missionContent={campaign.missionContent}
                social={campaign.social}
                point={campaign.point}
                category={campaign.category}
                onClick={() => handleCampaignClick(campaign.missionId)}
              />
            ))}
          </div>

          {/* Pagination */}
          {paging && paging.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={paging.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-10 min-h-[65vh]">
      <div className="h-8 w-48 bg-gray-200 rounded mb-10 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <CampaignCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage(props: PageProps) {
  use(props.params);

  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
