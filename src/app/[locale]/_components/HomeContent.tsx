"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Pagination } from "@/components/Pagination";
import {
  useDeadlineCampaigns,
  useNewCampaigns,
  useRecommendedCampaigns,
} from "@/shared/hooks/use-campaigns";

import { CampaignSection } from "./CampaignSection";
import { CategoryIcons } from "./CategoryIcons";
import { HeroBanner } from "./HeroBanner";

export function HomeContent() {
  const { _ } = useLingui();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const newCampaignsSectionRef = useRef<HTMLDivElement>(null);

  const {
    campaigns: recommendedCampaigns,
    isLoading: recommendedLoading,
    isError: recommendedError,
  } = useRecommendedCampaigns(4);

  const {
    campaigns: deadlineCampaigns,
    isLoading: deadlineLoading,
    isError: deadlineError,
  } = useDeadlineCampaigns(4);

  const {
    campaigns: newCampaigns,
    paging,
    isLoading: newLoading,
    isError: newError,
  } = useNewCampaigns(currentPage, 8);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Persist the 새로운 캠페인 page in the URL so returning from a campaign
    // detail (browser back / in-app ←) restores the same page instead of
    // resetting to page 1 (P29 — same fix as the /campaigns list).
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // Scroll to new campaigns section with offset for header
    newCampaignsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeroBanner />
      <CategoryIcons />

      <div className="flex flex-col gap-16">
        <CampaignSection
          title={_(msg`캠페인`)}
          subtitle={_(msg`추천`)}
          campaigns={recommendedCampaigns}
          isLoading={recommendedLoading}
          isError={recommendedError}
          viewAllHref="/campaigns"
        />

        <CampaignSection
          title={_(msg`캠페인`)}
          subtitle={_(msg`마감임박`)}
          campaigns={deadlineCampaigns}
          isLoading={deadlineLoading}
          isError={deadlineError}
          viewAllHref="/campaigns"
        />

        <div ref={newCampaignsSectionRef} className="scroll-mt-20">
          <CampaignSection
            title={_(msg`캠페인`)}
            subtitle={_(msg`새로운`)}
            campaigns={newCampaigns}
            isLoading={newLoading}
            isError={newError}
            cardVariant="vertical"
            viewAllHref="/campaigns"
          />
        </div>
      </div>

      <div className="pt-10 sm:pb-25">
        <Pagination
          currentPage={currentPage}
          totalPages={paging?.totalPages ?? 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
