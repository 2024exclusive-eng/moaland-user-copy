"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { ChevronDown, Globe, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Pagination } from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CampaignParams } from "@/lib/api/campaign";
import { useCampaigns } from "@/shared/hooks/use-campaigns";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

import { CampaignCard } from "../../_components/CampaignCard";
import { CampaignCardSkeletonGrid } from "../../_components/CampaignCardSkeleton";

// Category tabs - using function for translation
function getCategoryTabs(_: ReturnType<typeof useLingui>["_"]) {
  return [
    { label: _(msg`전체`), value: undefined },
    { label: _(msg`맛집`), value: "restaurant" },
    { label: _(msg`병원`), value: "Hospital" },
    { label: _(msg`뷰티`), value: "Beauty" },
    { label: _(msg`문화`), value: "Culture" },
    { label: _(msg`숙박`), value: "Stay" },
    { label: _(msg`마사지`), value: "Massage" },
    { label: _(msg`기타`), value: "Others" },
  ];
}

// Region pills - using function for translation
function getRegionPills(_: ReturnType<typeof useLingui>["_"]) {
  return [
    { label: _(msg`전체`), value: undefined },
    { label: _(msg`서울`), value: "Seoul" },
    { label: _(msg`부산`), value: "Busan" },
    { label: _(msg`제주`), value: "Jeju" },
    { label: _(msg`기타`), value: "Other" },
  ];
}

// Social media options - using function for translation
function getSocialOptions(_: ReturnType<typeof useLingui>["_"]) {
  return [
    { label: _(msg`미디어 전체`), value: undefined },
    { label: _(msg`샤오홍슈`), value: "Xiaohongshu" },
    { label: _(msg`더우인`), value: "Douyin" },
    { label: _(msg`다중디엔핑`), value: "Dajongdienping" },
    { label: _(msg`인스타그램`), value: "Instagram" },
    { label: _(msg`유튜브`), value: "YouTube" },
  ];
}

// Sort options - using function for translation
function getSortOptions(_: ReturnType<typeof useLingui>["_"]) {
  return [
    { label: _(msg`최신 등록순`), value: undefined },
    { label: _(msg`마감 임박순`), value: "deadline" as const },
  ];
}

interface CampaignsContentProps {
  initialCategory?: string;
  initialSocial?: string;
  initialPage?: number;
}

