"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getSocialLabel,
  parseSocialPlatforms,
  type MyCampaign,
} from "@/lib/api/campaign";
import { getLocalizedContent } from "@/lib/localized-content";

interface ViewContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: MyCampaign | null;
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start || !end) return "-";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}.${day}`;
  };

  return `${formatDate(startDate)}~${formatDate(endDate)}`;
}

// Parse the link field which contains JSON object of platform URLs
function parseLinks(link: string | null): Record<string, string> {
  if (!link) return {};
  try {
    return JSON.parse(link);
  } catch {
    return {};
  }
}

export function ViewContentDialog({
  open,
  onOpenChange,
  campaign,
}: ViewContentDialogProps) {
  const { _ } = useLingui();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";

  if (!campaign) return null;

  // Get localized content
  const displayTitle = getLocalizedContent(campaign.title, campaign.titleCn, locale);
  const displayGoodsContents = getLocalizedContent(campaign.goodsContents, campaign.goodsContentsCn, locale);

  const handleClose = () => {
    onOpenChange(false);
  };

  const platforms = parseSocialPlatforms(campaign.social);
  const links = parseLinks(campaign.link);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[400px] p-0 gap-0 overflow-hidden rounded-lg"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 bg-white">
          <DialogTitle className="text-base font-semibold text-[#242424]">
            <Trans>콘텐츠 수정</Trans>
          </DialogTitle>
          <button
            onClick={handleClose}
            className="text-[#111827] hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 px-5 py-4 bg-white">
          {/* Campaign Info */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
              <Trans>신청 캠페인</Trans>
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-[#111827] leading-[1.5]">
                {displayTitle}
              </p>
              <p className="text-sm text-[#6b7280] leading-5">
                {displayGoodsContents}
              </p>
            </div>
          </div>

          {/* Content Registration Period */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
              <Trans>콘텐츠 등록기간</Trans>
            </p>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {formatDateRange(
                campaign.contentStartDate,
                campaign.contentEndDate
              )}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e5e7eb]" />

          {/* Content URLs - View Only */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
              <Trans>콘텐츠 URL</Trans>
            </p>
            <div className="flex flex-col gap-2">
              {platforms.map((platform) => (
                <div key={platform} className="flex flex-col gap-1">
                  {platforms.length > 1 && (
                    <p className="text-xs text-[#9ca3af]">
                      {getSocialLabel(platform, _)}
                    </p>
                  )}
                  {links[platform] ? (
                    <a
                      href={links[platform]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#6b7280] font-medium leading-5 underline break-all hover:text-[#4b5563]"
                    >
                      {links[platform]}
                    </a>
                  ) : (
                    <p className="text-sm text-[#9ca3af] leading-5">-</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Warning Text */}
          <p className="text-sm text-[#ea3a50] leading-[1.7]">
            <Trans>*콘텐츠 등록기간이 지나면 수정할 수 없습니다.</Trans>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
