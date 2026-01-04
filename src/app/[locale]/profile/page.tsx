"use client";

import { Trans } from "@lingui/react/macro";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { useProfile } from "@/shared/hooks/use-profile";

import { ProfileBasicInfo } from "./_components/ProfileBasicInfo";
import { ProfilePasswordChange } from "./_components/ProfilePasswordChange";

export default function ProfilePage() {
  const [profileTab, setProfileTab] = useState<"basic" | "password">("basic");
  const { profile: profileData } = useProfile();

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 pt-10 md:border-r border-[#e5e7eb]">
          <h1 className="text-[#111827] text-2xl font-bold">
              <Trans>마이페이지</Trans>
            </h1>

          <div className="pl-3 mt-5">
            <LocalizedLink
              href="/my-campaign"
              className="text-lg transition-colors text-[#9CA3AF] block"
            >
              <Trans>나의 캠페인</Trans>
            </LocalizedLink>
            <LocalizedLink
              href="/profile"
              className="text-lg mt-3 block transition-colors font-semibold text-[#111827]"
            >
              <Trans>계정 정보</Trans>
            </LocalizedLink>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 md:pl-10 py-10 flex flex-col gap-5.75">
          <h2 className="text-xl font-semibold text-[#111827] leading-normal">
            <Trans>계정 정보</Trans>
          </h2>

          <div className="flex flex-col gap-6">
            {/* Profile Tab Menu */}
            <div className="border-b border-[#e5e7eb] flex items-center">
              <button
                onClick={() => setProfileTab("basic")}
                className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                  profileTab === "basic"
                    ? "border-b border-black font-bold text-[#111827]"
                    : "font-medium text-[#9ca3af]"
                }`}
              >
                <Trans>기본 정보</Trans>
              </button>
              <button
                onClick={() => setProfileTab("password")}
                className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                  profileTab === "password"
                    ? "border-b border-black font-bold text-[#111827]"
                    : "font-medium text-[#9ca3af]"
                }`}
              >
                <Trans>비밀번호 변경</Trans>
              </button>
            </div>
            {profileTab === "basic" ? (
              <ProfileBasicInfo profile={profileData} />
            ) : (
              <ProfilePasswordChange />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
