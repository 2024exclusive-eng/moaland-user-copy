"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAccount } from "@/lib/api/auth";
import {
  ProfileResponse,
  updateProfile,
  uploadProfileImage,
} from "@/lib/api/profile";
import { useAuth } from "@/shared/hooks/use-auth";

export function ProfileBasicInfo({
  profile,
}: {
  profile?: ProfileResponse | null;
}) {
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile?.profile?.profileImg || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Update state when profile loads
  useEffect(() => {
    if (profile?.profile?.profileImg) {
      setPreviewUrl(profile.profile.profileImg);
    }
  }, [profile]);

  const handleImageClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload and save
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload image
      const uploadResponse = await uploadProfileImage(file);
      if (!uploadResponse.success) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      const profileUrl = uploadResponse.data.uri;

      // Update profile with new profile image
      const updateResponse = await updateProfile({
        profileImg: profileUrl,
      });

      if (updateResponse.success) {
        setSuccess(true);
        setPreviewUrl(profileUrl);
        // Auto-hide success message after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
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
        setError("저장에 실패했습니다.");
      }
      // Revert preview on error
      setPreviewUrl(profile?.profile?.profileImg || null);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    setWithdrawError(null);

    try {
      const response = await deleteAccount();
      if (response.success) {
        // Clear auth token and redirect to login page
        logout();
        const locale = window.location.pathname.split("/")[1] || "en";
        window.location.href = `/${locale}/login`;
      }
    } catch (err) {
      const errorMessage = (
        err as { response?: { data?: { error?: { msg?: string } | string } } }
      )?.response?.data?.error;
      if (typeof errorMessage === "object" && errorMessage?.msg) {
        setWithdrawError(errorMessage.msg);
      } else if (typeof errorMessage === "string") {
        setWithdrawError(errorMessage);
      } else {
        setWithdrawError("탈퇴 처리에 실패했습니다.");
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Picture */}
      <div className="relative w-19.5 h-18.25">
        <div className="w-17 h-17 relative">
          <Image
            src={previewUrl || "/images/default-avatar.svg"}
            width={68}
            height={68}
            alt="Profile"
            className={`rounded-full object-cover ${
              isLoading ? "opacity-50" : ""
            }`}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#ea3a50] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleImageClick}
          className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#e5e7eb] rounded-full flex items-center justify-center cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.334 2.00004C11.5091 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.6673 1.44775C12.9149 1.44775 13.1601 1.49653 13.3889 1.59129C13.6177 1.68605 13.8256 1.82494 14.0007 2.00004C14.1758 2.17513 14.3147 2.383 14.4094 2.61178C14.5042 2.84055 14.553 3.08575 14.553 3.33337C14.553 3.58099 14.5042 3.82619 14.4094 4.05497C14.3147 4.28374 14.1758 4.49161 14.0007 4.66671L5.00065 13.6667L1.33398 14.6667L2.33398 11L11.334 2.00004Z"
              stroke="#6B7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-semibold text-[#4b5563] leading-[1.7]">
          가입 이메일
        </label>
        <p className="text-sm text-[#111827] leading-[1.7]">
          {profile?.my?.email || "-"}
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">저장되었습니다.</p>}

      {/* Withdraw Link */}
      <button
        onClick={() => setShowWithdrawDialog(true)}
        className="text-sm cursor-pointer font-medium text-[#9ca3af] underline text-left mt-auto pt-3"
      >
        탈퇴하기
      </button>

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>회원 탈퇴</DialogTitle>
            <DialogDescription>
              정말로 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며 복구할 수
              없습니다.
            </DialogDescription>
          </DialogHeader>
          {withdrawError && (
            <p className="text-sm text-red-500">{withdrawError}</p>
          )}
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowWithdrawDialog(false)}
              disabled={isWithdrawing}
              className="flex-1 sm:flex-none"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="flex-1 sm:flex-none bg-[#ea3a50] hover:bg-[#ea3a50]/90"
            >
              {isWithdrawing ? "처리 중..." : "탈퇴하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
