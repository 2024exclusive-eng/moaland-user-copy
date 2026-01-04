"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { CheckCircle2, Eye, EyeOff, X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/shared/hooks/use-auth";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

const RegisterPage = () => {
  const { _ } = useLingui();
  const r = useLocalizedNavigation();
  const { sendVerificationCode, verifyCode, register, isLoading, clearError } =
    useAuth();

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
  });
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Validate password match when confirmPassword changes
      if (field === "confirmPassword") {
        if (newData.password && value) {
          if (newData.password !== value) {
            setPasswordError(_(msg`비밀번호가 일치하지 않습니다.`));
          } else {
            setPasswordError(null);
          }
        } else {
          // Clear error if confirmPassword is empty
          setPasswordError(null);
        }
      }
      // Also validate when password changes and confirmPassword already has value
      if (field === "password" && newData.confirmPassword) {
        if (value !== newData.confirmPassword) {
          setPasswordError(_(msg`비밀번호가 일치하지 않습니다.`));
        } else {
          setPasswordError(null);
        }
      }
      return newData;
    });
    setValidationError(null);
    if (field === "email") {
      setEmailError(null);
    }
    if (field === "verificationCode") {
      setVerificationError(null);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAgreementChange = (field: "all" | "terms" | "privacy") => {
    if (field === "all") {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        terms: newValue,
        privacy: newValue,
      });
    } else {
      const newAgreements = { ...agreements, [field]: !agreements[field] };
      newAgreements.all = newAgreements.terms && newAgreements.privacy;
      setAgreements(newAgreements);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setEmailError(_(msg`이메일을 입력해주세요.`));
      return;
    }
    if (!isValidEmail(formData.email)) {
      setEmailError(_(msg`잘못된 이메일 주소입니다.`));
      return;
    }
    clearError();
    setEmailError(null);
    try {
      const { verify } = await sendVerificationCode(formData.email);
      setVerifyToken(verify);
      setIsCodeSent(true);
      setIsVerified(false);
    } catch {
      // Error is handled by useAuth hook
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode || !verifyToken) {
      setVerificationError(_(msg`인증번호를 입력해주세요.`));
      return;
    }
    clearError();
    setVerificationError(null);
    try {
      const success = await verifyCode(
        formData.email,
        verifyToken,
        formData.verificationCode
      );
      if (success) {
        setIsVerified(true);
      } else {
        setVerificationError(
          _(msg`잘못된 인증번호입니다. 다시 확인 후 입력해 주세요.`)
        );
      }
    } catch {
      setVerificationError(
        _(msg`잘못된 인증번호입니다. 다시 확인 후 입력해 주세요.`)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    // Validation
    if (!formData.email) {
      setValidationError(_(msg`이메일을 입력해주세요.`));
      return;
    }
    if (!verifyToken || !formData.verificationCode) {
      setValidationError(_(msg`이메일 인증을 완료해주세요.`));
      return;
    }
    if (!formData.password) {
      setValidationError(_(msg`비밀번호를 입력해주세요.`));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError(_(msg`비밀번호가 일치하지 않습니다.`));
      return;
    }
    if (!agreements.terms || !agreements.privacy) {
      setValidationError(_(msg`필수 약관에 동의해주세요.`));
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        verifyToken,
        formData.verificationCode
      );
      r.push("/my-campaign");
    } catch {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#242424] text-center">
          <Trans>회원가입</Trans>
        </h1>

        {/* Email Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#4b5563]">
            <Trans>이메일</Trans>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={_(msg`이메일`)}
            className={`h-10 rounded-lg ${
              !emailError ? "border-[#e5e7eb]" : ""
            }`}
            disabled={isCodeSent}
            error={!isCodeSent ? emailError ?? undefined : undefined}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSendVerificationCode}
            disabled={isLoading || !formData.email || isCodeSent}
            className="h-10 border-[#e5e7eb] text-[#374151] rounded-lg disabled:opacity-50"
          >
            {isLoading && !isCodeSent ? (
              _(msg`전송 중...`)
            ) : isCodeSent ? (
              <Trans>인증번호 재전송</Trans>
            ) : (
              <Trans>인증번호 전송</Trans>
            )}
          </Button>

          {/* Verification Code */}
          {isCodeSent && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={formData.verificationCode}
                  onChange={(e) =>
                    handleInputChange("verificationCode", e.target.value)
                  }
                  placeholder={_(msg`인증번호를 입력해주세요.`)}
                  className={`h-10 rounded-lg ${
                    isVerified
                      ? "border-[#5ecb55] focus-visible:border-[#5ecb55]"
                      : !verificationError
                      ? "border-[#e5e7eb]"
                      : ""
                  }`}
                  wrapperClassName="flex-1"
                  disabled={isVerified}
                  error={
                    !isVerified ? verificationError ?? undefined : undefined
                  }
                />
                {!isVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyCode}
                    disabled={isLoading || !formData.verificationCode}
                    className="h-10 border-[#e5e7eb] text-[#374151] rounded-lg disabled:opacity-50"
                  >
                    <Trans>확인</Trans>
                  </Button>
                )}
              </div>
              {isVerified && (
                <div className="flex items-center gap-1 text-[#5ecb55]">
                  <CheckCircle2 className="size-4" />
                  <span className="text-sm">
                    <Trans>인증완료</Trans>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="flex flex-col gap-3">
          <label
            className={`text-sm font-semibold ${
              isVerified ? "text-[#4b5563]" : "text-[#9ca3af]"
            }`}
          >
            <Trans>비밀번호</Trans>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={_(msg`비밀번호를 입력해주세요.`)}
              className="h-10 pr-10 border-[#e5e7eb] rounded-lg disabled:bg-gray-50 disabled:text-gray-400"
              disabled={!isVerified}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors disabled:pointer-events-none"
              disabled={!isVerified}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder={_(msg`비밀번호를 재입력해주세요.`)}
              className={`h-10 pr-10 rounded-lg disabled:bg-gray-50 disabled:text-gray-400 ${
                !passwordError ? "border-[#e5e7eb]" : ""
              }`}
              disabled={!isVerified}
              error={isVerified ? passwordError ?? undefined : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors disabled:pointer-events-none ${
                passwordError ? "-translate-y-[calc(50%+14px)]" : ""
              }`}
              disabled={!isVerified}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e5e7eb]" />

        {/* Agreement Section */}
        <div
          className={`flex flex-col gap-4 ${!isVerified ? "opacity-50" : ""}`}
        >
          {/* All Agreement */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="all"
              checked={agreements.all}
              onCheckedChange={() => handleAgreementChange("all")}
              className="size-5 rounded-[3px] border-[#d1d5db]"
              disabled={!isVerified}
            />
            <label
              htmlFor="all"
              className={`text-sm font-medium cursor-pointer ${
                isVerified ? "text-[#111827]" : "text-[#9ca3af]"
              }`}
            >
              <Trans>전체 동의</Trans>
            </label>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              checked={agreements.terms}
              onCheckedChange={() => handleAgreementChange("terms")}
              className="size-5 rounded-[3px] border-[#d1d5db]"
              disabled={!isVerified}
            />
            <span
              className={`text-sm ${
                isVerified ? "text-[#6b7280]" : "text-[#9ca3af]"
              }`}
            >
              <button
                type="button"
                onClick={() => isVerified && setShowTermsPopup(true)}
                className={`underline decoration-solid ${
                  isVerified
                    ? "hover:text-[#ea3a50] transition-colors cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                disabled={!isVerified}
              >
                <Trans>서비스 이용약관</Trans>
              </button>
              <Trans>에 동의합니다 (필수)</Trans>
            </span>
          </div>

          {/* Privacy Agreement */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="privacy"
              checked={agreements.privacy}
              onCheckedChange={() => handleAgreementChange("privacy")}
              className="size-5 rounded-[3px] border-[#d1d5db]"
              disabled={!isVerified}
            />
            <span
              className={`text-sm ${
                isVerified ? "text-[#6b7280]" : "text-[#9ca3af]"
              }`}
            >
              <button
                type="button"
                onClick={() => isVerified && setShowPrivacyPopup(true)}
                className={`underline decoration-solid ${
                  isVerified
                    ? "hover:text-[#ea3a50] transition-colors cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                disabled={!isVerified}
              >
                <Trans>개인정보 수집/이용</Trans>
              </button>
              <Trans>에 동의합니다(필수)</Trans>
            </span>
          </div>
        </div>

        {/* Form Validation Error */}
        {validationError && (
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ff614e"
              className="size-4 shrink-0"
            >
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z" />
            </svg>
            <span className="text-sm text-[#ff614e] leading-[1.7]">
              {validationError}
            </span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !isVerified}
          className="h-10 bg-[#ea3a50] hover:bg-[#ea3a50]/90 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? _(msg`처리 중...`) : <Trans>동의하고 회원가입</Trans>}
        </Button>
      </form>

      {/* Terms of Service Popup */}
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

      {/* Privacy Policy Popup */}
      <Dialog open={showPrivacyPopup} onOpenChange={setShowPrivacyPopup}>
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
              onClick={() => setShowPrivacyPopup(false)}
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
              onClick={() => setShowPrivacyPopup(false)}
              className="w-full h-10 bg-[#ea3a50] hover:bg-[#d63447] text-white text-sm font-medium rounded-lg"
            >
              {_(msg`확인`)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterPage;
