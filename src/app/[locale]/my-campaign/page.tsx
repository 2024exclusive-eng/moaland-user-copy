"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { Pagination } from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  calculateDaysRemaining,
  type MyCampaign,
  type MyCampaignStatus,
  parseSocialPlatforms,
  SOCIAL_LOGO_MAP,
} from "@/lib/api/campaign";
import {
  formatDateMMDD,
  getKoreaTime,
  parseWallClock,
  toKoreaTime,
} from "@/lib/date-utils";
import { getLocalizedContent } from "@/lib/localized-content";
import {
  useMyCampaigns,
  useMyCampaignsCounts,
} from "@/shared/hooks/use-campaigns";
import { useProfile } from "@/shared/hooks/use-profile";

import { CancelConfirmDialog } from "./_components/CancelConfirmDialog";
import { CancelSuccessDialog } from "./_components/CancelSuccessDialog";
import { EditContentDialog } from "./_components/EditContentDialog";
import { SubmitContentDialog } from "./_components/SubmitContentDialog";
import { ViewApplicationDialog } from "./_components/ViewApplicationDialog";
import { ViewContentDialog } from "./_components/ViewContentDialog";
import { ViewSelectedCampaignDialog } from "./_components/ViewSelectedCampaignDialog";
import { MOCK_CAMPAIGNS, MOCK_COUNTS, USE_MOCK_DATA } from "./_mock/campaigns";

const ITEMS_PER_PAGE = 10;

