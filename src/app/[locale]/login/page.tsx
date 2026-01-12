"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Eye, EyeOff, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/shared/hooks/use-auth";
import { useLocalizedNavigation } from "@/shared/hooks/use-localized-nav";

// Helper function to translate common error messages
function useTranslatedError(
  error: string | null,
  _: ReturnType<typeof useLingui>["_"]
): string | null {
  if (!error) return null;

  // Map common error messages to translations
  const errorMap: Record<string, string> = {
    "Login failed": _(msg`로그인에 실패했습니다.`),
    "Invalid email or password": _(
      msg`이메일 또는 비밀번호가 올바르지 않습니다.`
    ),
    "User not found": _(msg`사용자를 찾을 수 없습니다.`),
    "Invalid credentials": _(msg`인증 정보가 올바르지 않습니다.`),
    "Account is disabled": _(msg`계정이 비활성화되었습니다.`),
    "Too many attempts": _(
      msg`너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.`
    ),
  };

  return errorMap[error] || error;
}

export default function LoginPage() {
  const { _ } = useLingui();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const r = useLocalizedNavigation();
  const { login, isLoading, error, clearError } = useAuth();
  const translatedError = useTranslatedError(error, _);

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

  return (
    <div className="container mx-auto px-4 h-dvh md:h-[64vh] flex items-center justify-center">
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

            {translatedError && (
              <p className="text-sm text-red-500 text-center">
                {translatedError}
              </p>
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
        <DialogContent
          className="w-[372px] p-0 gap-0 overflow-hidden rounded-lg"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="bg-white flex items-center justify-between px-5 py-4 h-15">
            <div className="size-5" />
            <DialogTitle className="text-base font-semibold text-[#242424] leading-[1.7]">
              {_(msg`이메일찾기`)}
            </DialogTitle>
            <button
              onClick={() => setDialogOpen(false)}
              className="text-gray-800 hover:text-gray-600 transition-colors size-5"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white flex flex-col items-center px-5 pb-5">
            <p className="text-base text-[#374151] leading-[1.7] text-center mb-4 whitespace-pre-line">
              {_(msg`가입 이메일을 잊으셨나요?`)}
              {"\n"}
              {_(msg`위챗 QR코드를 스캔해주세요.`)}
            </p>

            {/* WeChat QR Code */}
            <div className="size-64.5 relative mb-4">
              <Image
                src="/wechat-qr.png"
                alt="WeChat QR Code"
                width={258}
                height={258}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
