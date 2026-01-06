"use client";

import { Trans } from "@lingui/react/macro";
import Image from "next/image";
import { usePathname } from "next/navigation";

import LocalizedLink from "@/components/LocalizedLink";

export function MobileNavigation() {
  const pn = usePathname();

  const navItems = [
    {
      href: "/",
      icon: "/icons/home.svg",
      iconActive: "/icons/home-active.svg",
      label: <Trans>홈</Trans>,
      isActive: pn.split("/").length === 2 || pn.split("/")[2] === "",
    },
    {
      href: "/campaigns",
      icon: "/icons/campaign.svg",
      iconActive: "/icons/campaign-active.svg",
      label: <Trans>캠페인</Trans>,
      isActive: pn.split("/").at(2) === "campaigns",
    },
    {
      href: "/community",
      icon: "/icons/notice.svg",
      iconActive: "/icons/notice-active.svg",
      label: <Trans>커뮤니티</Trans>,
      isActive: pn.includes("community"),
    },
    {
      href: "/support",
      icon: "/icons/faq.svg",
      iconActive: "/icons/faq-active.svg",
      label: <Trans>고객센터</Trans>,
      isActive: pn.includes("support"),
    },
    {
      href: "/my-campaign",
      icon: "/icons/auth.svg",
      iconActive: "/icons/auth-active.svg",
      label: <Trans>마이페이지</Trans>,
      isActive: pn.includes("profile") || pn.includes("my-campaign"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          return (
            <LocalizedLink
              key={index}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <Image
                src={item.isActive ? item.iconActive : item.icon}
                width={24}
                height={24}
                alt=""
                className="w-6 h-6"
              />
              <span
                className={`text-[10px] leading-tight ${
                  item.isActive
                    ? "text-[#EA3A50] font-semibold"
                    : "text-[#9CA3AF] font-medium"
                }`}
              >
                {item.label}
              </span>
            </LocalizedLink>
          );
        })}
      </div>
    </nav>
  );
}