// Helper function to format visit datetime (e.g., "08.31 오후 6시 방문")
function formatVisitDateTime(
  dateString: string | null,
  _: ReturnType<typeof useLingui>["_"]
): string {
  if (!dateString) return "";
  const date = parseWallClock(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const isPM = hours >= 12;
  const hour12 = hours % 12 || 12;
  const ampm = isPM ? _(msg`오후`) : _(msg`오전`);
  return `${month}.${day} ${ampm} ${hour12}${_(msg`시`)} ${_(msg`방문`)}`;
}

// Helper function to format content date range (e.g., "08.31~09.13 등록")
function formatContentDateRange(
  startDate: string | null,
  endDate: string | null,
  _: ReturnType<typeof useLingui>["_"]
): string {
  if (!startDate || !endDate) return "";
  const start = toKoreaTime(startDate);
  const end = toKoreaTime(endDate);
  return `${formatDateMMDD(start)}~${formatDateMMDD(end)} ${_(msg`등록`)}`;
}

// Tab configuration with labels - using function to enable translation
function getTabs(_: ReturnType<typeof useLingui>["_"]) {
  return [
    { key: "applied" as MyCampaignStatus, label: _(msg`신청한 캠페인`) },
    { key: "selected" as MyCampaignStatus, label: _(msg`선정된 캠페인`) },
    { key: "registered" as MyCampaignStatus, label: _(msg`등록한 캠페인`) },
    { key: "ended" as MyCampaignStatus, label: _(msg`종료된 캠페인`) },
    { key: "rejected" as MyCampaignStatus, label: _(msg`반려 캠페인`) },
  ];
}

// Mobile tab configuration with shorter labels
function getMobileTabs(_: ReturnType<typeof useLingui>["_"]) {
  return [
    { key: "applied" as MyCampaignStatus, label: _(msg`신청`) },
    { key: "selected" as MyCampaignStatus, label: _(msg`선정`) },
    { key: "registered" as MyCampaignStatus, label: _(msg`등록`) },
    { key: "ended" as MyCampaignStatus, label: _(msg`종료`) },
    { key: "rejected" as MyCampaignStatus, label: _(msg`반려`) },
  ];
}

// Action button configuration based on status
function getActionButtons(
  status: MyCampaignStatus,
  _: ReturnType<typeof useLingui>["_"]
) {
  switch (status) {
    case "applied":
      return [
        { label: _(msg`신청취소`), variant: "cancel" as const, key: "cancel" },
        {
          label: _(msg`신청서 보기`),
          variant: "view" as const,
          key: "viewApp",
        },
      ];
    case "selected":
      return [
        {
          label: _(msg`신청서 보기`),
          variant: "view" as const,
          key: "submitContent",
        },
        {
          label: _(msg`컨텐츠 등록하기`),
          variant: "primaryFilled" as const,
          key: "viewCampaign",
        },
      ];
    case "registered":
      return [
        {
          label: _(msg`신청서 보기`),
          variant: "view" as const,
          key: "viewCampaign",
        },
        {
          label: _(msg`콘텐츠 수정`),
          variant: "primaryFilled" as const,
          key: "editContent",
        },
      ];
    case "ended":
      return [
        {
          label: _(msg`캠페인 보기`),
          variant: "view" as const,
          key: "viewCampaign",
        },
        {
          label: _(msg`콘텐츠 보기`),
          variant: "view" as const,
          key: "viewContent",
        },
      ];
    case "rejected":
      return [
        {
          label: _(msg`신청서 보기`),
          variant: "view" as const,
          key: "viewApp",
        },
      ];
    default:
      return [];
  }
}

function CampaignCardSkeleton() {
  return (
    <div className="border-b border-[#e5e7eb] px-3 py-5 flex gap-3 items-center">
      <Skeleton className="w-19.5 h-19.5 rounded shrink-0" />
      <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-3 items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}

function MobileCampaignCardSkeleton() {
  return (
    <div className="border-b border-[#e5e7eb] px-3 py-5 flex items-start justify-between">
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full max-w-[280px]" />
        </div>
        <div className="flex gap-3 items-center">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="h-6 w-6 rounded shrink-0" />
    </div>
  );
}

function CampaignCard({
  campaign,
  status,
  onViewApplication,
  onCancelApplication,
  onViewSelectedCampaign,
  onSubmitContent,
  onViewContent,
  onEditContent,
}: {
  campaign: MyCampaign;
  status: MyCampaignStatus;
  onViewApplication?: (campaign: MyCampaign) => void;
  onCancelApplication?: (campaign: MyCampaign) => void;
  onViewSelectedCampaign?: (campaign: MyCampaign) => void;
  onSubmitContent?: (campaign: MyCampaign) => void;
  onViewContent?: (campaign: MyCampaign) => void;
  onEditContent?: (campaign: MyCampaign) => void;
}) {
  const { _ } = useLingui();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";
  const daysRemaining = calculateDaysRemaining(campaign.enrollEndDate);
  const socialPlatforms = parseSocialPlatforms(campaign.social);
  const actionButtons = getActionButtons(status, _);

  // Get localized content
  const displayTitle = getLocalizedContent(
    campaign.title,
    campaign.titleCn,
    locale
  );
  const displayMissionContent = getLocalizedContent(
    campaign.missionContent,
    campaign.missionContentCn,
    locale
  );

  const handleButtonClick = (_variant: string, key: string) => {
    if (status === "applied") {
      if (key === "viewApp" && onViewApplication) {
        onViewApplication(campaign);
      } else if (key === "cancel" && onCancelApplication) {
        onCancelApplication(campaign);
      }
    } else if (status === "selected") {
      if (key === "submitContent" && onViewSelectedCampaign) {
        onViewSelectedCampaign(campaign);
      } else if (key === "viewCampaign" && onSubmitContent) {
        onSubmitContent(campaign);
      }
    } else if (status === "registered") {
      if (key === "viewCampaign" && onViewContent) {
        onViewContent(campaign);
      } else if (key === "editContent" && onEditContent) {
        onEditContent(campaign);
      }
    } else if (status === "ended") {
      if (key === "viewCampaign" && onViewSelectedCampaign) {
        onViewSelectedCampaign(campaign);
      } else if (key === "viewContent" && onViewContent) {
        onViewContent(campaign);
      }
    }
  };

  return (
    <div className="border-b border-[#e5e7eb] px-3 py-5 flex gap-3 items-center">
      {/* Campaign Image & Info - Clickable to detail page */}
      <LocalizedLink
        href={`/campaigns/${campaign.missionId}`}
        className="flex gap-3 items-center flex-1 min-w-0 hover:opacity-80 transition-opacity"
      >
        {/* Campaign Image */}
        <div className="w-19.5 h-19.5 rounded overflow-hidden shrink-0">
          <Image
            src={campaign.thumbnailImg || "/images/placeholder.png"}
            width={78}
            height={78}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Campaign Info */}
        <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
              {displayTitle}
            </h3>
            <p className="text-sm text-[#6b7280] leading-[1.7] line-clamp-1">
              {displayMissionContent}
            </p>
          </div>

          {/* Different layout for selected status */}
          {status === "selected" ? (
            <div className="flex gap-3 items-center">
              {/* Visit datetime */}
              <div className="flex gap-1.5 items-center">
                <Image
                  src="/icons/calendar-check.svg"
                  width={15}
                  height={15}
                  alt="calendar"
                />
                <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                  {formatVisitDateTime(campaign.visitDatetimeStart, _)}
                </p>
              </div>

              <div className="h-2.5 w-0 border-l border-[#e5e7eb]" />

              {/* Content registration period */}
              <div className="flex gap-1.5 items-center">
                {socialPlatforms.slice(0, 1).map((platform) => {
                  const logoConfig = SOCIAL_LOGO_MAP[platform];
                  if (!logoConfig) return null;
                  return (
                    <Image
                      key={platform}
                      src={logoConfig.src}
                      width={16}
                      height={16}
                      alt={platform}
                      className="object-cover"
                    />
                  );
                })}
                <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                  {formatContentDateRange(
                    campaign.contentStartDate,
                    campaign.contentEndDate,
                    _
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              {socialPlatforms.length > 0 && (
                <div className="flex gap-1.5 items-center">
                  {socialPlatforms.slice(0, 1).map((platform) => {
                    const logoConfig = SOCIAL_LOGO_MAP[platform];
                    if (!logoConfig) return null;
                    return (
                      <Image
                        key={platform}
                        src={logoConfig.src}
                        width={logoConfig.width}
                        height={logoConfig.height}
                        alt={platform}
                        className="object-cover"
                      />
                    );
                  })}
                  {status !== "ended" && daysRemaining > 0 && (
                    <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                      <Trans>{daysRemaining}일 남음</Trans>
                    </p>
                  )}
                  {status === "ended" && (
                    <p className="text-xs font-semibold text-[#9ca3af] leading-[1.7]">
                      <Trans>종료됨</Trans>
                    </p>
                  )}
                </div>
              )}

              <div className="h-2.5 w-0 border-l border-[#e5e7eb]" />

              <p className="text-xs text-[#4b5563] leading-[1.7]">
                <Trans>신청</Trans> {campaign.enrollCount}/ {campaign.maxEnroll}
              </p>
            </div>
          )}
        </div>
      </LocalizedLink>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-50 shrink-0">
        {actionButtons.map((button, index) => {
          const isContentRegistrationButton =
            status === "selected" && button.key === "viewCampaign";

          const now = getKoreaTime();
          const missionStartDate = campaign.missionStartDate
            ? toKoreaTime(campaign.missionStartDate)
            : null;
          const missionEndDate = campaign.missionEndDate
            ? toKoreaTime(campaign.missionEndDate)
            : null;
          const contentStartDate = campaign.contentStartDate
            ? toKoreaTime(campaign.contentStartDate)
            : null;
          const contentEndDate = campaign.contentEndDate
            ? toKoreaTime(campaign.contentEndDate)
            : null;

          const effectiveStartDate =
            missionStartDate && contentStartDate
              ? missionStartDate < contentStartDate
                ? missionStartDate
                : contentStartDate
              : missionStartDate || contentStartDate;

          const effectiveEndDate =
            missionEndDate && contentEndDate
              ? missionEndDate > contentEndDate
                ? missionEndDate
                : contentEndDate
              : missionEndDate || contentEndDate;

          const isBeforeActivePeriod =
            isContentRegistrationButton &&
            !!effectiveStartDate &&
            now < effectiveStartDate;

          const isAfterActivePeriod =
            isContentRegistrationButton &&
            !!effectiveEndDate &&
            now > effectiveEndDate;

          const isOutsideActivePeriod = Boolean(
            isBeforeActivePeriod || isAfterActivePeriod
          );

          const buttonLabel = isBeforeActivePeriod
            ? _(msg`컨텐츠 등록`)
            : button.label;

          const isDisabled = isOutsideActivePeriod;

          return (
            <button
              key={index}
              onClick={() => handleButtonClick(button.variant, button.key)}
              disabled={isDisabled}
              className={`w-full px-3 rounded-md flex items-center justify-center ${
                isDisabled
                  ? "min-h-8 py-1.5 bg-[#e5e7eb] border border-[#e5e7eb] cursor-not-allowed"
                  : "h-8 whitespace-nowrap bg-transparent border border-[#e5e7eb]"
              } ${
                !isDisabled && button.variant === "primaryFilled"
                  ? "bg-[#ea3a50]! border-[#ea3a50]!"
                  : ""
              }`}
            >
              <span
                className={`text-sm font-medium leading-normal text-center ${
                  isDisabled
                    ? "text-[#9ca3af]"
                    : button.variant === "cancel"
                    ? "text-[#ff614e]"
                    : button.variant === "primaryFilled"
                    ? "text-white"
                    : "text-[#374151]"
                }`}
              >
                {buttonLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Mobile Campaign Card Component
function MobileCampaignCard({
  campaign,
  status,
  onViewApplication,
  onCancelApplication,
  onViewSelectedCampaign,
  onSubmitContent,
  onViewContent,
  onEditContent,
}: {
  campaign: MyCampaign;
  status: MyCampaignStatus;
  onViewApplication?: (campaign: MyCampaign) => void;
  onCancelApplication?: (campaign: MyCampaign) => void;
  onViewSelectedCampaign?: (campaign: MyCampaign) => void;
  onSubmitContent?: (campaign: MyCampaign) => void;
  onViewContent?: (campaign: MyCampaign) => void;
  onEditContent?: (campaign: MyCampaign) => void;
}) {
  const { _ } = useLingui();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";
  const daysRemaining = calculateDaysRemaining(campaign.enrollEndDate);
  const socialPlatforms = parseSocialPlatforms(campaign.social);

  // Get localized content
  const displayTitle = getLocalizedContent(
    campaign.title,
    campaign.titleCn,
    locale
  );
  const displayMissionContent = getLocalizedContent(
    campaign.missionContent,
    campaign.missionContentCn,
    locale
  );

  // Get menu items based on status
  const getMenuItems = () => {
    switch (status) {
      case "applied":
        return [
          {
            label: _(msg`신청 취소`),
            onClick: () => onCancelApplication?.(campaign),
            variant: "cancel" as const,
          },
          {
            label: _(msg`신청서 보기`),
            onClick: () => onViewApplication?.(campaign),
            variant: "default" as const,
          },
        ];
      case "selected":
        return [
          {
            label: _(msg`신청서 보기`),
            onClick: () => onViewSelectedCampaign?.(campaign),
            variant: "default" as const,
          },
        ];
      case "registered":
        return [
          {
            label: _(msg`캠페인 보기`),
            onClick: () => onViewSelectedCampaign?.(campaign),
            variant: "default" as const,
          },
        ];
      case "ended":
        return [
          {
            label: _(msg`내역 삭제`),
            onClick: () => onViewSelectedCampaign?.(campaign),
            variant: "default" as const,
          },
          {
            label: _(msg`콘텐츠 보기`),
            onClick: () => onViewContent?.(campaign),
            variant: "default" as const,
          },
        ];
      case "rejected":
        return [
          {
            label: _(msg`신청서 보기`),
            onClick: () => onViewApplication?.(campaign),
            variant: "default" as const,
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Get action button config for selected/registered/ended tabs
  const getActionButton = () => {
    const now = getKoreaTime();
    const missionStartDate = campaign.missionStartDate
      ? toKoreaTime(campaign.missionStartDate)
      : null;
    const missionEndDate = campaign.missionEndDate
      ? toKoreaTime(campaign.missionEndDate)
      : null;
    const contentStartDate = campaign.contentStartDate
      ? toKoreaTime(campaign.contentStartDate)
      : null;
    const contentEndDate = campaign.contentEndDate
      ? toKoreaTime(campaign.contentEndDate)
      : null;

    const effectiveStartDate =
      missionStartDate && contentStartDate
        ? missionStartDate < contentStartDate
          ? missionStartDate
          : contentStartDate
        : missionStartDate || contentStartDate;

    const effectiveEndDate =
      missionEndDate && contentEndDate
        ? missionEndDate > contentEndDate
          ? missionEndDate
          : contentEndDate
        : missionEndDate || contentEndDate;

    const isBeforeActivePeriod =
      !!effectiveStartDate && now < effectiveStartDate;
    const isAfterActivePeriod = !!effectiveEndDate && now > effectiveEndDate;

    switch (status) {
      case "selected":
        return {
          label: isBeforeActivePeriod
            ? _(msg`컨텐츠 등록`)
            : _(msg`콘텐츠 등록하기`),
          onClick: () => onSubmitContent?.(campaign),
          variant: "primary" as const,
          disabled: isBeforeActivePeriod || isAfterActivePeriod,
        };
      case "registered":
        return {
          label: _(msg`콘텐츠 수정`),
          onClick: () => onEditContent?.(campaign),
          variant: "primary" as const,
          disabled: false,
        };
      case "ended":
        return {
          label: _(msg`콘텐츠 보기`),
          onClick: () => onViewContent?.(campaign),
          variant: "primary" as const,
          disabled: false,
        };
      default:
        return null;
    }
  };

  const actionButton = getActionButton();

  return (
    <div className="border-b border-[#e5e7eb] px-3 py-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        {/* Campaign Info */}
        <LocalizedLink
          href={`/campaigns/${campaign.missionId}`}
          className="flex-1 flex flex-col gap-2 min-w-0"
        >
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
              {displayTitle}
            </h3>
            <p className="text-sm text-[#6b7280] leading-[1.7] line-clamp-2">
              {displayMissionContent}
            </p>
          </div>

          {/* Status info */}
          {status === "selected" ? (
            <div className="flex gap-3 items-center">
              {/* Visit datetime */}
              <div className="flex gap-1.5 items-center">
                <Image
                  src="/icons/calendar-check.svg"
                  width={15}
                  height={15}
                  alt="calendar"
                />
                <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                  {formatVisitDateTime(campaign.visitDatetimeStart, _)}
                </p>
              </div>

              <div className="h-2.5 w-0 border-l border-[#e5e7eb]" />

              {/* Content registration period */}
              <div className="flex gap-1.5 items-center">
                {socialPlatforms.slice(0, 1).map((platform) => {
                  const logoConfig = SOCIAL_LOGO_MAP[platform];
                  if (!logoConfig) return null;
                  return (
                    <Image
                      key={platform}
                      src={logoConfig.src}
                      width={13}
                      height={13}
                      alt={platform}
                      className="object-cover"
                    />
                  );
                })}
                <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                  {formatContentDateRange(
                    campaign.contentStartDate,
                    campaign.contentEndDate,
                    _
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              {socialPlatforms.length > 0 && (
                <div className="flex gap-1.5 items-center">
                  {socialPlatforms.slice(0, 1).map((platform) => {
                    const logoConfig = SOCIAL_LOGO_MAP[platform];
                    if (!logoConfig) return null;
                    return (
                      <Image
                        key={platform}
                        src={logoConfig.src}
                        width={13}
                        height={13}
                        alt={platform}
                        className="object-cover"
                      />
                    );
                  })}
                  {status !== "ended" && daysRemaining > 0 && (
                    <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                      <Trans>{daysRemaining}일 남음</Trans>
                    </p>
                  )}
                  {status === "ended" && (
                    <p className="text-xs font-semibold text-[#9ca3af] leading-[1.7]">
                      <Trans>종료됨</Trans>
                    </p>
                  )}
                </div>
              )}

              <div className="h-2.5 w-0 border-l border-[#e5e7eb]" />

              <p className="text-xs text-[#4b5563] leading-[1.7]">
                <Trans>신청</Trans> {campaign.enrollCount}/ {campaign.maxEnroll}
              </p>
            </div>
          )}
        </LocalizedLink>

        {/* More Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="shrink-0 p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-6 h-6 text-[#111827]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border border-[#e5e7eb] rounded-[6px] p-1 min-w-[120px]"
          >
            {menuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className={`h-10 px-2.5 py-2 cursor-pointer text-sm leading-[1.7] hover:bg-gray-50 rounded-sm ${
                  item.variant === "cancel"
                    ? "text-[#ff614e]"
                    : "text-[#374151]"
                }`}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Action Button for selected/registered/ended tabs */}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          disabled={actionButton.disabled}
          className={`w-full h-10 rounded-lg flex items-center justify-center ${
            actionButton.disabled
              ? "bg-[#e5e7eb] cursor-not-allowed"
              : "bg-[#ea3a50] hover:bg-[#d63347]"
          }`}
        >
          <span
            className={`text-sm font-medium leading-[1.5] ${
              actionButton.disabled ? "text-[#9ca3af]" : "text-white"
            }`}
          >
            {actionButton.label}
          </span>
        </button>
      )}
    </div>
  );
}

function EmptyState({ status }: { status: MyCampaignStatus }) {
  const { _ } = useLingui();
  const messages: Record<MyCampaignStatus, string> = {
    applied: _(msg`신청한 캠페인이 없습니다.`),
    selected: _(msg`선정된 캠페인이 없습니다.`),
    registered: _(msg`등록한 캠페인이 없습니다.`),
    ended: _(msg`종료된 캠페인이 없습니다.`),
    rejected: _(msg`반려된 캠페인이 없습니다.`),
  };

  return (
    <div className="py-20 text-center">
      <p className="text-[#9ca3af] text-base">{messages[status]}</p>
      <LocalizedLink
        href="/campaigns"
        className="mt-4 inline-block text-[#3b82f6] text-sm font-medium hover:underline"
      >
        <Trans>캠페인 둘러보기</Trans>
      </LocalizedLink>
    </div>
  );
}

export default function Page() {
  const { _ } = useLingui();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<MyCampaignStatus>("applied");
  const { profile } = useProfile();

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [cancelConfirmDialogOpen, setCancelConfirmDialogOpen] = useState(false);
  const [cancelSuccessDialogOpen, setCancelSuccessDialogOpen] = useState(false);
  const [viewSelectedDialogOpen, setViewSelectedDialogOpen] = useState(false);
  const [submitContentDialogOpen, setSubmitContentDialogOpen] = useState(false);
  const [viewContentDialogOpen, setViewContentDialogOpen] = useState(false);
  const [editContentDialogOpen, setEditContentDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MyCampaign | null>(
    null
  );

  // Fetch campaigns for active tab (use mock data if enabled)
  const apiData = useMyCampaigns(activeTab, currentPage, ITEMS_PER_PAGE);
  const apiCounts = useMyCampaignsCounts();

  // Use mock data or real API data
  const campaigns = USE_MOCK_DATA
    ? MOCK_CAMPAIGNS[activeTab]
    : apiData.campaigns;
  const paging = USE_MOCK_DATA
    ? {
        totalPages: 1,
        currentPage: 1,
        totalItems: MOCK_CAMPAIGNS[activeTab].length,
      }
    : apiData.paging;
  const isLoading = USE_MOCK_DATA ? false : apiData.isLoading;
  const mutate = apiData.mutate;

  const counts = USE_MOCK_DATA
    ? { ...MOCK_COUNTS, isLoading: false, mutate: apiCounts.mutate }
    : apiCounts;

  // Reset page when tab changes
  const handleTabChange = (tab: MyCampaignStatus) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle view application
  const handleViewApplication = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setViewDialogOpen(true);
  };

  // Handle cancel application
  const handleCancelApplication = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setCancelConfirmDialogOpen(true);
  };

  // Handle cancel from view dialog
  const handleCancelFromView = () => {
    setCancelConfirmDialogOpen(true);
  };

  // Handle cancel success
  const handleCancelSuccess = () => {
    setCancelSuccessDialogOpen(true);
    // Refresh the campaigns list and counts
    mutate();
    counts.mutate();
  };

  // Handle view selected campaign (for "selected" status)
  const handleViewSelectedCampaign = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setViewSelectedDialogOpen(true);
  };

  // Handle submit content (for "selected" status)
  const handleSubmitContent = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setSubmitContentDialogOpen(true);
  };

  // Handle content submit success
  const handleContentSubmitSuccess = () => {
    // Refresh the campaigns list and counts
    mutate();
    counts.mutate();
  };

  // Handle view content (for "registered" status)
  const handleViewContent = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setViewContentDialogOpen(true);
  };

  // Handle edit content (for "registered" status)
  const handleEditContent = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setEditContentDialogOpen(true);
  };

  // Handle content edit success
  const handleContentEditSuccess = () => {
    // Refresh the campaigns list and counts
    mutate();
    counts.mutate();
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="h-[60px] flex items-center px-[21px] border-b border-[#e5e7eb] bg-white">
          <h1 className="text-black text-[18px] font-bold flex-1">
            <Trans>마이페이지</Trans>
          </h1>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 bg-white px-[21px] pt-5 pb-20">
          {/* User Profile Section */}
          <div className="flex gap-3 items-center mb-5">
            <div className="flex-1 flex gap-3 items-center min-w-0">
              <Image
                src={
                  profile?.profile?.profileImg || "/images/default-avatar.svg"
                }
                width={39}
                height={39}
                alt="profile"
                className="w-[39px] h-[39px] rounded-full object-cover shrink-0"
              />
              <p className="text-sm text-black leading-[1.7] truncate">
                {profile?.my?.email || ""}
              </p>
            </div>
            <LocalizedLink
              href="/profile"
              className="bg-[#f3f4f6] h-10 px-3 rounded-lg flex items-center justify-center shrink-0"
            >
              <span className="text-sm font-medium text-[#374151]">
                <Trans>계정 정보</Trans>
              </span>
            </LocalizedLink>
          </div>

          {/* Mobile Tabs */}
          <div className="flex flex-col gap-3">
            <div className="border-b border-[#e5e7eb] flex items-center">
              {getMobileTabs(_).map((tab) => {
                const countMap = {
                  applied: counts.applied,
                  selected: counts.selected,
                  registered: counts.registered,
                  ended: counts.ended,
                  rejected: counts.rejected,
                };
                const count = countMap[tab.key] ?? 0;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex-1 min-w-0 px-1 py-2.5 cursor-pointer text-sm text-center whitespace-nowrap ${
                      isActive
                        ? "border-b border-black font-bold text-black"
                        : "font-medium text-[#9da0a8]"
                    }`}
                  >
                    {tab.label}{" "}
                    <span className={isActive ? "text-[#ea3a50]" : ""}>
                      {counts.isLoading ? "-" : count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Campaign List */}
            <div className="flex flex-col">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <MobileCampaignCardSkeleton key={index} />
                ))
              ) : campaigns.length === 0 ? (
                <EmptyState status={activeTab} />
              ) : (
                campaigns.map((campaign) => (
                  <MobileCampaignCard
                    key={campaign.missionId}
                    campaign={campaign}
                    status={activeTab}
                    onViewApplication={handleViewApplication}
                    onCancelApplication={handleCancelApplication}
                    onViewSelectedCampaign={handleViewSelectedCampaign}
                    onSubmitContent={handleSubmitContent}
                    onViewContent={handleViewContent}
                    onEditContent={handleEditContent}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && campaigns.length > 0 && paging && (
              <div className="flex justify-center py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={paging.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block container mx-auto px-4">
        <div className="grid md:grid-cols-8">
          {/* Sidebar */}
          <div className="col-span-2 pt-10">
            <h1 className="text-[#111827] text-2xl font-bold">
              <Trans>마이페이지</Trans>
            </h1>

            <div className="pl-3 mt-5">
              <LocalizedLink
                href="/my-campaign"
                className="text-lg transition-colors font-semibold text-[#111827] block"
              >
                <Trans>나의 캠페인</Trans>
              </LocalizedLink>
              <LocalizedLink
                href="/profile"
                className="text-lg mt-3 block transition-colors text-[#9CA3AF]"
              >
                <Trans>계정 정보</Trans>
              </LocalizedLink>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-6 md:border-l min-h-[64vh] border-[#e5e7eb] md:pl-10 py-10 flex flex-col gap-5.75">
            <h2 className="text-xl font-semibold text-[#111827] leading-normal">
              <Trans>나의 캠페인</Trans>
            </h2>

            <div className="flex flex-col gap-3">
              {/* Tab Menu */}
              <div className="border-b border-[#e5e7eb] flex items-center">
                {getTabs(_).map((tab) => {
                  const countMap = {
                    applied: counts.applied,
                    selected: counts.selected,
                    registered: counts.registered,
                    ended: counts.ended,
                    rejected: counts.rejected,
                  };
                  const count = countMap[tab.key] ?? 0;
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleTabChange(tab.key)}
                      className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                        isActive
                          ? "border-b border-black font-bold text-[#111827]"
                          : "font-medium text-[#9ca3af]"
                      }`}
                    >
                      {tab.label}{" "}
                      <span className={isActive ? "text-[#ea3a50]" : ""}>
                        {counts.isLoading ? "-" : count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Campaign List */}
              <div className="flex flex-col">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 4 }).map((_, index) => (
                    <CampaignCardSkeleton key={index} />
                  ))
                ) : campaigns.length === 0 ? (
                  // Empty state
                  <EmptyState status={activeTab} />
                ) : (
                  // Campaign list
                  campaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.missionId}
                      campaign={campaign}
                      status={activeTab}
                      onViewApplication={handleViewApplication}
                      onCancelApplication={handleCancelApplication}
                      onViewSelectedCampaign={handleViewSelectedCampaign}
                      onSubmitContent={handleSubmitContent}
                      onViewContent={handleViewContent}
                      onEditContent={handleEditContent}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {!isLoading && campaigns.length > 0 && paging && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={paging.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ViewApplicationDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        campaign={selectedCampaign}
        onCancel={handleCancelFromView}
      />

      <CancelConfirmDialog
        open={cancelConfirmDialogOpen}
        onOpenChange={setCancelConfirmDialogOpen}
        missionId={selectedCampaign?.missionId ?? null}
        onSuccess={handleCancelSuccess}
      />

      <CancelSuccessDialog
        open={cancelSuccessDialogOpen}
        onOpenChange={setCancelSuccessDialogOpen}
      />

      <ViewSelectedCampaignDialog
        open={viewSelectedDialogOpen}
        onOpenChange={setViewSelectedDialogOpen}
        campaign={selectedCampaign}
      />

      <SubmitContentDialog
        open={submitContentDialogOpen}
        onOpenChange={setSubmitContentDialogOpen}
        campaign={selectedCampaign}
        onSuccess={handleContentSubmitSuccess}
      />

      <ViewContentDialog
        open={viewContentDialogOpen}
        onOpenChange={setViewContentDialogOpen}
        campaign={selectedCampaign}
      />

      <EditContentDialog
        open={editContentDialogOpen}
        onOpenChange={setEditContentDialogOpen}
        campaign={selectedCampaign}
        onSuccess={handleContentEditSuccess}
      />
    </>
  );
}
