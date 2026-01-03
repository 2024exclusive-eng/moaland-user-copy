"use client";

import { Trans } from "@lingui/react/macro";
import { CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/shared/hooks/use-auth";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

const RegisterPage = () => {
  const r = useLocalizedNavigation();
  const {
    sendVerificationCode,
    verifyCode,
    register,
    isLoading,
    error,
    clearError,
  } = useAuth();

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
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
      setValidationError("이메일을 입력해주세요.");
      return;
    }
    clearError();
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
      setValidationError("인증번호를 입력해주세요.");
      return;
    }
    clearError();
    try {
      const success = await verifyCode(
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
    if (!formData.password) {
      setValidationError("비밀번호를 입력해주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreements.terms || !agreements.privacy) {
      setValidationError("필수 약관에 동의해주세요.");
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

  const displayError = validationError || error;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#242424] text-center">
          <Trans>회원가입</Trans>
        </h1>

        {/* Error Display */}
        {displayError && (
          <p className="text-sm text-red-500 text-center">{displayError}</p>
        )}

        {/* Email Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#4b5563]">
            <Trans>이메일</Trans>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="이메일"
            className="h-10 border-[#e5e7eb] rounded-lg"
            disabled={isCodeSent}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSendVerificationCode}
            disabled={isLoading || !formData.email || isCodeSent}
            className="h-10 border-[#e5e7eb] text-[#374151] rounded-lg disabled:opacity-50"
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
                  className={`h-10 rounded-lg flex-1 ${
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
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="비밀번호를 입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg disabled:bg-gray-50 disabled:text-gray-400"
            disabled={!isVerified}
          />
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="비밀번호를 재입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg disabled:bg-gray-50 disabled:text-gray-400"
            disabled={!isVerified}
          />
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
            <label
              htmlFor="terms"
              className={`text-sm cursor-pointer ${
                isVerified ? "text-[#6b7280]" : "text-[#9ca3af]"
              }`}
            >
              <span className="underline decoration-solid">
                <Trans>서비스 이용약관</Trans>
              </span>
              <Trans>에 동의합니다 (필수)</Trans>
            </label>
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
            <label
              htmlFor="privacy"
              className={`text-sm cursor-pointer ${
                isVerified ? "text-[#6b7280]" : "text-[#9ca3af]"
              }`}
            >
              <span className="underline decoration-solid">
                <Trans>개인정보 수집/이용</Trans>
              </span>
              <Trans>에 동의합니다(필수)</Trans>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isVerified}
          className="h-10 bg-[#ea3a50] hover:bg-[#ea3a50]/90 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "처리 중..." : <Trans>동의하고 회원가입</Trans>}
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
