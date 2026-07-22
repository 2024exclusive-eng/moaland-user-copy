import { HomeContent } from "@/app/[locale]/_components/HomeContent";
import { initLingui, PageLangParam } from "@/lib/i18n.server";

interface HomeProps extends PageLangParam {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home(props: HomeProps) {
  const lang = (await props.params).locale;
  initLingui(lang);
  const searchParams = await props.searchParams;
  const initialPage = searchParams.page ? parseInt(searchParams.page) : 1;

  return <HomeContent initialPage={initialPage} />;
}
