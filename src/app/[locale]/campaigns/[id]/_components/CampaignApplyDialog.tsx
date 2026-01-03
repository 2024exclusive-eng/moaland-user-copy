"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  applyForCampaign,
  type CampaignApplyRequest,
  getSocialLabel,
} from "@/lib/api/campaign";

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
  visitDatetime: string;
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
  const socialLabel = getSocialLabel(social);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    instagramLink: "",
    wechatId: "",
    visitDatetime: "",
    memo: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }
    if (!formData.instagramLink.trim()) {
      newErrors.instagramLink = `${socialLabel} 링크를 입력해주세요`;
    }
    if (!formData.wechatId.trim()) {
      newErrors.wechatId = "위챗 아이디를 입력해주세요";
    }
    if (!formData.visitDatetime.trim()) {
      newErrors.visitDatetime = "방문일 및 시간을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    formData.name.trim() &&
    formData.instagramLink.trim() &&
    formData.wechatId.trim() &&
    formData.visitDatetime.trim() &&
    agreed;

  const handleSubmit = async () => {
    if (!validateForm() || !agreed) return;

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
          visitDatetime: "",
          memo: "",
        });
        setAgreed(false);
      } else {
        setSubmitError(response.error?.message || "Application failed");
      }
    } catch (error) {
      console.error("Failed to apply:", error);
      setSubmitError("An error occurred. Please try again.");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[400px] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 bg-white">
          <DialogTitle className="text-base font-semibold text-[#242424]">
            캠페인 신청서
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 px-5 py-4 bg-white">
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
              <div className="w-[140px] shrink-0">
                <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                  이름
                </span>
                <span className="text-sm font-semibold text-[#ff614e]">*</span>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="이름 입력"
                className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
              />
            </div>

            {/* Social Link */}
            <div className="flex gap-2 items-center">
              <div className="w-[140px] shrink-0">
                <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                  {socialLabel} 링크
                </span>
                <span className="text-sm font-semibold text-[#ff614e]">*</span>
              </div>
              <input
                type="text"
                value={formData.instagramLink}
                onChange={(e) =>
                  handleInputChange("instagramLink", e.target.value)
                }
                placeholder={`${socialLabel} 링크 입력`}
                className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
              />
            </div>

            {/* WeChat ID */}
            <div className="flex gap-2 items-center">
              <div className="w-[140px] shrink-0">
                <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                  위챗 아이디
                </span>
                <span className="text-sm font-semibold text-[#ff614e]">*</span>
              </div>
              <input
                type="text"
                value={formData.wechatId}
                onChange={(e) => handleInputChange("wechatId", e.target.value)}
                placeholder="위챗 아이디 입력"
                className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
              />
            </div>

            {/* Visit Date and Time */}
            <div className="flex gap-2 items-center">
              <div className="w-[140px] shrink-0">
                <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                  방문일 및 시간
                </span>
                <span className="text-sm font-semibold text-[#ff614e]">*</span>
              </div>
              <input
                type="datetime-local"
                value={formData.visitDatetime}
                onChange={(e) =>
                  handleInputChange("visitDatetime", e.target.value)
                }
                className="flex-1 h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50]"
              />
            </div>

            {/* Memo */}
            <div className="flex gap-2 items-center">
              <div className="w-[140px] shrink-0">
                <span className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
                  메모
                </span>
              </div>
              <input
                type="text"
                value={formData.memo}
                onChange={(e) => handleInputChange("memo", e.target.value)}
                placeholder="메모"
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
                캠페인 유의사항, 개인정보 및 콘텐츠 제3자 제공, 저작물 이용에
                동의합니다.{" "}
                <span className="underline">자세히보기</span>
              </p>
            </div>

            {/* Warning Text */}
            <p className="text-sm text-[#e72b23] leading-[1.7]">
              *입력한 정보의 수정을 원할 시 신청 취소 후 다시 신청해야 하며,
              선정 이후에는 정보를 변경할 수 없습니다.
            </p>

            {/* Error Message */}
            {submitError && (
              <p className="text-sm text-[#e72b23] leading-[1.7]">
                {submitError}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-white">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full h-10 bg-[#ea3a50] hover:bg-[#d63447] text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "신청중..." : "캠페인 신청하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
