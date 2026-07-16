"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WeChatQRDialog } from "@/components/WeChatQRDialog";
import { checkEnrollmentStatus } from "@/lib/api/campaign";
import { tokenStorage } from "@/lib/axios";
import { getKoreaTime, setKoreaEndOfDay, toKoreaTime } from "@/lib/date-utils";
import { useBanners } from "@/shared/hooks/use-campaigns";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

import { CampaignAlertDialog } from "./CampaignAlertDialog";
import { CampaignApplyDialog } from "./CampaignApplyDialog";

type ButtonState = "opening-soon" | "apply" | "deadline";

interface CampaignSidebarProps {
  missionId: number;
  campaignTitle: string;
  campaignSubtitle: string;
  applicationPeriod: string;
  announcementDate: string;
  visitPeriod: string;
  registrationPeriod: string;
  applicants: {
    current: number;
    total: number;
  };
  enrollStartDate: string;
  enrollEndDate: string;
  social: string;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start pt-[1.63px]">
      <div className="w-35 shrink-0">
        <p className="text-[14px] font-semibold text-[#111827] leading-[1.7]">
          {label}
        </p>
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-[#111827] leading-[1.7]">
          {value}
        </p>
      </div>
    </div>
  );
}

function getButtonState(
  enrollStartDate: string,
  enrollEndDate: string
): ButtonState {
  const now = getKoreaTime();
  const startDate = toKoreaTime(enrollStartDate);
  const endDate = setKoreaEndOfDay(toKoreaTime(enrollEndDate));

  if (now < startDate) {
    return "opening-soon";
  } else if (now > endDate) {
    return "deadline";
  }
  return "apply";
}

function getButtonConfig(
  _: ReturnType<typeof useLingui>["_"]
): Record<ButtonState, { text: string; disabled: boolean }> {
  return {
    "opening-soon": { text: _(msg`오픈 예정`), disabled: true },
    apply: { text: _(msg`캠페인 신청하기`), disabled: false },
    deadline: { text: _(msg`신청 마감`), disabled: true },
  };
}

export function CampaignSidebar({
  missionId,
  campaignTitle,
  campaignSubtitle,
  applicationPeriod,
  visitPeriod,
  registrationPeriod,
  applicants,
  enrollStartDate,
  enrollEndDate,
  social,
}: CampaignSidebarProps) {
  const { _ } = useLingui();
  const { push } = useLocalizedNavigation();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [alertType, setAlertType] = useState<
    "already-applied" | "success" | null
  >(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    setIsLoggedIn(!!tokenStorage.get());
  }, []);

  // Fetch right banners
  const { banners, isLoading: isBannerLoading } = useBanners("right_banner");
  const [randomBanner, setRandomBanner] = useState<
    (typeof banners)[number] | null
  >(null);
  const [hasSelectedBanner, setHasSelectedBanner] = useState(false);

  useEffect(() => {
    if (banners.length > 0 && !isBannerLoading && !hasSelectedBanner) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const randomIndex = array[0] % banners.length;
      setRandomBanner(banners[randomIndex]);
      setHasSelectedBanner(true);
    }
  }, [banners, isBannerLoading, hasSelectedBanner]);

  const buttonState = getButtonState(enrollStartDate, enrollEndDate);
  const buttonConfig = getButtonConfig(_);
  const { text: buttonText, disabled: isButtonDisabled } =
    buttonConfig[buttonState];

  // Determine final button text
  const getButtonText = () => {
    if (isChecking) return _(msg`확인 중...`);
    if (buttonState === "apply" && !isLoggedIn)
      return _(msg`로그인 후 신청하세요!`);
    return buttonText;
  };

  const handleApplyClick = async () => {
    if (isButtonDisabled || isChecking) return;

    // If not logged in, redirect to login page
    if (!isLoggedIn) {
      push("login");
      return;
    }

    setIsChecking(true);
    try {
      // Check if user is already enrolled
      const response = await checkEnrollmentStatus(missionId);

      if (response.isEnrolled) {
        // User already applied - show already applied dialog
        setAlertType("already-applied");
      } else {
        // User not enrolled - open apply dialog
        setIsApplyDialogOpen(true);
      }
    } catch (error) {
      // If error (e.g., not logged in), still open the apply dialog
      // The apply dialog will handle auth errors
      console.error("Failed to check enrollment status:", error);
      setIsApplyDialogOpen(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleApplySuccess = () => {
    // Show success dialog
    setAlertType("success");
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Campaign Info */}
        <div className="flex flex-col gap-3">
          <InfoRow label={_(msg`캠페인 신청기간`)} value={applicationPeriod} />
          <InfoRow label={_(msg`방문기간`)} value={visitPeriod} />
          <InfoRow label={_(msg`콘텐츠 등록기간`)} value={registrationPeriod} />
          <div className="flex items-start pt-[1.63px]">
            <div className="w-35 shrink-0">
              <p className="text-base font-semibold text-[#111827] leading-[1.7]">
                {_(msg`신청자`)}{" "}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold leading-[1.7]">
                <span className="text-[#ea3a50]">{applicants.current}</span>
                <span className="text-[#111827]">
                  {" "}
                  / {_(msg`${applicants.total}명`)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <Button
          onClick={handleApplyClick}
          disabled={isButtonDisabled || isChecking}
          className={`w-full text-[14px] h-10 rounded-lg ${
            isButtonDisabled
              ? "bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed hover:bg-[#f3f4f6]"
              : "bg-[#ea3a50] hover:bg-[#d63447] text-white"
          }`}
        >
          {getButtonText()}
        </Button>

        {/* Banner Area */}
        {isBannerLoading ? (
          <Skeleton className="min-h-45 w-full rounded-lg" />
        ) : randomBanner ? (
          randomBanner.linkType === "wechat" ? (
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="block w-full cursor-pointer"
            >
              <div className="relative min-h-45 w-full rounded-lg overflow-hidden">
                <Image
                  src={randomBanner.thumbnailPath}
                  alt={randomBanner.name}
                  fill
                  className="object-cover"
                />
              </div>
            </button>
          ) : (
            <a
              href={randomBanner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative min-h-45 w-full rounded-lg overflow-hidden">
                <Image
                  src={randomBanner.thumbnailPath}
                  alt={randomBanner.name}
                  fill
                  className="object-cover"
                />
              </div>
            </a>
          )
        ) : (
          <div className="min-h-45 bg-[#eae5e2] rounded-lg flex items-center justify-center">
            <p className="text-sm font-medium text-[#9ca3af]">
              {_(msg`광고 배너`)}
            </p>
          </div>
        )}
      </div>

      {/* Campaign Apply Dialog */}
      <CampaignApplyDialog
        open={isApplyDialogOpen}
        onOpenChange={setIsApplyDialogOpen}
        missionId={missionId}
        campaignTitle={campaignTitle}
        campaignSubtitle={campaignSubtitle}
        social={social}
        onSuccess={handleApplySuccess}
      />

      {/* Alert Dialog for already applied / success */}
      {alertType && (
        <CampaignAlertDialog
          open={!!alertType}
          onOpenChange={(open) => {
            if (!open) setAlertType(null);
          }}
          type={alertType}
        />
      )}

      <WeChatQRDialog open={qrOpen} onOpenChange={setQrOpen} />
    </>
  );
}
