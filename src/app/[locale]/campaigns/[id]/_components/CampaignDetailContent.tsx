"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

import { FloatingInquiryButton } from "@/components/FloatingInquiryButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  calculateDaysRemaining,
  checkEnrollmentStatus,
  getSocialLabel,
  parseSocialPlatforms,
  SOCIAL_LOGO_MAP,
} from "@/lib/api/campaign";
import { tokenStorage } from "@/lib/axios";
import { useCampaignDetail } from "@/shared/hooks/use-campaigns";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

import { CampaignAlertDialog } from "./CampaignAlertDialog";
import { CampaignApplyDialog } from "./CampaignApplyDialog";
import { CampaignSidebar } from "./CampaignSidebar";
import { DetailImagesSection } from "./DetailImagesSection";
import { GoogleMapView } from "./GoogleMapView";

interface CampaignDetailContentProps {
  missionId: number;
}

type ButtonState = "opening-soon" | "apply" | "deadline";

// Helper function to get button state
function getButtonState(
  enrollStartDate: string,
  enrollEndDate: string
): ButtonState {
  const now = new Date();
  const startDate = new Date(enrollStartDate);
  const endDate = new Date(enrollEndDate);
  // Set end date to end of day (23:59:59.999) so enrollment is available all day
  endDate.setHours(23, 59, 59, 999);

  if (now < startDate) {
    return "opening-soon";
  } else if (now > endDate) {
    return "deadline";
  }
  return "apply";
}

// Helper function to get button config
function getButtonConfig(
  _: ReturnType<typeof useLingui>["_"]
): Record<ButtonState, { text: string; disabled: boolean }> {
  return {
    "opening-soon": { text: _(msg`오픈 예정`), disabled: true },
    apply: { text: _(msg`캠페인 신청하기`), disabled: false },
    deadline: { text: _(msg`신청 마감`), disabled: true },
  };
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
    <div className="container mx-auto md:px-4 px-0 bg-white">
      <div className="grid md:grid-cols-4 grid-cols-1 md:gap-10 gap-0">
        {/* Main Content Skeleton */}
        <div className="md:col-span-3 col-span-1 md:border-r border-r-0 md:pt-10 pt-5 border-[#e5e7eb] md:pr-10 pr-0 md:px-0 px-[21px]">
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
        {/* Sidebar Skeleton - Desktop Only */}
        <div className="hidden md:block md:col-span-1 pt-10">
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
  const { push } = useLocalizedNavigation();
  const { mission, isLoading, isError } = useCampaignDetail(missionId);

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [alertType, setAlertType] = useState<
    "already-applied" | "success" | null
  >(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    setIsLoggedIn(!!tokenStorage.get());
  }, []);

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

  // Button state and handlers for mobile sticky button
  const buttonState = getButtonState(
    mission.enrollStartDate,
    mission.enrollEndDate
  );
  const buttonConfig = getButtonConfig(_);
  const { text: buttonText, disabled: isButtonDisabled } =
    buttonConfig[buttonState];

  const getButtonText = () => {
    if (isChecking) return _(msg`확인 중...`);
    if (buttonState === "apply" && !isLoggedIn)
      return _(msg`로그인 후 신청하세요!`);
    return buttonText;
  };

  const handleApplyClick = async () => {
    if (isButtonDisabled || isChecking) return;

    if (!isLoggedIn) {
      push("login");
      return;
    }

    setIsChecking(true);
    try {
      const response = await checkEnrollmentStatus(missionId);

      if (response.isEnrolled) {
        setAlertType("already-applied");
      } else {
        setIsApplyDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to check enrollment status:", error);
      setIsApplyDialogOpen(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleApplySuccess = () => {
    setAlertType("success");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="h-[60px] flex items-center justify-center px-[21px] py-[16px] border-b border-[#e5e7eb] relative">
          <Link
            href="/campaigns"
            className="absolute left-[21px] flex items-center hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="size-6" />
          </Link>
          <span className="text-[16px] font-semibold text-black">
            <Trans>캠페인 상세</Trans>
          </span>
        </div>
      </div>

      <div className="container mx-auto md:px-4 px-0 bg-white md:pb-0">
        <div className="grid md:grid-cols-4 grid-cols-1 md:gap-10 gap-0">
          {/* Main Content - Left Side */}
          <div className="md:col-span-3 col-span-1 md:border-r border-r-0 md:pt-10 pt-5 border-[#e5e7eb] md:pr-10 md:px-0 px-[21px]">
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
                          {getSocialLabel(platform, _)}
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

              {/* Mobile Campaign Info - Only visible on mobile */}
              <div className="md:hidden flex flex-col gap-3 mb-6">
                <div className="flex items-start pt-[1.63px]">
                  <div className="w-[140px] shrink-0">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {_(msg`캠페인 신청기간`)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {applicationPeriod}
                    </p>
                  </div>
                </div>
                <div className="flex items-start pt-[1.63px]">
                  <div className="w-[140px] shrink-0">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {_(msg`인플루언서 발표`)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {announcementDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start pt-[1.63px]">
                  <div className="w-[140px] shrink-0">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {_(msg`방문기간`)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {visitPeriod}
                    </p>
                  </div>
                </div>
                <div className="flex items-start pt-[1.63px]">
                  <div className="w-[140px] shrink-0">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {_(msg`콘텐츠 등록기간`)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {registrationPeriod}
                    </p>
                  </div>
                </div>
                <div className="flex items-start pt-[1.63px]">
                  <div className="w-[140px] shrink-0">
                    <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                      {_(msg`신청자`)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold leading-[1.7]">
                      <span className="text-[#ea3a50]">
                        {mission.enrollCount}
                      </span>
                      <span className="text-[#111827]">
                        {" "}
                        / {mission.maxEnroll}
                        {_(msg`명`)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

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
          {/* Sidebar - Right Side - Desktop Only */}
          <div className="hidden md:block md:col-span-1 pt-10">
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

      {/* Mobile Sticky Apply Button */}
      {isApplyDialogOpen ? null : (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-[21px] py-3 z-100">
          <Button
            onClick={handleApplyClick}
            disabled={isButtonDisabled || isChecking}
            className={`w-full text-[14px] h-12 rounded-lg ${
              isButtonDisabled
                ? "bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed hover:bg-[#f3f4f6]"
                : "bg-[#ea3a50] hover:bg-[#d63447] text-white"
            }`}
          >
            {getButtonText()}
          </Button>
        </div>
      )}

      {/* Apply Dialog */}
      {isApplyDialogOpen && (
        <CampaignApplyDialog
          missionId={missionId}
          campaignTitle={mission.title}
          campaignSubtitle={mission.goodsContents}
          social={mission.social}
          open={isApplyDialogOpen}
          onOpenChange={setIsApplyDialogOpen}
          onSuccess={handleApplySuccess}
        />
      )}

      {/* Alert Dialogs */}
      {alertType === "already-applied" && (
        <CampaignAlertDialog
          open={true}
          onOpenChange={(open) => !open && setAlertType(null)}
          type="already-applied"
        />
      )}
      {alertType === "success" && (
        <CampaignAlertDialog
          open={true}
          onOpenChange={(open) => !open && setAlertType(null)}
          type="success"
        />
      )}

      {/* Floating Inquiry Button */}
      <FloatingInquiryButton />
    </>
  );
}
