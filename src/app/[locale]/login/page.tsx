"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Eye, EyeOff, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/shared/hooks/use-auth";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

export default function LoginPage() {
  const { _ } = useLingui();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const r = useLocalizedNavigation();
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      r.push("/my-campaign");
    } catch {
      // Error is handled by useAuth hook
    }
  };

  const handleMoveToInquire = () => {
    window.open("http://pf.kakao.com/_IRpxhn", "_blank", "noopener,noreferrer");
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 h-[64vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-12">
          <Image src="/logo.png" width={108} height={22} alt="logo" />
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder={_(msg`이메일`)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-3.5 py-2.5 border-[#e5e7eb] text-sm placeholder:text-[#9ca3af]"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={_(msg`비밀번호`)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 px-3.5 py-2.5 pr-10 border-[#e5e7eb] text-sm placeholder:text-[#9ca3af]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="text-sm font-medium text-[#7f828c] hover:text-[#6b7280] transition-colors"
              >
                {_(msg`이메일찾기`)}
              </button>
              <div className="h-3 w-px bg-[#e5e7eb]" />
              <LocalizedLink
                href="/forgot-password"
                className="text-sm font-medium text-[#7f828c] hover:text-[#6b7280] transition-colors"
              >
                {_(msg`비밀번호찾기`)}
              </LocalizedLink>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-[#ea3a50] hover:bg-[#d63447] cursor-pointer text-white text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {isLoading ? _(msg`로그인 중...`) : _(msg`로그인`)}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => r.push("/register")}
            className="w-full h-10 border-[#ea3a50] text-[#ea3a50] hover:text-[#ea3a50] hover:bg-white cursor-pointer text-sm font-medium rounded-lg"
          >
            {_(msg`회원가입`)}
          </Button>
        </form>
      </div>

      {/* Find Email Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md p-0" showCloseButton={false}>
          <DialogHeader className="px-5 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="w-5" />
              <DialogTitle className="text-base font-semibold text-[#242424] text-center">
                {_(msg`이메일찾기`)}
              </DialogTitle>
              <button
                onClick={() => setDialogOpen(false)}
                className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                <X className="w-5 h-5 text-[#111827]" />
              </button>
            </div>
          </DialogHeader>
          <div className="px-5 py-4 text-center">
            <p className="text-base text-[#374151] leading-[1.7] whitespace-pre-wrap">
              {_(msg`가입 이메일을 잊으셨나요?`)}
              {"\n"}
              {_(msg`문의 채널을 이용해주세요.`)}
            </p>
          </div>
          <div className="px-5 py-4">
            <Button
              onClick={handleMoveToInquire}
              variant="outline"
              className="w-full h-10 border-[#e5e7eb] text-[#374151] text-sm font-medium"
            >
              {_(msg`문의채널로 이동`)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
