"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getLocalizedContent } from "@/lib/localized-content";
import { useFaqs } from "@/shared/hooks/use-content";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

interface FooterProps {
  shouldHideMobile?: boolean;
}

export function Footer({ shouldHideMobile = false }: FooterProps = {}) {
  const { _ } = useLingui();
  const pn = useLocalizedNavigation();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";
  const { faqs: termsContent } = useFaqs("terms_of_use");
  const { faqs: privacyContent } = useFaqs("privacy_policy");
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  const needInquireSectionRoutes = ["/"].includes(pn.path);

  // Mobile Footer
  const mobileFooter = !shouldHideMobile && (
    <footer className="md:hidden block bg-white">
      {needInquireSectionRoutes && (
        <div className="bg-[#FEF5F6] py-12 text-center">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              <Trans>광고주 이신가요?</Trans>
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-50 text-center mx-auto">
              <Trans>
                지금 문의 해보세요! 누구나 손쉽게 시작할 수 있습니다.
              </Trans>
            </p>
            <a
              href="https://pf.kakao.com/_xcxmsbX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#EA3A50] hover:bg-red-700 cursor-pointer text-white h-11 w-29 rounded-md font-medium transition-colors"
            >
              <Trans>문의하기</Trans>
            </a>
          </div>
        </div>
      )}
      <div className="border-t border-[#E5E7EB] px-4 py-8 pb-20">
        {/* Logo */}
        <div className="mb-6">
          <LocalizedLink href="/" className="inline-block">
            <Image src="/logo.png" width={78} height={16} alt="logo" />
          </LocalizedLink>
        </div>

        {/* Company Info */}
        <div className="flex flex-col gap-2 text-xs text-[#6B7280] leading-[1.7] mb-6">
          <div className="flex items-center whitespace-nowrap gap-2">
            <span>(주)익스클루시브</span>
            <span className="text-[#9DA0A8]">|</span>
            <span>
              <span className="font-bold">
                <Trans>대표</Trans>
              </span>{" "}
              김수현
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex gap-2">
              <span className="font-bold">
                <Trans>사업자등록번호</Trans>
              </span>{" "}
              443-81-03412
            </span>
            <span className="flex gap-2">
              <span className="font-bold">
                <Trans>주소</Trans>
              </span>{" "}
              서울 금천구 디지털로 178(가산퍼블릭 B동 1801호)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold">
              <Trans>문의</Trans>
            </span>
            <span>help@moaland21.com</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrivacyPopup(true)}
              className="font-bold hover:text-[#EA3A50]"
            >
              <Trans>개인정보처리방침</Trans>
            </button>
            <span className="text-[#9DA0A8]">|</span>
            <button
              onClick={() => setShowTermsPopup(true)}
              className="font-bold hover:text-[#EA3A50]"
            >
              <Trans>이용약관</Trans>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#6B7280] leading-[1.7] mb-4">
          © {new Date().getFullYear()} (주)익스클루시브.
        </p>
      </div>
    </footer>
  );

  // Desktop Footer
  const desktopFooter = (
    <footer className="hidden md:block">
      {needInquireSectionRoutes && (
        <div className="bg-[#FEF5F6] py-12 text-center">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              <Trans>광고주 이신가요?</Trans>
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              <Trans>
                지금 문의 해보세요! 누구나 손쉽게 시작할 수 있습니다.
              </Trans>
            </p>
            <a
              href="https://pf.kakao.com/_xcxmsbX"
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
              <span>(주)익스클루시브</span>
              <span className="text-[#9DA0A8] hidden sm:inline">|</span>
              <span className="w-full sm:w-auto">
                <span className="font-bold">
                  <Trans>대표</Trans>
                </span>{" "}
                김수현
              </span>
              <span className="text-[#9DA0A8] hidden sm:inline">|</span>
              <span className="w-full sm:w-auto">
                <span className="font-bold">
                  <Trans>사업자등록번호</Trans>
                </span>{" "}
                443-81-03412
              </span>
              <span className="text-[#9DA0A8] hidden sm:inline">|</span>
              <span className="w-full sm:w-auto">
                <span className="font-bold">
                  <Trans>주소</Trans>
                </span>{" "}
                서울 금천구 디지털로 178(가산퍼블릭 B동 1801호)
              </span>
            </div>

            {/* Second Row - Contact */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-[#4B5563] leading-normal">
              <span className="font-bold">
                <Trans>문의</Trans>
              </span>
              <span>help@moaland21.com</span>
            </div>

            {/* Third Row - Links */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-[#4B5563] leading-normal">
              <button
                onClick={() => setShowPrivacyPopup(true)}
                className="font-bold hover:text-[#EA3A50]"
              >
                <Trans>개인정보처리방침</Trans>
              </button>
              <span className="text-[#9DA0A8]">|</span>
              <button
                onClick={() => setShowTermsPopup(true)}
                className="font-bold hover:text-[#EA3A50]"
              >
                <Trans>이용약관</Trans>
              </button>
            </div>

            {/* Copyright */}
            <p className="text-xs text-[#4B5563] leading-normal">
              © {new Date().getFullYear()} (주)익스클루시브.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      {mobileFooter}
      {desktopFooter}

      {/* Terms of Service Modal */}
      <Dialog open={showTermsPopup} onOpenChange={setShowTermsPopup}>
        <DialogContent
          className="max-w-[400px] p-0 gap-0 overflow-hidden rounded-lg"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 bg-white">
            <DialogTitle className="text-base font-semibold text-[#242424]">
              {_(msg`이용약관`)}
            </DialogTitle>
            <button
              onClick={() => setShowTermsPopup(false)}
              className="text-gray-800 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-4 bg-white max-h-[400px] overflow-y-auto">
            {termsContent.length > 0 ? (
              <div className="space-y-6">
                {termsContent.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-[#6b7280] ck-content leading-[1.7] ck-content"
                    dangerouslySetInnerHTML={{
                      __html: getLocalizedContent(
                        item.answer,
                        item.answerCn,
                        locale
                      ),
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6b7280] leading-[1.7]">
                {_(
                  msg`서비스 이용약관의 전체 내용은 지원 페이지(/support)에서 확인하실 수 있습니다.`
                )}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-white">
            <Button
              onClick={() => setShowTermsPopup(false)}
              className="w-full h-10 bg-[#ea3a50] hover:bg-[#d63447] text-white text-sm font-medium rounded-lg"
            >
              {_(msg`확인`)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyPopup} onOpenChange={setShowPrivacyPopup}>
        <DialogContent
          className="max-w-[400px] p-0 gap-0 overflow-hidden rounded-lg"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 bg-white">
            <DialogTitle className="text-base font-semibold text-[#242424]">
              {_(msg`개인정보처리방침`)}
            </DialogTitle>
            <button
              onClick={() => setShowPrivacyPopup(false)}
              className="text-gray-800 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-4 bg-white max-h-[400px] ck-content overflow-y-auto">
            {privacyContent.length > 0 ? (
              <div className="space-y-6">
                {privacyContent.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-[#6b7280] leading-[1.7] ck-content"
                    dangerouslySetInnerHTML={{
                      __html: getLocalizedContent(
                        item.answer,
                        item.answerCn,
                        locale
                      ),
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6b7280] leading-[1.7]">
                {_(
                  msg`개인정보처리방침의 전체 내용은 지원 페이지(/support)에서 확인하실 수 있습니다.`
                )}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-white">
            <Button
              onClick={() => setShowPrivacyPopup(false)}
              className="w-full h-10 bg-[#ea3a50] hover:bg-[#d63447] text-white text-sm font-medium rounded-lg"
            >
              {_(msg`확인`)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
