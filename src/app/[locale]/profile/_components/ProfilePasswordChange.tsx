"use client";

import { useState } from "react";

export function ProfilePasswordChange() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password change submitted");
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-[116px] h-10 px-3 bg-[#ea3a50] rounded-lg flex items-center justify-center mt-3"
      >
        <span className="text-sm font-medium text-white leading-[1.5]">
          비밀번호 저장
        </span>
      </button>
    </form>
  );
}
