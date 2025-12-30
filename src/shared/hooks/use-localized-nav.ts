"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLocalizedNavigation() {
  const router = useRouter();
  const params = useParams();
  const path = usePathname();
  const cleanPath = !path.at(3) ? "/" : `/${path.split("/")?.at(-1)}`;
  const currentLocale = params.locale as string;

  const push = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      router.push(`/${currentLocale}/${cleanPath}`);
    },
    [router, currentLocale]
  );

  const replace = useCallback(
    (path: string) => {
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      router.replace(`/${currentLocale}/${cleanPath}`);
    },
    [router, currentLocale]
  );

  return {
    push,
    replace,
    currentLocale,
    router,
    params,
    path: cleanPath,
  };
}
