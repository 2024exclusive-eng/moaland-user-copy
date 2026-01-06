"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import Image from "next/image";

import { useMql } from "@/shared/hooks/use-mql";

export function FloatingInquiryButton() {
  const { _ } = useLingui();
  const mql = useMql();

  return (
    <a
      href="http://pf.kakao.com/_IRpxhn"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-8 right-3 md:right-8 z-50 flex cursor-pointer items-center gap-2 px-3.5 py-3.5 md:py-2.5 bg-black text-white rounded-full shadow-[0_4px_4px_0_rgba(0,0,0,0.15)] hover:bg-gray-800 transition-colors"
      aria-label={_(msg`문의하기`)}
    >
      <Image
        src="/icons/chats.svg"
        width={mql ? 18 : 24}
        height={mql ? 18 : 24}
        alt="chats"
      />
      <span className="md:block hidden text-base font-medium leading-normal">
        <Trans>문의하기</Trans>
      </span>
    </a>
  );
}
