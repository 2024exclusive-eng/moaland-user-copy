import { PropsWithChildren } from "react";

import { LinguiClientProvider } from "@/components/LinguiProvider";
import { allMessages, locales } from "@/lib/i18n";
import { initLingui, PageLangParam } from "@/lib/i18n.server";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<PageLangParam>) {
  const lang = (await params).locale;
  initLingui(lang);

  return (
    <main>
      <LinguiClientProvider
        initialLocale={lang}
        initialMessages={allMessages[lang]!}
      >
        {children}
      </LinguiClientProvider>
    </main>
  );
}
