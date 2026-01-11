"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { Globe, Search, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import LocalizedLink from "@/components/LocalizedLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProfile } from "@/lib/api/profile";
import { subscribeAuthChange, tokenStorage } from "@/lib/axios";
import { useAuth } from "@/shared/hooks/use-auth";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

function useIsLoggedIn() {
  const subscribe = useCallback((callback: () => void) => {
    return subscribeAuthChange(callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return !!tokenStorage.get();
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface HeaderProps {
  shouldHideMobile?: boolean;
}

export function Header({ shouldHideMobile = false }: HeaderProps = {}) {
  const { _ } = useLingui();
  const pn = usePathname();
  const router = useRouter();
  const r = useLocalizedNavigation();
  const { logout } = useAuth();
  const isLoggedIn = useIsLoggedIn();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get locale from pathname
  const locale = pn.split("/")[1] || "ko";

  const localeLabels: Record<string, string> = {
    ko: "KO",
    zh: "CN",
    en: "EN",
  };

  const handleLocaleChange = (newLocale: string) => {
    // Replace the locale in the current path
    const pathWithoutLocale = pn.replace(/^\/[a-z]{2}/, "");
    router.push(`/${newLocale}${pathWithoutLocale || "/"}`);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let cancelled = false;
    getProfile()
      .then((data) => {
        if (!cancelled && data.profile?.profileImg) {
          setAvatarUrl(data.profile.profileImg);
        }
      })
      .catch(() => {
        // Ignore errors
      });

    return () => {
      cancelled = true;
      setAvatarUrl(null);
    };
  }, [isLoggedIn]);

  // Focus input when search mode is activated
  useEffect(() => {
    if (isSearchMode && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchMode]);

  const handleLogout = () => {
    logout();
    r.push("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      setIsSearchMode(false);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  // Search Mode Header
  if (isSearchMode) {
    return (
      <header className="border-b border-[#e5e7eb] bg-white sticky top-0 z-10">
        <form
          onSubmit={handleSearchSubmit}
          className="container mx-auto flex h-16 items-center gap-3 px-4"
        >
          <Search className="w-5 h-5 text-gray-600 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={_(msg`검색어를 입력하세요`)}
            className="flex-1 h-full text-sm text-black outline-none placeholder:text-gray-400"
          />
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-[#4b5563] hover:text-gray-900 transition-colors shrink-0">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {localeLabels[locale] || "KO"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-[#e5e7eb] rounded-[6px] p-1 min-w-[80px]"
            >
              <DropdownMenuItem
                onClick={() => handleLocaleChange("ko")}
                className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                  locale === "ko"
                    ? "text-[#EA3A50] font-semibold"
                    : "text-[#374151]"
                }`}
              >
                한국어 (KO)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLocaleChange("zh")}
                className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                  locale === "zh"
                    ? "text-[#EA3A50] font-semibold"
                    : "text-[#374151]"
                }`}
              >
                中文 (CN)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={handleCloseSearch}
            className="p-1 hover:bg-gray-100 rounded-full shrink-0"
          >
            <X className="w-6 h-6 text-[#111827]" />
          </button>
        </form>
      </header>
    );
  }

  // Mobile Header
  const mobileHeader = !shouldHideMobile && (
    <header className="md:hidden block border-b border-[#e5e7eb] bg-white sticky top-0 z-10">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <LocalizedLink href="/" className="flex items-center">
          <Image src="/logo.png" width={78} height={16} alt="logo" />
        </LocalizedLink>

        {/* Right side - Language Switcher & Search */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-[#4b5563] hover:text-gray-900 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {localeLabels[locale] || "KO"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-[#e5e7eb] rounded-[6px] p-1 min-w-[80px]"
            >
              <DropdownMenuItem
                onClick={() => handleLocaleChange("ko")}
                className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                  locale === "ko"
                    ? "text-[#EA3A50] font-semibold"
                    : "text-[#374151]"
                }`}
              >
                한국어 (KO)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLocaleChange("zh")}
                className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                  locale === "zh"
                    ? "text-[#EA3A50] font-semibold"
                    : "text-[#374151]"
                }`}
              >
                中文 (CN)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Icon */}
          <button
            onClick={() => setIsSearchMode(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Search className="w-5 h-5 text-[#111827]" />
          </button>
        </div>
      </div>
    </header>
  );

  // Desktop Header
  const desktopHeader = (
    <header className="hidden md:block border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <LocalizedLink href="/" className="flex items-center">
            <Image src="/logo.png" width={78} height={16} alt="logo" />
          </LocalizedLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <LocalizedLink
              href="/campaigns"
              className={`text-sm ${
                pn.split("/").at(2) === "campaigns"
                  ? "font-semibold text-[#EA3A50]"
                  : "font-medium text-gray-900"
              } hover:text-red-600`}
            >
              <Trans>캠페인</Trans>
            </LocalizedLink>
            <LocalizedLink
              href="/community"
              className={`text-sm ${
                pn.includes("community")
                  ? "font-semibold text-[#EA3A50]"
                  : "font-medium text-gray-900"
              } hover:text-red-600`}
            >
              <Trans>커뮤니티</Trans>
            </LocalizedLink>
            <LocalizedLink
              href="/support"
              className={`text-sm ${
                pn.includes("support")
                  ? "font-semibold text-[#EA3A50]"
                  : "font-medium text-gray-900"
              } hover:text-red-600`}
            >
              <Trans>고객센터</Trans>
            </LocalizedLink>
          </nav>
        </div>

        {/* Right side - Auth & Search */}
        <div className="flex items-center gap-5">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-[#4b5563] hover:text-gray-900 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {localeLabels[locale] || "KO"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-[#e5e7eb] rounded-[6px] p-1 min-w-[80px]"
            >
              <DropdownMenuItem
                onClick={() => handleLocaleChange("ko")}
                className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                  locale === "ko"
                    ? "text-[#EA3A50] font-semibold"
                    : "text-[#374151]"
                }`}
              >
                한국어 (KO)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLocaleChange("zh")}
                className={`h-8 px-2 py-1.5 cursor-pointer text-xs leading-[1.7] hover:bg-gray-50 rounded-sm ${
                  locale === "zh"
                    ? "text-[#EA3A50] font-semibold"
                    : "text-[#374151]"
                }`}
              >
                中文 (CN)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a
            href="http://pf.kakao.com/_IRpxhn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-900 hover:text-red-600"
          >
            <Trans>광고문의</Trans>
          </a>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full cursor-pointer overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Image
                    src={
                      avatarUrl && avatarUrl.length > 0
                        ? avatarUrl
                        : "/images/default-avatar.svg"
                    }
                    width={32}
                    height={32}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-[#e5e7eb] rounded-[6px] p-1 gap-[2px] min-w-[100px]"
              >
                <DropdownMenuItem
                  onClick={() => r.push("/my-campaign")}
                  className="h-8 px-2 py-1.5 cursor-pointer text-xs text-[#374151] leading-[1.7] hover:bg-gray-50 rounded-sm"
                >
                  <Trans>나의 캠페인</Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => r.push("/profile")}
                  className="h-8 px-2 py-1.5 cursor-pointer text-xs text-[#374151] leading-[1.7] hover:bg-gray-50 rounded-sm"
                >
                  <Trans>계정 정보</Trans>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="h-8 px-2 py-1.5 cursor-pointer text-xs text-[#374151] leading-[1.7] hover:bg-gray-50 rounded-sm"
                >
                  <Trans>로그아웃</Trans>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LocalizedLink
              href="/login"
              className={`text-sm ${
                pn.includes("login")
                  ? "font-semibold text-[#EA3A50]"
                  : "font-medium text-gray-900"
              } hover:text-red-600`}
            >
              <Trans>로그인</Trans>
            </LocalizedLink>
          )}

          <button
            onClick={() => setIsSearchMode(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <>
      {mobileHeader}
      {desktopHeader}
    </>
  );
}
