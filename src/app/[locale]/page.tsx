import { HomeContent } from "@/app/[locale]/_components/HomeContent";
import { initLingui, PageLangParam } from "@/lib/i18n.server";

export default async function Home(props: PageLangParam) {
  const lang = (await props.params).locale;
  initLingui(lang);

  return <HomeContent />;
}
