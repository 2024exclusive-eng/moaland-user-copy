"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { X } from "lucide-react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface WeChatQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Shared WeChat QR popup. Used by the floating inquiry button and by any banner
 * whose linkType is "wechat" (P20).
 */
export function WeChatQRDialog({ open, onOpenChange }: WeChatQRDialogProps) {
  const { _ } = useLingui();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[372px] p-0 gap-0 overflow-hidden rounded-lg"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="bg-white flex items-center justify-between px-5 py-4 h-15">
          <div className="size-5" /> {/* Spacer for alignment */}
          <DialogTitle className="text-base font-semibold text-[#242424] leading-[1.7]">
            {_(msg`위챗 문의채널`)}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-800 hover:text-gray-600 transition-colors size-5"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* QR Code Content */}
        <div className="bg-white flex flex-col items-center justify-center px-5 pb-4">
          <div className="size-64.5 relative">
            <Image
              src="/wechat-qr.png"
              alt="WeChat QR Code"
              width={258}
              height={258}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