export function CampaignsContent({
  initialCategory,
  initialSocial,
  initialPage = 1,
}: CampaignsContentProps) {
  const { _ } = useLingui();
  const r = useLocalizedNavigation();
  const pn = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    router.push(`/${newLocale}${pathWithoutLocale || "/"}`);
  };

  const [currentCategory, setCurrentCategory] = useState<string | undefined>(
    initialCategory,
  );
  const [currentRegion, setCurrentRegion] = useState<string | undefined>(
    undefined,
  );
  const [currentSocial, setCurrentSocial] = useState<string | undefined>(
    initialSocial,
  );
  const [currentSort, setCurrentSort] = useState<"deadline" | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Dropdown states
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showSocialDropdown, setShowSocialDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Build API params based on filters
  const buildParams = (): CampaignParams => {
    const params: CampaignParams = {
      page: currentPage,
      item: 12,
    };

    if (currentCategory) {
      params.category = currentCategory;
    }

    if (currentRegion) {
      params.region = currentRegion;
    }

    if (currentSocial) {
      params.social = currentSocial;
    }

    if (currentSort) {
      params.sort = currentSort;
    }

    return params;
  };

  const { campaigns, paging, isLoading, isError } = useCampaigns(buildParams());

  const handleCategoryChange = (category: string | undefined) => {
    setCurrentCategory(category);
    setCurrentPage(1);
  };

  const handleRegionChange = (region: string | undefined) => {
    setCurrentRegion(region);
    setShowRegionDropdown(false);
    setCurrentPage(1);
  };

  const handleSocialChange = (social: string | undefined) => {
    setCurrentSocial(social);
    setShowSocialDropdown(false);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: "deadline" | undefined) => {
    setCurrentSort(sort);
    setShowSortDropdown(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Persist the page in the URL so returning from a campaign detail (browser
    // back) restores the same page instead of resetting to page 1 (P29).
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    router.replace(qs ? `${pn}?${qs}` : pn, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (missionId: number) => {
    r.push(`/campaigns/${missionId}`);
  };

  const getRegionLabel = () => {
    const option = getRegionPills(_).find((o) => o.value === currentRegion);
    return option?.label || _(msg`전체`);
  };

  const getSocialLabel = () => {
    const option = getSocialOptions(_).find((o) => o.value === currentSocial);
    return option?.label || _(msg`미디어 전체`);
  };

  const getSortLabel = () => {
    const option = getSortOptions(_).find((o) => o.value === currentSort);
    return option?.label || _(msg`최신 등록순`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="h-[60px] flex items-center justify-between px-[21px] border-b border-[#e5e7eb]">
          <h1 className="text-black text-[18px] font-bold">
            <Trans>캠페인 목록</Trans>
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
              onClick={() => r.push("/search")}
              className="p-2 hover:bg-gray-100 rounded-full -mr-2"
            >
              <Search className="w-5 h-5 text-[#111827]" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:py-8 py-0">
        {/* Page Title - Desktop Only */}
        <h1 className="hidden md:block text-2xl font-bold text-[#111827] leading-[1.7] mb-5">
          <Trans>캠페인 목록</Trans>
        </h1>

        {/* Filters Section */}
        <div className="flex flex-col gap-3 md:mb-8 mb-4">
          {/* Category Tabs */}
          <div className="border-b border-[#E5E7EB] md:mt-0 mt-0">
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              {getCategoryTabs(_).map((tab) => {
                const isSelected = currentCategory === tab.value;
                return (
                  <button
                    key={tab.label}
                    onClick={() => handleCategoryChange(tab.value)}
                    className={`px-5 py-2.5 text-base whitespace-nowrap transition-colors ${
                      isSelected
                        ? "font-bold text-[#111827] border-b-2 border-black"
                        : "font-medium text-[#9CA3AF] hover:text-[#111827]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Pills & Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible">
            {/* Region Dropdown (Mobile) */}
            <div className="md:hidden relative shrink-0">
              <button
                onClick={() => {
                  setShowRegionDropdown(!showRegionDropdown);
                  setShowSocialDropdown(false);
                  setShowSortDropdown(false);
                }}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-xs md:text-sm font-medium text-[#111827] whitespace-nowrap"
              >
                {getRegionLabel()}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showRegionDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-20 max-h-[250px] overflow-y-auto">
                  {getRegionPills(_).map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleRegionChange(option.value)}
                      className={`w-full px-4 py-2 text-left text-xs md:text-sm hover:bg-[#F3F4F6] first:rounded-t-lg last:rounded-b-lg ${
                        currentRegion === option.value
                          ? "font-medium text-[#111827]"
                          : "text-[#6B7280]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Region Pills (Desktop) */}
            <div className="hidden md:flex flex-1 gap-3 items-center overflow-x-auto">
              {getRegionPills(_).map((pill) => {
                const isSelected = currentRegion === pill.value;
                return (
                  <button
                    key={pill.label}
                    onClick={() => handleRegionChange(pill.value)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-white border border-black text-[#111827]"
                        : "bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Dropdown Filters */}
            <div className="flex gap-2 shrink-0">
              {/* Social Media Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSocialDropdown(!showSocialDropdown);
                    setShowSortDropdown(false);
                    setShowRegionDropdown(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-xs md:text-sm font-medium text-[#111827] whitespace-nowrap"
                >
                  {getSocialLabel()}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSocialDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 min-w-[150px] max-h-[250px] overflow-y-auto">
                    {getSocialOptions(_).map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handleSocialChange(option.value)}
                        className={`w-full px-4 py-2 text-left text-xs md:text-sm hover:bg-[#F3F4F6] first:rounded-t-lg last:rounded-b-lg ${
                          currentSocial === option.value
                            ? "font-medium text-[#111827]"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowSocialDropdown(false);
                    setShowRegionDropdown(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-xs md:text-sm font-medium text-[#111827] whitespace-nowrap"
                >
                  {getSortLabel()}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 min-w-[180px] max-h-[250px] overflow-y-auto">
                    {getSortOptions(_).map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full px-4 py-2 text-left text-xs md:text-sm hover:bg-[#F3F4F6] first:rounded-t-lg last:rounded-b-lg ${
                          currentSort === option.value
                            ? "font-medium text-[#111827]"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <CampaignCardSkeletonGrid count={12} />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-lg font-medium">
              <Trans>캠페인을 불러오는데 실패했습니다</Trans>
            </p>
            <p className="text-sm mt-1">
              <Trans>잠시 후 다시 시도해주세요</Trans>
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-lg font-medium">
              <Trans>캠페인이 없습니다</Trans>
            </p>
          </div>
        )}

        {/* Campaign Grid */}
        {!isLoading && !isError && campaigns.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                variant="vertical"
                key={campaign.missionId}
                missionId={campaign.missionId}
                title={campaign.title}
                titleCn={campaign.titleCn}
                brand={campaign.brand}
                missionContent={campaign.missionContent}
                missionContentCn={campaign.missionContentCn}
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

        {/* Pagination */}
        {paging && paging.totalPages > 1 && (
          <div className="pt-10 pb-10">
            <Pagination
              currentPage={currentPage}
              totalPages={paging.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
