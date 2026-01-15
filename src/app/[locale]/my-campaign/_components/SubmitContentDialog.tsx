"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getSocialLabel,
  type MyCampaign,
  parseSocialPlatforms,
  submitContentLinks,
} from "@/lib/api/campaign";
import { formatDateMMDD, toKoreaTime } from "@/lib/date-utils";
import { getLocalizedContent } from "@/lib/localized-content";

interface SubmitContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: MyCampaign | null;
  onSuccess: () => void;
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start || !end) return "-";

  const startDate = toKoreaTime(start);
  const endDate = toKoreaTime(end);

  return `${formatDateMMDD(startDate)}~${formatDateMMDD(endDate)}`;
}

export function SubmitContentDialog({
  open,
  onOpenChange,
  campaign,
  onSuccess,
}: SubmitContentDialogProps) {
  const { _ } = useLingui();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";
  const [links, setLinks] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get platforms from campaign
  const platforms = campaign ? parseSocialPlatforms(campaign.social) : [];

  // Get localized content
  const displayTitle = campaign
    ? getLocalizedContent(campaign.title, campaign.titleCn, locale)
    : "";
  const displayGoodsContents = campaign
    ? getLocalizedContent(campaign.goodsContents, campaign.goodsContentsCn, locale)
    : "";

  // Reset links when dialog opens or campaign changes
  useEffect(() => {
    if (open && campaign) {
      const initialLinks: Record<string, string> = {};
      platforms.forEach((platform) => {
        initialLinks[platform] = "";
      });
      setLinks(initialLinks);
      setError(null);
    }
  }, [open, campaign?.missionId]);

  if (!campaign) return null;

  const handleClose = () => {
    setLinks({});
    setError(null);
    onOpenChange(false);
  };

  const handleLinkChange = (platform: string, value: string) => {
    setLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate all platform links are filled
    const emptyPlatforms = platforms.filter((p) => !links[p]?.trim());
    if (emptyPlatforms.length > 0) {
      const labels = emptyPlatforms.map((p) => getSocialLabel(p, _)).join(", ");
      setError(_(msg`${labels} URL을 입력해주세요.`));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitContentLinks(campaign.missionId, links);

      if (response.success) {
        handleClose();
        onSuccess();
      } else {
        setError(response.error?.message || _(msg`등록에 실패했습니다.`));
      }
    } catch {
      setError(_(msg`등록 중 오류가 발생했습니다.`));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[400px] p-0 gap-0 overflow-hidden rounded-lg"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 bg-white">
          <DialogTitle className="text-base font-semibold text-[#242424]">
            <Trans>콘텐츠 등록하기</Trans>
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
          <div className="flex gap-3 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                <Trans>신청 캠페인</Trans>
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-base font-medium text-[#111827] leading-[1.5]">
                {displayTitle}
              </p>
              <p className="text-sm text-[#6b7280] leading-5">
                {displayGoodsContents}
              </p>
            </div>
          </div>

          {/* Content Registration Period */}
          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                <Trans>콘텐츠 등록기간</Trans>
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {formatDateRange(
                campaign.contentStartDate,
                campaign.contentEndDate
              )}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e5e7eb]" />

          {/* Content URL Inputs for each platform */}
          {platforms.map((platform) => (
            <div key={platform} className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                {getSocialLabel(platform, _)} URL
              </p>
              <input
                type="url"
                value={links[platform] || ""}
                onChange={(e) => handleLinkChange(platform, e.target.value)}
                placeholder={_(
                  msg`${getSocialLabel(platform, _)} URL을 등록해주세요.`
                )}
                className="w-full h-10 px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50] transition-colors"
              />
            </div>
          ))}

          {error && <p className="text-sm text-[#ea3a50]">{error}</p>}

          {/* Warning Text */}
          <p className="text-sm text-[#ea3a50] leading-[1.7]">
            <Trans>*콘텐츠 등록기간이 지나면 수정할 수 없습니다.</Trans>
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-white">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-10 text-sm font-medium bg-[#ea3a50] hover:bg-[#d63447] text-white rounded-lg"
          >
            {isSubmitting ? _(msg`등록 중...`) : _(msg`등록하기`)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
