"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LocalizedDateTimePicker } from "@/components/ui/localized-datetime-picker";
import {
  applyForCampaign,
  type CampaignApplyRequest,
  getSocialLabel,
} from "@/lib/api/campaign";
import { extractErrorMessage } from "@/shared/hooks/use-auth";

interface CampaignApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: number;
  campaignTitle: string;
  campaignSubtitle: string;
  social: string;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  instagramLink: string;
  wechatId: string;
  visitDatetime: Date | null;
  memo: string;
}

interface FormErrors {
  name?: string;
  instagramLink?: string;
  wechatId?: string;
  visitDatetime?: string;
}

export function CampaignApplyDialog({
  open,
  onOpenChange,
  missionId,
  campaignTitle,
  campaignSubtitle,
  social,
  onSuccess,
}: CampaignApplyDialogProps) {
  const { _ } = useLingui();
  const socialLabel = getSocialLabel(social, _);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    instagramLink: "",
    wechatId: "",
    visitDatetime: null,
    memo: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = _(msg`이름을 입력해주세요`);
    }
    if (!formData.instagramLink.trim()) {
      newErrors.instagramLink = _(msg`${socialLabel} 링크를 입력해주세요`);
    }
    if (!formData.wechatId.trim()) {
      newErrors.wechatId = _(msg`위챗 아이디를 입력해주세요`);
    }
    if (!formData.visitDatetime) {
      newErrors.visitDatetime = _(msg`방문일 및 시간을 입력해주세요`);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    formData.name.trim() &&
    formData.instagramLink.trim() &&
    formData.wechatId.trim() &&
    formData.visitDatetime &&
    agreed;

  const handleSubmit = async () => {
    if (!validateForm() || !agreed || !formData.visitDatetime) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Parse the datetime and create a 2-hour window
      const visitStart = new Date(formData.visitDatetime);
      const visitEnd = new Date(visitStart.getTime() + 2 * 60 * 60 * 1000);

      const requestData: CampaignApplyRequest = {
        name: formData.name,
        instagramLink: formData.instagramLink,
        wechatId: formData.wechatId,
        visitDatetimeStart: visitStart.toISOString(),
        visitDatetimeEnd: visitEnd.toISOString(),
        memo: formData.memo || undefined,
      };

      const response = await applyForCampaign(missionId, requestData);

      if (response.success) {
        onSuccess?.();
        onOpenChange(false);
        // Reset form
        setFormData({
          name: "",
          instagramLink: "",
          wechatId: "",
          visitDatetime: null,
          memo: "",
        });
        setAgreed(false);
      } else {
        setSubmitError(
          extractErrorMessage(response, _(msg`신청에 실패했습니다`))
        );
      }
    } catch (error) {
      console.error("Failed to apply:", error);
      setSubmitError(
        extractErrorMessage(
          error,
          _(msg`오류가 발생했습니다. 다시 시도해주세요.`)
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="md:max-w-[400px] md:h-auto h-full w-full max-w-full md:rounded-lg rounded-none p-0 gap-0 overflow-visible flex flex-col"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-[21px] py-4 bg-white h-[60px] shrink-0">
            <DialogTitle className="text-base font-semibold text-[#242424]">
              {_(msg`캠페인 신청서`)}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-800 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 flex flex-col gap-5 px-[21px] py-4 bg-white overflow-y-auto min-h-0">
            {/* Campaign Info */}
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-[#111827] leading-[1.5]">
                {campaignTitle}
              </p>
              <p className="text-sm text-[#6b7280] leading-5">
                {campaignSubtitle}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e5e7eb]" />

            {/* Form Fields */}
            <div className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex gap-2 items-center">
                <div className="w-[100px] shrink-0">
                  <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                    {_(msg`이름`)}
                  </span>
                  <span className="text-sm font-semibold text-[#ff614e]">
                    *
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={_(msg`이름 입력`)}
                  className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
                />
              </div>

              {/* Social Link */}
              <div className="flex gap-2 items-center">
                <div className="w-[100px] shrink-0">
                  <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                    {_(msg`${socialLabel} 링크`)}
                  </span>
                  <span className="text-sm font-semibold text-[#ff614e]">
                    *
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.instagramLink}
                  onChange={(e) =>
                    handleInputChange("instagramLink", e.target.value)
                  }
                  placeholder={_(msg`${socialLabel} 링크 입력`)}
                  className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
                />
              </div>

              {/* WeChat ID */}
              <div className="flex gap-2 items-center">
                <div className="w-[100px] shrink-0">
                  <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                    {_(msg`위챗 아이디`)}
                  </span>
                  <span className="text-sm font-semibold text-[#ff614e]">
                    *
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.wechatId}
                  onChange={(e) =>
                    handleInputChange("wechatId", e.target.value)
                  }
                  placeholder={_(msg`위챗 아이디 입력`)}
                  className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
                />
              </div>

              {/* Visit Date and Time */}
              <div className="flex gap-2 items-center">
                <div className="w-[100px] whitespace-nowrap shrink-0">
                  <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                    {_(msg`방문일 및 시간`)}
                  </span>
                  <span className="text-sm font-semibold text-[#ff614e]">
                    *
                  </span>
                </div>
                <div className="flex-1">
                  <LocalizedDateTimePicker
                    value={formData.visitDatetime}
                    onChange={(date) =>
                      setFormData((prev) => ({ ...prev, visitDatetime: date }))
                    }
                    placeholder={_(msg`날짜 및 시간 선택`)}
                    minDate={new Date()}
                  />
                </div>
              </div>

              {/* Memo */}
              <div className="flex gap-2 items-center">
                <div className="w-[100px] shrink-0">
                  <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                    {_(msg`메모`)}
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.memo}
                  onChange={(e) => handleInputChange("memo", e.target.value)}
                  placeholder={_(msg`메모`)}
                  className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
                />
              </div>

              {/* Agreement Checkbox */}
              <div className="flex gap-3 items-start">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="mt-0.5 w-5 h-5 rounded-[3px] data-[state=checked]:bg-[#ea3a50] data-[state=checked]:border-[#ea3a50]"
                />
                <p className="flex-1 text-sm text-[#4b5563] leading-[1.7]">
                  {_(
                    msg`캠페인 유의사항, 개인정보 및 콘텐츠 제3자 제공, 저작물 이용에 동의합니다.`
                  )}{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsPopup(true)}
                    className="underline hover:text-[#ea3a50] transition-colors"
                  >
                    {_(msg`자세히보기`)}
                  </button>
                </p>
              </div>

              {/* Warning Text */}
              <p className="text-sm text-[#e72b23] leading-[1.7]">
                {_(
                  msg`*입력한 정보의 수정을 원할 시 신청 취소 후 다시 신청해야 하며, 선정 이후에는 정보를 변경할 수 없습니다.`
                )}
              </p>

              {/* Error Message */}
              {submitError && (
                <p className="text-sm text-[#e72b23] leading-[1.7]">
                  {submitError}
                </p>
              )}
            </div>
          </div>

          {/* Footer - Sticky at bottom */}
          <div className="px-[21px] py-4 bg-white shrink-0">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="w-full h-10 bg-[#ea3a50] hover:bg-[#d63447] text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? _(msg`신청중...`) : _(msg`캠페인 신청하기`)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Popup */}
      <Dialog open={showTermsPopup} onOpenChange={setShowTermsPopup}>
        <DialogContent
          className="max-w-[400px] p-0 gap-0 overflow-hidden rounded-lg"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 bg-white">
            <DialogTitle className="text-base font-semibold text-[#242424]">
              {_(msg`캠페인 유의사항 및 저작물 이용 동의`)}
            </DialogTitle>
            <button
              onClick={() => setShowTermsPopup(false)}
              className="text-gray-800 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-4 bg-white">
            <ul className="text-sm text-[#6b7280] leading-[1.7] space-y-2 list-disc pl-5">
              <li>
                {_(
                  msg`정당한 사유 없이 콘텐츠 등록 기간 내 콘텐츠 및 구매평을 작성하지 않을 경우 제공상품 또는 용역의 대가를 환불해야 하며, 관련 법 조항(형법 제347조)에 따라 법적 처벌 대상이 될 수 있습니다.`
                )}
              </li>
              <li>
                {_(
                  msg`등록한 콘텐츠 및 구매평의 유지 기간(6개월) 미준수 시 제공 내역에 대한 비용이 청구될 수 있습니다.`
                )}
              </li>
              <li>
                {_(
                  msg`등록한 콘텐츠 및 구매평은 홍보나 필요에 의해 사용될 수 있으며, 광고주가 판매 사이트에 콘텐츠 활용을 할 수 있습니다. (광고 등 2차적 저작물 활용)`
                )}
              </li>
              <li>
                {_(
                  msg`제공 내역은 타인에게 양도 및 판매, 교환을 허용하지 않습니다.`
                )}
              </li>
              <li>
                {_(
                  msg`키워드 챌린지 캠페인은 최소 30일 동안 유지되어야 하며, 유지 기간 미준수 시 콘텐츠 재개 요청이 있을 수 있습니다.`
                )}
              </li>
              <li>
                {_(
                  msg`원활한 캠페인 서비스 제공을 위해 최소한의 범주 내에서 아래와 같이 개인정보를 제공합니다. 회원님께서는 제3자 제공에 동의하지 않으실 수 있으며, 이를 거부할 경우 일부 캠페인 참여가 제한됩니다.`
                )}
              </li>
            </ul>
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
    </>
  );
}
