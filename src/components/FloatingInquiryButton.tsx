"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingInquiryButton() {
  const { _ } = useLingui();
  const [showWeChatDialog, setShowWeChatDialog] = useState(false);

  return (
    <TooltipProvider>
      <div className="fixed bottom-20 md:bottom-8 right-3 md:right-8 z-50 flex flex-col gap-2">
        {/* WeChat Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowWeChatDialog(true)}
              className="size-13 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] p-3.5"
              aria-label={_(msg`위챗문의`)}
            >
              <svg
                className="size-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.58 2.78 4.69L4 17l2.5-1.5c.89.31 1.87.5 2.91.5.14 0 .29 0 .43-.01A5.5 5.5 0 0 0 14.5 9c0-3.31-3.36-5-5-5zm-2.5 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.5 1c-2.76 0-5 1.79-5 4s2.24 4 5 4c.83 0 1.62-.17 2.33-.46L20 20l-.67-1.81C20.56 17.28 21.5 16.2 21.5 15c0-2.21-2.24-4-5-4zm-2 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-[rgba(0,0,0,0.6)] text-white px-[10px] py-[4px] rounded-[4px] text-sm leading-[1.7]"
          >
            <p>{_(msg`위챗문의`)}</p>
          </TooltipContent>
        </Tooltip>

        {/* KakaoTalk Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://pf.kakao.com/_UaixfX"
              target="_blank"
              rel="noopener noreferrer"
              className="size-13 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] p-3.5"
              aria-label={_(msg`카카오문의`)}
            >
              <svg
                className="size-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.681l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944zm-5.857-1.092l.696-1.707.638 1.707H9.092zm2.523.488l.002-.016a.469.469 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474.696.696 0 0 0-.653.447l-1.661 4.075a.472.472 0 0 0 .874.357l.33-.813h2.07l.299.8a.472.472 0 1 0 .884-.33l-.345-.926zM8.293 9.302a.472.472 0 0 0-.471-.472H4.577a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14c.261 0 .472-.212.472-.472z" />
              </svg>
            </a>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-[rgba(0,0,0,0.6)] text-white px-[10px] py-[4px] rounded-[4px] text-sm leading-[1.7]"
          >
            <p>{_(msg`카카오문의`)}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* WeChat QR Code Dialog */}
      <Dialog open={showWeChatDialog} onOpenChange={setShowWeChatDialog}>
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
              onClick={() => setShowWeChatDialog(false)}
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
    </TooltipProvider>
  );
}
