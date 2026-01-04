"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { FloatingInquiryButton } from "@/components/FloatingInquiryButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  calculateDaysRemaining,
  parseSocialPlatforms,
  SOCIAL_LABEL_MAP,
  SOCIAL_LOGO_MAP,
} from "@/lib/api/campaign";
import { useCampaignDetail } from "@/shared/hooks/use-campaigns";

import { CampaignSidebar } from "./CampaignSidebar";
import { DetailImagesSection } from "./DetailImagesSection";
import { GoogleMapView } from "./GoogleMapView";

interface CampaignDetailContentProps {
  missionId: number;
}

// Helper function to format date range
function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formatDate = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  return `${formatDate(start)}~${formatDate(end)}`;
}

// Helper function to format single date
function formatSingleDate(date: string): string {
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// Loading skeleton component
function CampaignDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 bg-white">
      <div className="grid grid-cols-4 gap-10">
        {/* Main Content Skeleton */}
        <div className="col-span-3 border-r pt-10 border-[#e5e7eb] pr-10">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 mt-2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="h-px bg-[#e5e7eb] my-6" />
          <Skeleton className="h-[502px] w-full rounded-lg" />
          <Skeleton className="h-10 w-full mt-4" />
          <div className="h-px bg-[#e5e7eb] my-6" />
          <div className="flex gap-4 py-4">
            <Skeleton className="h-6 w-[118px]" />
            <Skeleton className="h-20 flex-1" />
          </div>
        </div>
        {/* Sidebar Skeleton */}
        <div className="col-span-1 pt-10">
          <div className="flex flex-col gap-5">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignDetailContent({
  missionId,
}: CampaignDetailContentProps) {
  const { _ } = useLingui();
  const { mission, isLoading, isError } = useCampaignDetail(missionId);

  if (isLoading) {
    return <CampaignDetailSkeleton />;
  }

  if (isError || !mission) {
    notFound();
  }

  const daysRemaining = calculateDaysRemaining(mission.enrollEndDate);
  const socialPlatforms = parseSocialPlatforms(mission.social);

  // Format dates for display
  const applicationPeriod = formatDateRange(
    mission.enrollStartDate,
    mission.enrollEndDate
  );
  const announcementDate = formatSingleDate(mission.selectDate);
  const visitPeriod = formatDateRange(
    mission.missionStartDate,
    mission.missionEndDate
  );
  const registrationPeriod = formatDateRange(
    mission.contentStartDate,
    mission.contentEndDate
  );

  // Parse detail images (could be comma-separated or single image)
  const detailImages: string[] = [];
  if (mission.thumbnailImg) {
    detailImages.push(mission.thumbnailImg);
  }
  if (mission.detailImg) {
    const additionalImages = mission.detailImg
      .split(",")
      .map((img) => img.trim())
      .filter(Boolean);
    detailImages.push(...additionalImages);
  }

  return (
    <>
      <div className="container mx-auto px-4 bg-white">
        <div className="grid grid-cols-4 gap-10">
          {/* Main Content - Left Side */}
          <div className="col-span-3 border-r pt-10 border-[#e5e7eb] pr-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex items-center gap-2">
                  {/* Social Platform Tags */}
                  {socialPlatforms.map((platform) => {
                    const logo = SOCIAL_LOGO_MAP[platform];
                    return (
                      <div
                        key={platform}
                        className="border border-[#e5e7eb] flex items-center gap-1 px-2.75 py-1.5 rounded-full"
                      >
                        {logo && (
                          <div className="relative bg-white rounded overflow-hidden">
                            <Image
                              src={logo.src}
                              alt={platform}
                              width={logo.width}
                              height={logo.height}
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm font-semibold text-black leading-5">
                          {SOCIAL_LABEL_MAP[platform] || platform}
                        </span>
                      </div>
                    );
                  })}
                  {/* Days Remaining */}
                  {daysRemaining > 0 && (
                    <div className="border border-[#e5e7eb] px-2.75 py-1.5 rounded-full">
                      <span className="text-sm font-semibold text-black leading-5">
                        {_(msg`${daysRemaining}일 남음`)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#111827] leading-[1.7]">
                    {mission.title}
                  </h1>

                  <p className="text-sm text-[#6b7280] leading-5">
                    {mission.goodsContents}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] my-6" />

              {/* Images Section */}
              <DetailImagesSection
                images={detailImages}
                title={mission.title}
              />

              {/* Provision Details */}
              <div className="flex gap-4 py-4">
                <div className="w-[118px] shrink-0">
                  <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                    {_(msg`제공 내역`)}
                  </h3>
                </div>
                <div className="flex-1">
                  <p className="text-base text-[#111827] leading-[1.7]">
                    {mission.goodsContents}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] my-6" />

              {/* Store Location */}
              <div className="flex gap-4 py-4">
                <div className="w-[118px] shrink-0">
                  <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                    {_(msg`매장 위치`)}
                  </h3>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <p className="text-base text-[#111827] leading-[1.7]">
                    {mission.address}
                  </p>
                  <div className="relative h-[347px] w-full bg-gray-100 rounded-lg overflow-hidden">
                    <GoogleMapView
                      latitude={mission.latitude}
                      longitude={mission.longitude}
                      address={mission.address}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] my-6" />

              {/* Guideline */}
              {mission.guideline && (
                <>
                  <div className="flex gap-4 py-4">
                    <div className="w-[118px] shrink-0">
                      <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                        {_(msg`가이드라인`)}
                      </h3>
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-base text-[#111827] leading-[1.7] prose prose-sm max-w-none ck-content"
                        dangerouslySetInnerHTML={{ __html: mission.guideline }}
                      />
                    </div>
                  </div>
                  <div className="h-px bg-[#e5e7eb] my-6" />
                </>
              )}

              {/* Mission Contents */}
              {mission.missionContents && (
                <>
                  <div className="flex gap-4 py-4">
                    <div className="w-[118px] shrink-0">
                      <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                        {_(msg`미션 내용`)}
                      </h3>
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-base text-[#111827] leading-[1.7] prose prose-sm max-w-none ck-content"
                        dangerouslySetInnerHTML={{
                          __html: mission.missionContents,
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-px bg-[#e5e7eb] my-6" />
                </>
              )}

              {/* Additional Information */}
              {mission.additionalInfo && (
                <div className="flex gap-4 py-4 pb-16">
                  <div className="w-[118px] shrink-0">
                    <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {_(msg`추가 안내사항`)}
                    </h3>
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-base text-[#111827] leading-[1.7] prose prose-sm max-w-none ck-content"
                      dangerouslySetInnerHTML={{
                        __html: mission.additionalInfo,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Sidebar - Right Side */}
          <div className="col-span-1 pt-10">
            <CampaignSidebar
              missionId={missionId}
              campaignTitle={mission.title}
              campaignSubtitle={mission.goodsContents}
              applicationPeriod={applicationPeriod}
              announcementDate={announcementDate}
              visitPeriod={visitPeriod}
              registrationPeriod={registrationPeriod}
              applicants={{
                current: mission.enrollCount,
                total: mission.maxEnroll,
              }}
              enrollStartDate={mission.enrollStartDate}
              enrollEndDate={mission.enrollEndDate}
              social={mission.social}
            />
          </div>
        </div>
      </div>

      {/* Floating Inquiry Button */}
      <FloatingInquiryButton />
    </>
  );
}
