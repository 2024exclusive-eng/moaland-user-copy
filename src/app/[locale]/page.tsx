import { Trans } from "@lingui/react";

import { initLingui, PageLangParam } from "@/lib/i18n.server";

export default async function Home(props: PageLangParam) {
  const lang = (await props.params).locale;
  initLingui(lang);

  return <Trans id="test" />;
}
