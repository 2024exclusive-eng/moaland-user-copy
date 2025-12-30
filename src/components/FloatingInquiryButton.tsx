"use client";

import Image from "next/image";

export function FloatingInquiryButton() {
  return (
    <a
      href="http://pf.kakao.com/_IRpxhn"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex cursor-pointer items-center gap-2 px-3.5 py-2.5 bg-black text-white rounded-full shadow-[0_4px_4px_0_rgba(0,0,0,0.15)] hover:bg-gray-800 transition-colors"
      aria-label="문의하기"
    >
      <Image src="/icons/chats.svg" width={24} height={24} alt="chats" />
      <span className="text-base font-medium leading-normal">문의하기</span>
    </a>
  );
}
