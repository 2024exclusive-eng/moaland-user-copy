"use client";

import { Trans } from "@lingui/react/macro";
import Image from "next/image";

import LocalizedLink from "@/components/LocalizedLink";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

export function Footer() {
  const pn = useLocalizedNavigation();

  const needInquireSectionRoutes = ["/"].includes(pn.path);
  return (
    <footer>
      {needInquireSectionRoutes && (
        <div className="bg-[#FEF5F6] py-12 text-center">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              <Trans>광고주 이신가요?</Trans>
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              <Trans>지금 문의 해보세요! 누구나 손쉽게 시작할 수 있습니다.</Trans>
            </p>
            <a
              href="http://pf.kakao.com/_IRpxhn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#EA3A50] hover:bg-red-700 cursor-pointer text-white h-11 w-29 rounded-md font-medium transition-colors"
            >
              <Trans>문의하기</Trans>
            </a>
          </div>
        </div>
      )}

      {/* Footer Content */}
      <div className="border-t border-[#E5E7EB] bg-white">
        <div className="container mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row items-start gap-6 md:gap-12 lg:gap-20">
          {/* Logo */}
          <div className="w-full md:w-25 h-8 flex items-center md:shrink-0">
            <LocalizedLink href="/" className="inline-block">
              <Image src="/logo.png" width={78} height={16} alt="logo" />
            </LocalizedLink>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col gap-3 md:gap-3.5 w-full">
            {/* First Row - Company Info */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-[#4B5563] leading-normal">
              <span><Trans>서비스이름(주)</Trans></span>
              <span className="text-[#E5E7EB] hidden sm:inline">|</span>
              <span className="w-full sm:w-auto">
                <span className="font-bold"><Trans>대표</Trans></span> 홍길동
              </span>
              <span className="text-[#E5E7EB] hidden sm:inline">|</span>
              <span className="w-full sm:w-auto">
                <span className="font-bold"><Trans>사업자등록번호</Trans></span> 123412341234
              </span>
              <span className="text-[#E5E7EB] hidden sm:inline">|</span>
              <span className="w-full sm:w-auto">
                <span className="font-bold"><Trans>주소</Trans></span> 주소입니다.
              </span>
            </div>

            {/* Second Row - Contact */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-[#4B5563] leading-normal">
              <span className="font-bold"><Trans>문의</Trans></span>
              <span>010-1234-1234</span>
              <span className="text-[#E5E7EB]">|</span>
              <span>kviewo12@ email.com</span>
            </div>

            {/* Third Row - Links */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-[#4B5563] leading-normal">
              <LocalizedLink
                href="/privacy"
                className="font-bold hover:text-[#EA3A50]"
              >
                <Trans>개인정보처리방침</Trans>
              </LocalizedLink>
              <span className="text-[#E5E7EB]">|</span>
              <LocalizedLink
                href="/terms"
                className="font-bold hover:text-[#EA3A50]"
              >
                <Trans>이용약관</Trans>
              </LocalizedLink>
            </div>

            {/* Copyright */}
            <p className="text-xs text-[#4B5563] leading-normal">
              © {new Date().getFullYear()} servicename . All rights reserved
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 md:shrink-0">
            <button className="size-8 rounded-full bg-[#9CA3AF] hover:bg-[#6B7280] flex items-center justify-center transition-colors">
              <span className="sr-only">Instagram</span>
              <svg
                className="size-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
            <button className="size-8 rounded-full bg-[#9CA3AF] hover:bg-[#6B7280] flex items-center justify-center transition-colors">
              <span className="sr-only">Facebook</span>
              <svg
                className="size-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
