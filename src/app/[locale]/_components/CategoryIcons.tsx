"use client";

import Image from "next/image";

export function CategoryIcons() {
  const categories = [
    {
      icon: (
        <Image src="/icons/guide.svg" width={43} height={43} alt="beauty" />
      ),
      label: "이용가이드",
    },
    {
      icon: (
        <Image
          src="/icons/restaurant.svg"
          width={43}
          height={43}
          alt="beauty"
        />
      ),
      label: "맛집",
    },
    {
      icon: (
        <Image src="/icons/hospital.svg" width={43} height={43} alt="beauty" />
      ),
      label: "병원",
    },
    {
      icon: (
        <Image src="/icons/beauty.svg" width={43} height={43} alt="beauty" />
      ),
      label: "뷰티",
    },
    {
      icon: (
        <Image src="/icons/culture.svg" width={43} height={43} alt="beauty" />
      ),
      label: "문화",
    },
    {
      icon: (
        <Image src="/icons/stays.svg" width={43} height={43} alt="beauty" />
      ),
      label: "숙박",
    },
    {
      icon: (
        <Image src="/icons/massage.svg" width={43} height={43} alt="beauty" />
      ),
      label: "마사지",
    },
    {
      icon: (
        <Image src="/icons/inquire.svg" width={43} height={43} alt="beauty" />
      ),
      label: "광고문의",
    },
  ];

  return (
    <section className="bg-white pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-6.5 overflow-x-auto flex-wrap">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                className="flex flex-col cursor-pointer items-center gap-2 min-w-[80px] hover:opacity-80 transition-opacity"
              >
                <div
                  className={`w-20 h-20 border border-[#E5E7EB] bg-[#F9FAFB] rounded-full flex items-center justify-center`}
                >
                  {Icon}
                </div>
                <span className="text-xs text-gray-700 text-center whitespace-nowrap">
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
