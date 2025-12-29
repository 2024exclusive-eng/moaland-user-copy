import { Locale } from "@lingui/core";
import { redirect } from "next/navigation";

export class ServerLocalizedNavigation {
  constructor(private locale: Locale) {}

  redirect(path: string): never {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const localizedPath = `/${this.locale}/${cleanPath}`;
    redirect(localizedPath);
  }

  replace(path: string): never {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const localizedPath = `/${this.locale}/${cleanPath}`;
    redirect(localizedPath);
  }

  redirectIf(condition: boolean, path: string, fallbackPath?: string): void {
    if (condition) {
      this.redirect(path);
    } else if (fallbackPath) {
      this.redirect(fallbackPath);
    }
  }

  buildUrl(path: string): string {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `/${this.locale}/${cleanPath}`;
  }

  getCurrentLocale(): Locale {
    return this.locale;
  }
}

export function createServerLocalizedNavigation(locale: Locale) {
  return new ServerLocalizedNavigation(locale);
}
