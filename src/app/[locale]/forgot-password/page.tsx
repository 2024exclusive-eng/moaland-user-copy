"use client";

import { Trans } from "@lingui/react/macro";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isVerified, setIsVerified] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResendCode = () => {
    // Handle resend verification code logic
    console.log("Resend code to:", formData.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic
    console.log("Reset password:", formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#242424] text-center leading-[1.7]">
          <Trans>비밀번호 재설정</Trans>
        </h1>

        {/* Email Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
            <Trans>이메일</Trans>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="kviewo1@gmail.com"
            className="h-10 border-[#e5e7eb] rounded-lg text-sm"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleResendCode}
            className="h-10 border-[#e5e7eb] text-[#374151] rounded-lg text-sm font-medium"
          >
            <Trans>인증번호 재전송</Trans>
          </Button>

          {/* Verification Code */}
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              value={formData.verificationCode}
              onChange={(e) => {
                handleInputChange("verificationCode", e.target.value);
                // Mock verification - in real app, verify with backend
                if (e.target.value === "123233") {
                  setIsVerified(true);
                }
              }}
              placeholder="인증번호를 입력해주세요."
              className={`h-10 rounded-lg text-sm ${
                isVerified
                  ? "border-[#5ecb55] focus-visible:ring-[#5ecb55]"
                  : "border-[#e5e7eb]"
              }`}
            />
            {isVerified && (
              <div className="flex items-center gap-1 text-[#5ecb55]">
                <CheckCircle2 className="size-4" fill="#5ecb55" />
                <span className="text-sm leading-[1.7]">
                  <Trans>인증완료</Trans>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Password Reset Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
            <Trans>비밀번호 재설정</Trans>
          </label>
          <Input
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            placeholder="재설정할 비밀번호를 입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg text-sm"
          />
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="재설정할 비밀번호를 재입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg text-sm"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-10 bg-[#ea3a50] hover:bg-[#ea3a50]/90 text-white rounded-lg text-sm font-medium"
        >
          <Trans>변경하기</Trans>
        </Button>
      </form>
    </div>
  );
}
