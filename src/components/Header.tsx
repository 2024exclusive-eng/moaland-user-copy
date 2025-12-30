"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import LocalizedLink from "@/components/LocalizedLink";

export function Header() {
  const pn = usePathname();
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <LocalizedLink href="/" className="flex items-center">
            <Image src="/logo.png" width={78} height={16} alt="logo" />
          </LocalizedLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <LocalizedLink
              href="/campaign"
              className={`text-sm ${
                pn.includes("campaign")
                  ? "font-semibold text-[#EA3A50]"
                  : "font-medium text-gray-900"
              } hover:text-red-600`}
            >
              캠페인
            </LocalizedLink>
            <LocalizedLink
              href="/community"
              className={`text-sm ${
                pn.includes("community")
                  ? "font-semibold text-[#EA3A50]"
                  : "font-medium text-gray-900"
              } hover:text-red-600`}
            >
              커뮤니티
            </LocalizedLink>
            <LocalizedLink
              href="/support"
              className={`text-sm ${
                pn.includes("support")
                  ? "font-semibold text-[#EA3A50]"
                  : "font-medium text-gray-900"
              } hover:text-red-600`}
            >
              고객센터
            </LocalizedLink>
          </nav>
        </div>

        {/* Right side - Auth & Search */}
        <div className="flex items-center gap-4">
          <a
            href="http://pf.kakao.com/_IRpxhn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-900 hover:text-red-600"
          >
            광고문의
          </a>
          <LocalizedLink
            href="/login"
            className={`text-sm ${
              pn.includes("login")
                ? "font-semibold text-[#EA3A50]"
                : "font-medium text-gray-900"
            } hover:text-red-600`}
          >
            로그인
          </LocalizedLink>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
