"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

type AlertType = "already-applied" | "success";

interface CampaignAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: AlertType;
}

const alertContent: Record<AlertType, { title: string; description: string }> =
  {
    "already-applied": {
      title: "이미 신청한 캠페인 입니다",
      description:
        "신청한 캠페인은 마이페이지 신청내역에서 확인할 수 있습니다.",
    },
    success: {
      title: "캠페인 신청완료",
      description:
        "신청한 캠페인은 마이페이지 신청내역에서 확인할 수 있습니다.",
    },
  };

export function CampaignAlertDialog({
  open,
  onOpenChange,
  type,
}: CampaignAlertDialogProps) {
  const { push } = useLocalizedNavigation();

  const content = alertContent[type];

  const handleViewApplicationList = () => {
    onOpenChange(false);
    push("my-campaign");
  };

  const handleOk = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-85 p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-2 bg-white">
          <p className="flex-1 text-base font-medium text-[#111827] leading-normal pr-4">
            {content.title}
          </p>
          <button
            onClick={handleOk}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 bg-white">
          <p className="text-sm text-[#6b7280] leading-normal text-center">
            {content.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 bg-white">
          <Button
            variant="outline"
            onClick={handleViewApplicationList}
            className="flex-1 h-10 text-sm font-medium text-[#ea3a50] border-[#ea3a50] hover:bg-[#ea3a50]/5 rounded-lg"
          >
            신청내역 보러가기
          </Button>
          <Button
            onClick={handleOk}
            className="flex-1 h-10 text-sm font-medium bg-[#ea3a50] hover:bg-[#d63447] text-white rounded-lg"
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
