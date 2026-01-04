"use client";

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
}: CampaignCardProps) {
  const daysRemaining = calculateDaysRemaining(enrollEndDate);
  const socialPlatforms = parseSocialPlatforms(social);
  const primarySocial = socialPlatforms[0];
  const socialLogo = primarySocial ? SOCIAL_LOGO_MAP[primarySocial] : null;
  return (
    <div onClick={onClick} className="group cursor-pointer">
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
              {daysRemaining > 0 ? `${daysRemaining}일 남음` : "마감"}
            </span>
          </div>
          <div>
            <span className="text-[#4B5563] text-xs font-light">
              신청 {enrollCount}/{maxEnroll}
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
  );
}
