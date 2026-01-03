import { initLingui, PageLangParam } from "@/lib/i18n.server";

import { CampaignsContent } from "./_components/CampaignsContent";

export interface CampaignsPageProps extends PageLangParam {
  searchParams: Promise<{
    category?: string;
    social?: string;
    page?: string;
  }>;
}

export default async function CampaignsPage(props: CampaignsPageProps) {
  const lang = (await props.params).locale;
  const searchParams = await props.searchParams;
  initLingui(lang);

  return (
    <CampaignsContent
      initialCategory={searchParams.category}
      initialSocial={searchParams.social}
      initialPage={searchParams.page ? parseInt(searchParams.page) : 1}
    />
  );
}
