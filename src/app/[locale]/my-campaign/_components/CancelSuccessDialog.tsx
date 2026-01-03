"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CancelSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelSuccessDialog({
  open,
  onOpenChange,
}: CancelSuccessDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
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
            신청 취소 완료
          </DialogTitle>
          <button
            onClick={handleClose}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-5 py-4 bg-white">
          <p className="text-base font-medium text-[#374151] text-center tracking-[-0.3px] leading-7">
            캠페인 신청이 취소되었습니다.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-white">
          <Button
            onClick={handleClose}
            className="w-full h-10 text-sm font-medium bg-[#ea3a50] hover:bg-[#d63447] text-white rounded-lg"
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
