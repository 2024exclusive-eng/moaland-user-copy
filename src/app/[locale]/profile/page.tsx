"use client";

import { Trans } from "@lingui/react/macro";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { useProfile } from "@/shared/hooks/use-profile";

import { ProfileBasicInfo } from "./_components/ProfileBasicInfo";
import { ProfilePasswordChange } from "./_components/ProfilePasswordChange";

type MobileScreen = "main" | "basic" | "password";

export default function ProfilePage() {
  const [profileTab, setProfileTab] = useState<"basic" | "password">("basic");
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>("main");
  const { profile: profileData } = useProfile();

  // Mobile header title based on current screen
  const getMobileTitle = () => {
    switch (mobileScreen) {
      case "basic":
        return <Trans>기본 정보</Trans>;
      case "password":
        return <Trans>비밀번호 변경</Trans>;
      default:
        return <Trans>계정 정보</Trans>;
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen bg-white">
        {/* Mobile Header */}
        <div className="h-[60px] flex items-center justify-center px-[21px] border-b border-[#e5e7eb] bg-white relative">
          {mobileScreen === "main" ? (
            <LocalizedLink
              href="/my-campaign"
              className="absolute left-[21px] flex items-center hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-6 h-6 text-[#09121F]" />
            </LocalizedLink>
          ) : (
            <button
              onClick={() => setMobileScreen("main")}
              className="absolute left-[21px] flex items-center hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-6 h-6 text-[#09121F]" />
            </button>
          )}
          <span className="text-[16px] font-semibold text-black">
            {getMobileTitle()}
          </span>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 bg-white">
          {mobileScreen === "main" && (
            <div className="flex flex-col">
              <button
                onClick={() => setMobileScreen("basic")}
                className="flex items-center justify-between px-[21px] py-4 border-b border-[#e5e7eb]"
              >
                <span className="text-base font-medium text-black">
                  <Trans>기본 정보</Trans>
                </span>
                <ChevronRight className="w-5 h-5 text-[#9ca3af]" />
              </button>

              {/* Password Change Menu Item */}
              <button
                onClick={() => setMobileScreen("password")}
                className="flex items-center justify-between px-[21px] py-4 border-b border-[#e5e7eb]"
              >
                <span className="text-base font-medium text-black">
                  <Trans>비밀번호 변경</Trans>
                </span>
                <ChevronRight className="w-5 h-5 text-[#9ca3af]" />
              </button>

              {/* Withdraw Link */}
              <div className="px-[21px] py-4">
                <ProfileBasicInfo profile={profileData} showWithdrawOnly />
              </div>
            </div>
          )}

          {mobileScreen === "basic" && (
            <div className="px-[21px] py-5">
              <ProfileBasicInfo profile={profileData} isMobile />
            </div>
          )}

          {mobileScreen === "password" && (
            <div className="px-[21px] py-5">
              <ProfilePasswordChange />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block container mx-auto px-4">
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
    </>
  );
}
