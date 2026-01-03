"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cancelCampaignApplication } from "@/lib/api/campaign";

interface CancelConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: number | null;
  onSuccess: () => void;
}

export function CancelConfirmDialog({
  open,
  onOpenChange,
  missionId,
  onSuccess,
}: CancelConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirmCancel = async () => {
    if (!missionId) return;

    setIsSubmitting(true);
    try {
      const response = await cancelCampaignApplication(missionId);
      if (response.success) {
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to cancel application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[340px] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 bg-white">
          <div className="w-5" /> {/* Spacer for centering */}
          <DialogTitle className="text-base font-semibold text-[#242424] text-center">
            캠페인 신청취소
          </DialogTitle>
          <button
            onClick={handleCancel}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-5 py-4 bg-white">
          <div className="text-base font-medium text-[#374151] text-center tracking-[-0.3px] leading-7">
            <p>캠페인 신청을 취소할까요?</p>
            <p>캠페인은 신청기간내 재신청이 가능합니다.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 py-4 bg-white">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-1/2 h-10 text-sm font-medium text-[#374151] border-[#e5e7eb] hover:bg-gray-50 rounded-lg"
          >
            취소
          </Button>
          <Button
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
            className="w-1/2 h-10 text-sm font-medium bg-[#ea3a50] hover:bg-[#d63447] text-white rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "취소 중..." : "캠페인 신청 취소하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
