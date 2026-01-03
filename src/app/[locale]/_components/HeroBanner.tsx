"use client";

import { AlertCircle } from "lucide-react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners } from "@/shared/hooks/use-campaigns";

function BannerSkeleton() {
  return (
    <CarouselItem className="pl-2 md:pl-4 md:basis-1/3">
      <Skeleton className="rounded-lg min-h-45 w-full" />
    </CarouselItem>
  );
}

export function HeroBanner() {
  const { banners, isLoading, isError } = useBanners("home");

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
                <div className="bg-gray-100 rounded-lg min-h-45 flex flex-col items-center justify-center text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2 text-red-400" />
                  <p className="text-sm">배너를 불러오는데 실패했습니다</p>
                </div>
              </CarouselItem>
            )}

            {/* Banners */}
            {!isLoading && !isError && banners.length === 0 && (
              <CarouselItem className="pl-2 md:pl-4 basis-full">
                <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end">
                  <h2 className="text-white text-xl font-bold">K-VIEWO</h2>
                  <p className="text-white text-sm">캠페인에 참여하세요!</p>
                </div>
              </CarouselItem>
            )}

            {!isLoading &&
              !isError &&
              banners.map((banner) => (
                <CarouselItem
                  key={banner.id}
                  className="pl-2 md:pl-4 md:basis-1/3"
                >
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative rounded-lg min-h-45 overflow-hidden">
                      <Image
                        src={banner.thumbnailPath}
                        alt={banner.name}
                        fill
                        className="object-cover"
                      />
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /> */}
                      <div className="absolute bottom-0 left-0 p-5">
                        <h2 className="text-white text-xl font-bold">
                          {banner.name}
                        </h2>
                      </div>
                    </div>
                  </a>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute -left-6" />
          <CarouselNext className="hidden md:flex absolute -right-6" />
        </Carousel>
      </div>
    </section>
  );
}
