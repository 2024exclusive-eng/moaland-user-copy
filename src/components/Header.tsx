"use client";

import { Search, X } from "lucide-react";
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

export function Header() {
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
  const locale = pn.split("/")[1] || "en";

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
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
            placeholder="검색어를 입력하세요"
            className="flex-1 h-full text-sm text-black outline-none placeholder:text-gray-400"
          />
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

  // Normal Header
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
              href="/campaigns"
              className={`text-sm ${
                pn.split("/").at(2) === "campaigns"
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
                  나의 캠페인
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => r.push("/profile")}
                  className="h-8 px-2 py-1.5 cursor-pointer text-xs text-[#374151] leading-[1.7] hover:bg-gray-50 rounded-sm"
                >
                  계정 정보
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="h-8 px-2 py-1.5 cursor-pointer text-xs text-[#374151] leading-[1.7] hover:bg-gray-50 rounded-sm"
                >
                  로그아웃
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
              로그인
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
}
