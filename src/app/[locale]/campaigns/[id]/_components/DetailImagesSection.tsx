"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface DetailImagesSectionProps {
  images: string[];
  title: string;
}

export function DetailImagesSection({
  images,
  title,
}: DetailImagesSectionProps) {
  const { _ } = useLingui();
  const [showAll, setShowAll] = useState(false);

  // Show only first image initially, rest when expanded
  const visibleImages = showAll ? images : images.slice(0, 1);

  return (
    <div className="mb-6">
      {/* Images */}
      <div className="flex flex-col gap-4">
        {visibleImages.map((imageUrl, index) => (
          <div
            key={index}
            className={
              index === 0 && !showAll
                ? "relative h-[502px] w-full overflow-hidden"
                : "relative w-full overflow-hidden rounded-lg"
            }
          >
            {index === 0 && !showAll ? (
              <>
                <Image
                  src={imageUrl}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-white" />
              </>
            ) : (
              <Image
                src={imageUrl}
                alt={`${title} - ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setShowAll(!showAll)}
        className={`w-full cursor-pointer h-10 border-[#111827] text-[#111827] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.34)] ${
          showAll ? "mt-2" : ""
        }`}
      >
        {showAll ? _(msg`이미지 접기`) : _(msg`상세이미지 더보기`)}
      </Button>
    </div>
  );
}
