"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/api/auth";

export function ProfilePasswordChange() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!newPassword) {
      setError("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword(newPassword);

      if (response.success) {
        setSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
      } else if (response.error) {
        const errorMsg =
          typeof response.error === "object"
            ? response.error.msg
            : response.error;
        setError(errorMsg || "비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = (
        err as { response?: { data?: { error?: { msg?: string } | string } } }
      )?.response?.data?.error;
      if (typeof errorMessage === "object" && errorMessage?.msg) {
        setError(errorMessage.msg);
      } else if (typeof errorMessage === "string") {
        setError(errorMessage);
      } else {
        setError("비밀번호 변경에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      {/* New Password */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
          새 비밀번호
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="재설정할 비밀번호를 입력해주세요."
          className="w-full h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#111827] leading-[1.7] placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
          새 비밀번호 확인
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="재설정할 비밀번호를 한번 더 입력해주세요."
          className="w-full h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#111827] leading-[1.7] placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Error/Success Messages */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-500">비밀번호가 변경되었습니다.</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-[116px] h-10 bg-[#ea3a50] hover:bg-[#ea3a50]/90 text-white rounded-lg mt-3 disabled:opacity-50"
      >
        {isLoading ? "저장 중..." : "비밀번호 저장"}
      </Button>
    </form>
  );
}
