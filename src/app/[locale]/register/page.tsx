"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const RegisterPage = () => {
  const { _ } = useLingui();
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
  });
  const [isVerified, _setIsVerified] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    console.log("Register:", formData);
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
            placeholder="이메일"
            className="h-10 border-[#e5e7eb] rounded-lg"
          />
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[#e5e7eb] text-[#374151] rounded-lg"
          >
            <Trans>인증번호 재전송</Trans>
          </Button>

          {/* Verification Code */}
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              value={formData.verificationCode}
              onChange={(e) =>
                handleInputChange("verificationCode", e.target.value)
              }
              placeholder="인증번호를 입력해주세요."
              className={`h-10 rounded-lg ${
                isVerified
                  ? "border-[#5ecb55] focus-visible:border-[#5ecb55]"
                  : "border-[#e5e7eb]"
              }`}
            />
            {isVerified && (
              <div className="flex items-center gap-1 text-[#5ecb55]">
                <CheckCircle2 className="size-4" />
                <span className="text-sm">
                  <Trans>인증완료</Trans>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Password Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#4b5563]">
            <Trans>비밀번호</Trans>
          </label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="비밀번호를 입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg"
          />
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            placeholder="비밀번호를 재입력해주세요."
            className="h-10 border-[#e5e7eb] rounded-lg"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-[#e5e7eb]" />

        {/* Agreement Section */}
        <div className="flex flex-col gap-4">
          {/* All Agreement */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="all"
              checked={agreements.all}
              onCheckedChange={() => handleAgreementChange("all")}
              className="size-5 rounded-[3px] border-[#d1d5db]"
            />
            <label
              htmlFor="all"
              className="text-sm font-medium text-[#111827] cursor-pointer"
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
            />
            <label
              htmlFor="terms"
              className="text-sm text-[#6b7280] cursor-pointer"
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
            />
            <label
              htmlFor="privacy"
              className="text-sm text-[#6b7280] cursor-pointer"
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
          className="h-10 bg-[#ea3a50] hover:bg-[#ea3a50]/90 text-white rounded-lg"
        >
          <Trans>동의하고 회원가입</Trans>
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
