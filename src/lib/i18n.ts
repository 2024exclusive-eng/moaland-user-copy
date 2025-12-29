import "server-only";

import { I18n, Messages, setupI18n } from "@lingui/core";

export const locales = ["en", "zh", "ko"] as const;
export const defaultLocale = "ko" as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

type SupportedLocales = string;

async function loadCatalog(locale: SupportedLocales): Promise<{
  [k: string]: Messages;
}> {
  const { messages } = await import(`../locales/${locale}/messages.po`);
  return {
    [locale]: messages,
  };
}
const catalogs = await Promise.all(locales.map(loadCatalog));

export const allMessages = catalogs.reduce((acc, oneCatalog) => {
  return { ...acc, ...oneCatalog };
}, {});

type AllI18nInstances = { [K in SupportedLocales]: I18n };

export const allI18nInstances: AllI18nInstances = locales.reduce(
  (acc, locale) => {
    const messages = allMessages[locale] ?? {};
    const i18n = setupI18n({
      locale,
      messages: { [locale]: messages },
    });
    i18n.activate(locale);
    return { ...acc, [locale]: i18n };
  },
  {}
);

export const getI18nInstance = (locale: SupportedLocales): I18n => {
  return allI18nInstances[locale]! || allI18nInstances["en"]!;
};
