"use client";

import { Trans } from "@lingui/react/macro";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { WeChatQRDialog } from "@/components/WeChatQRDialog";
import { useBanners } from "@/shared/hooks/use-campaigns";

function BannerSkeleton() {
  return (
    <CarouselItem className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3">
      <Skeleton className="rounded-lg aspect-video w-full" />
    </CarouselItem>
  );
}

export function HeroBanner() {
  const { banners, isLoading, isError } = useBanners("home");
  const [qrOpen, setQrOpen] = useState(false);

  // Sort banners by order field
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {/* Loading State */}
            {isLoading && (
              <>
                <BannerSkeleton />
                <BannerSkeleton />
                <BannerSkeleton />
              </>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <CarouselItem className="pl-2 md:pl-4 basis-full">
                <div className="bg-gray-100 rounded-lg aspect-video flex flex-col items-center justify-center text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2 text-red-400" />
                  <p className="text-sm">
                    <Trans>배너를 불러오는데 실패했습니다</Trans>
                  </p>
                </div>
              </CarouselItem>
            )}

            {/* Banners */}
            {!isLoading && !isError && banners.length === 0 && (
              <CarouselItem className="pl-2 md:pl-4 basis-full">
                <div className="bg-gray-900 rounded-lg pb-5 pl-5 aspect-video flex flex-col justify-end">
                  <h2 className="text-white text-xl font-bold">K-VIEWO</h2>
                  <p className="text-white text-sm">
                    <Trans>캠페인에 참여하세요!</Trans>
                  </p>
                </div>
              </CarouselItem>
            )}

            {!isLoading &&
              !isError &&
              sortedBanners.map((banner) => {
                const bannerImage = (
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src={banner.thumbnailPath}
                      alt={banner.name}
                      width={0}
                      height={0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-auto"
                    />
                  </div>
                );
                return (
                  <CarouselItem
                    key={banner.id}
                    className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3"
                  >
                    {banner.linkType === "wechat" ? (
                      <button
                        type="button"
                        onClick={() => setQrOpen(true)}
                        className="block w-full text-left cursor-pointer"
                      >
                        {bannerImage}
                      </button>
                    ) : (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {bannerImage}
                      </a>
                    )}
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute -left-6" />
          <CarouselNext className="hidden md:flex absolute -right-6" />
        </Carousel>
      </div>
      <WeChatQRDialog open={qrOpen} onOpenChange={setQrOpen} />
    </section>
  );
}
