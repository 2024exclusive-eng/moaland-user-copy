"use client";

import { Trans } from "@lingui/react/macro";
import Image from "next/image";

interface LandmarkCardProps {
  id: string;
  image: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance?: string;
  isFavorite?: boolean;
  onClick?: () => void;
}

export function LandmarkCard({ image, title, onClick }: LandmarkCardProps) {
  return (
    <div onClick={onClick} className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-3">
        <Image
          src={image}
          alt={title}
          width={280}
          height={280}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="mt-3">
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/instagram-logo.webp"
              width={16}
              height={16}
              alt="logo"
              className="object-cover"
            />

            <span className="text-[#111827] font-semibold text-sm">
              <Trans>3 일 남음</Trans>
            </span>
          </div>
          <div>
            <span className="text-[#4B5563] text-xs font-light">
              <Trans>신청 20/ 2</Trans>
            </span>
          </div>
        </div>

        <div className="text-[#111827] font-semibold text-[16px] mt-2">
          <h1>[Region] Campaign Title</h1>

          <p className="text-[#6B7280] font-light max-h-12 text-sm mt-1">
            Gift of scalp scaling, hair clinic, and hair clinic products worth
            250,000 won.
          </p>
        </div>
      </div>
    </div>
  );
}
