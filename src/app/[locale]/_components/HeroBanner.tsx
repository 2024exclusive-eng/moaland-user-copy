"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function HeroBanner() {
  const banners = [
    {
      title: "K-VIEWO에서 즐겁고",
      subtitle: "이벤트 내용입니다.",
    },
    {
      title: "예약 이벤트",
      subtitle: "이벤트 내용입니다.",
    },
    {
      title: "예약 나라별",
      subtitle: "이벤트 내용입니다.",
    },
    {
      title: "K-VIEWO에서 즐겁고\n편리하게 이용권 예약",
      subtitle: "이벤트 내용입니다.",
    },
    {
      title: "예약 이벤트",
      subtitle: "이벤트 내용입니다.",
    },
    {
      title: "예약 나라별",
      subtitle: "이벤트 내용입니다.",
    },
  ];

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
            {banners.map((banner, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3">
                <div className="bg-gray-900 rounded-lg pb-5 pl-5 min-h-45 flex flex-col justify-end">
                  <h2 className="text-white text-xl font-bold truncate">
                    {banner.title}
                  </h2>

                  <p className="text-white text-sm">{banner.subtitle}</p>
                </div>
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
