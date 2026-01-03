"use client";

import { Trans } from "@lingui/react/macro";
import { CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/shared/hooks/use-auth";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

export default function ForgotPasswordPage() {
  const r = useLocalizedNavigation();
  const {
    sendForgotPasswordCode,
    verifyForgotPasswordCode,
    resetPassword,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setValidationError("이메일을 입력해주세요.");
      return;
    }
    clearError();
    try {
      const { verify } = await sendForgotPasswordCode(formData.email);
      setVerifyToken(verify);
      setIsCodeSent(true);
      setIsVerified(false);
    } catch {
      // Error is handled by useAuth hook
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode || !verifyToken) {
      setValidationError("인증번호를 입력해주세요.");
      return;
    }
    clearError();
    try {
      const success = await verifyForgotPasswordCode(
        formData.email,
        verifyToken,
        formData.verificationCode
      );
      if (success) {
        setIsVerified(true);
      }
    } catch {
      // Error is handled by useAuth hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    // Validation
    if (!formData.email) {
      setValidationError("이메일을 입력해주세요.");
      return;
    }
    if (!verifyToken || !formData.verificationCode) {
      setValidationError("이메일 인증을 완료해주세요.");
      return;
    }
    if (!isVerified) {
      setValidationError("인증번호 확인을 완료해주세요.");
      return;
    }
    if (!formData.newPassword) {
      setValidationError("새 비밀번호를 입력해주세요.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const success = await resetPassword(
        formData.email,
        verifyToken,
        formData.verificationCode,
        formData.newPassword
      );
      if (success) {
        r.push("/login");
      }
    } catch {
      // Error is handled by useAuth hook
    }
  };

  const displayError = validationError || error;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#242424] text-center leading-[1.7]">
          <Trans>비밀번호 재설정</Trans>
        </h1>

        {/* Error Display */}
        {displayError && (
          <p className="text-sm text-red-500 text-center">{displayError}</p>
        )}

        {/* Email Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
            <Trans>이메일</Trans>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="이메일을 입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg text-sm"
            disabled={isCodeSent}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSendVerificationCode}
            disabled={isLoading || !formData.email}
            className="h-10 border-[#e5e7eb] text-[#374151] rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {isLoading && !isCodeSent ? (
              "전송 중..."
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
                  placeholder="인증번호를 입력해주세요."
                  className={`h-10 rounded-lg text-sm flex-1 ${
                    isVerified
                      ? "border-[#5ecb55] focus-visible:border-[#5ecb55]"
                      : "border-[#e5e7eb]"
                  }`}
                  disabled={isVerified}
                />
                {!isVerified && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyCode}
                    disabled={isLoading || !formData.verificationCode}
                    className="h-10 border-[#e5e7eb] text-[#374151] rounded-lg disabled:opacity-50"
                  >
                    확인
                  </Button>
                )}
              </div>
              {isVerified && (
                <div className="flex items-center gap-1 text-[#5ecb55]">
                  <CheckCircle2 className="size-4" />
                  <span className="text-sm leading-[1.7]">
                    <Trans>인증완료</Trans>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Reset Section */}
        <div className="flex flex-col gap-3">
          <label
            className={`text-sm font-semibold leading-[1.7] ${
              isVerified ? "text-[#4b5563]" : "text-[#9ca3af]"
            }`}
          >
            <Trans>비밀번호 재설정</Trans>
          </label>
          <Input
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            placeholder="재설정할 비밀번호를 입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-400"
            disabled={!isVerified}
          />
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="재설정할 비밀번호를 재입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-400"
            disabled={!isVerified}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !isVerified}
          className="h-10 bg-[#ea3a50] hover:bg-[#ea3a50]/90 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "처리 중..." : <Trans>변경하기</Trans>}
        </Button>
      </form>
    </div>
  );
}
