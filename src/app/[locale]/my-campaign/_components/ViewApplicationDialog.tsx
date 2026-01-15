"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getSocialLabel, type MyCampaign } from "@/lib/api/campaign";
import { toKoreaTime } from "@/lib/date-utils";
import { getLocalizedContent } from "@/lib/localized-content";

interface ViewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: MyCampaign | null;
  onCancel: () => void;
}

function formatVisitDateTime(start: string | null, end: string | null): string {
  if (!start || !end) return "-";

  const startDate = toKoreaTime(start);
  const endDate = toKoreaTime(end);

  const dateStr = startDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const startTime = startDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const endTime = endDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateStr} ${startTime} ~ ${endTime}`;
}

export function ViewApplicationDialog({
  open,
  onOpenChange,
  campaign,
  onCancel,
}: ViewApplicationDialogProps) {
  const { _ } = useLingui();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";

  if (!campaign) return null;

  // Get localized content
  const displayTitle = getLocalizedContent(campaign.title, campaign.titleCn, locale);
  const displayGoodsContents = getLocalizedContent(campaign.goodsContents, campaign.goodsContentsCn, locale);

  const handleCancel = () => {
    onOpenChange(false);
    onCancel();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[400px] h-full max-h-screen p-0 gap-0 overflow-hidden flex flex-col rounded-none sm:rounded-lg"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[21px] py-5 bg-white shrink-0">
          <DialogTitle className="text-base font-semibold text-[#242424]">
            <Trans>캠페인 신청서</Trans>
          </DialogTitle>
          <button
            onClick={handleClose}
            className="text-[#0a0a0a] hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 px-[21px] py-4 bg-white flex-1 overflow-y-auto">
          {/* Campaign Info */}
          <div className="flex gap-3 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                <Trans>신청 캠페인</Trans>
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-base font-medium text-black leading-[1.5]">
                {displayTitle}
              </p>
              <p className="text-sm text-[#6b7280] leading-5">
                {displayGoodsContents}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e5e7eb]" />

          {/* Application Details */}
          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                <Trans>이름</Trans>
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {campaign.userName}
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                {getSocialLabel(campaign.social, _)} <Trans>링크</Trans>
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7] break-all">
              {campaign.instagramLink || "-"}
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                <Trans>위챗 아이디</Trans>
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {campaign.wechatId || "-"}
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                <Trans>방문일 및 시간</Trans>
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {formatVisitDateTime(
                campaign.visitDatetimeStart,
                campaign.visitDatetimeEnd
              )}
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                <Trans>메모</Trans>
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {campaign.memo || "-"}
            </p>
          </div>

          {/* Warning Text */}
          <p className="text-sm text-[#e72b23] leading-[1.7]">
            <Trans>
              *입력한 정보의 수정을 원할 시 신청 취소 후 다시 신청해야 하며,
              선정 이후에는 정보를 변경할 수 없습니다.
            </Trans>
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-[21px] py-4 bg-white shrink-0 mt-auto">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-1/2 h-10 text-sm font-medium text-[#ea3a50] border-[#ea3a50] hover:bg-[#ea3a50]/5 rounded-lg"
          >
            <Trans>신청 취소</Trans>
          </Button>
          <Button
            onClick={handleClose}
            className="w-1/2 h-10 text-sm font-medium bg-[#ea3a50] hover:bg-[#d63447] text-white rounded-lg"
          >
            <Trans>확인</Trans>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
