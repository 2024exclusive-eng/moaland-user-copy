"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import Image from "next/image";

import {
  calculateDaysRemaining,
  parseSocialPlatforms,
  SOCIAL_LOGO_MAP,
} from "@/lib/api/campaign";

export interface CampaignCardProps {
  missionId: number;
  title: string;
  brand: string;
  thumbnailImg: string;
  enrollEndDate: string;
  enrollCount: number;
  maxEnroll: number;
  missionContent: string;
  social: string;
  point: number;
  category: string;
  onClick?: () => void;
  variant?: "horizontal" | "vertical";
}

export function CampaignCard({
  title,
  brand,
  thumbnailImg,
  enrollEndDate,
  enrollCount,
  maxEnroll,
  social,
  missionContent,
  onClick,
  variant = "horizontal",
}: CampaignCardProps) {
  const { _ } = useLingui();
  const daysRemaining = calculateDaysRemaining(enrollEndDate);
  const socialPlatforms = parseSocialPlatforms(social);
  const primarySocial = socialPlatforms[0];
  const socialLogo = primarySocial ? SOCIAL_LOGO_MAP[primarySocial] : null;

  // Vertical variant (for search page)
  if (variant === "vertical") {
    return (
      <div onClick={onClick} className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-sm mb-3">
          <Image
            src={thumbnailImg}
            alt={title}
            width={256}
            height={256}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          {/* Social & Days Remaining & Application Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {socialLogo && (
                <Image
                  src={socialLogo.src}
                  width={16}
                  height={16}
                  alt={primarySocial}
                  className="object-contain shrink-0"
                />
              )}
              <span className="text-[#111827] font-semibold text-xs">
                {daysRemaining > 0
                  ? _(msg`${daysRemaining}일 남음`)
                  : _(msg`마감`)}
              </span>
            </div>
            <span className="text-[#9CA3AF] text-xs">
              <Trans>신청</Trans> {enrollCount}/{maxEnroll}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[#111827] font-semibold text-base leading-tight line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[#6B7280] text-sm leading-tight line-clamp-2">
            <span dangerouslySetInnerHTML={{ __html: missionContent }} />
          </p>
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div onClick={onClick} className="group cursor-pointer">
      {/* Mobile: Horizontal Layout */}
      <div className="md:hidden flex gap-3">
        {/* Image Container */}
        <div className="relative w-24 h-24 overflow-hidden rounded-sm shrink-0">
          <Image
            src={thumbnailImg}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col mt-1 min-w-0">
          {/* Social & Days Remaining */}
          <div className="flex items-center gap-1.5">
            {socialLogo && (
              <Image
                src={socialLogo.src}
                width={16}
                height={16}
                alt={primarySocial}
                className="object-contain shrink-0"
              />
            )}
            <span className="text-[#111827] font-semibold text-xs">
              {daysRemaining > 0
                ? _(msg`${daysRemaining}일 남음`)
                : _(msg`마감`)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[#111827] font-semibold text-[16px] md:text-sm leading-tight line-clamp-1 mt-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[#6B7280] text-sm md:text-xs leading-tight line-clamp-2 mt-1">
            <span dangerouslySetInnerHTML={{ __html: missionContent }} />
          </p>
        </div>

        <span className="text-[#4B5563] text-xs font-light">
          <Trans>신청</Trans> {enrollCount}/{maxEnroll}
        </span>
      </div>

      {/* Desktop: Vertical Layout (Original) */}
      <div className="hidden md:block">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-3">
          <Image
            src={thumbnailImg}
            alt={title}
            width={280}
            height={280}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="mt-3">
          {/* Social & Days Remaining */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {socialLogo && (
                <Image
                  src={socialLogo.src}
                  width={socialLogo.width}
                  height={socialLogo.height}
                  alt={primarySocial}
                  className="object-contain rounded-sm"
                />
              )}
              <span className="text-[#111827] font-semibold text-sm">
                {daysRemaining > 0
                  ? _(msg`${daysRemaining}일 남음`)
                  : _(msg`마감`)}
              </span>
            </div>
            <div>
              <span className="md:block hidden text-[#4B5563] text-xs font-light">
                <Trans>신청</Trans> {enrollCount}/{maxEnroll}
              </span>
            </div>
          </div>

          {/* Title & Brand */}
          <div className="text-[#111827] font-semibold text-[16px] mt-2">
            <h3>{title}</h3>
            <p className="text-[#6B7280] font-light text-sm mt-1 line-clamp-2">
              <span dangerouslySetInnerHTML={{ __html: missionContent }} />
            </p>
          </div>

          {/* Social Platforms */}
          {socialPlatforms.length > 1 && (
            <div className="flex items-center gap-1 mt-2">
              {socialPlatforms.slice(1).map((platform) => {
                const logo = SOCIAL_LOGO_MAP[platform];
                // Scale down secondary logos proportionally
                const scale = 0.875; // ~14/16
                return logo ? (
                  <Image
                    key={platform}
                    src={logo.src}
                    width={Math.round(logo.width * scale)}
                    height={Math.round(logo.height * scale)}
                    alt={platform}
                    className="object-contain rounded-sm opacity-70"
                  />
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
