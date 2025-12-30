import { PropsWithChildren } from "react";

import { FloatingInquiryButton } from "@/components/FloatingInquiryButton";
import { LinguiClientProvider } from "@/components/LinguiProvider";
import { allMessages, locales } from "@/lib/i18n";
import { initLingui, PageLangParam } from "@/lib/i18n.server";

import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

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
        <Header />
        {children}
        <Footer />
        <FloatingInquiryButton />
      </LinguiClientProvider>
    </main>
  );
}
