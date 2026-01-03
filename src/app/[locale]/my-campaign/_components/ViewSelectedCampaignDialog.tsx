"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getSocialLabel, type MyCampaign } from "@/lib/api/campaign";

interface ViewSelectedCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: MyCampaign | null;
}

function formatVisitDateTime(start: string | null, end: string | null): string {
  if (!start || !end) return "-";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const dateStr = startDate.toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  const startTime = startDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr} ${startTime}`;
}

export function ViewSelectedCampaignDialog({
  open,
  onOpenChange,
  campaign,
}: ViewSelectedCampaignDialogProps) {
  if (!campaign) return null;

  const handleClose = () => {
    onOpenChange(false);
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
            캠페인 신청서
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
                신청 캠페인
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-base font-medium text-[#111827] leading-[1.5]">
                {campaign.title}
              </p>
              <p className="text-sm text-[#6b7280] leading-5">
                {campaign.goodsContents}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e5e7eb]" />

          {/* Application Details */}
          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                이름
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {campaign.userName}
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                {getSocialLabel(campaign.social)} 링크
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7] break-all">
              {campaign.instagramLink || "-"}
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                위챗 아이디
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {campaign.wechatId || "-"}
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="w-[100px] shrink-0">
              <p className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                방문일 및 시간
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
                메모
              </p>
            </div>
            <p className="text-sm text-[#374151] leading-[1.7]">
              {campaign.memo || "-"}
            </p>
          </div>

          {/* Warning Text */}
          <p className="text-sm text-[#ea3a50] leading-[1.7]">
            *캠페인 선정 이후에는 정보를 변경 할 수 없습니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
