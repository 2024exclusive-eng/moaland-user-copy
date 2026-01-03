import { CampaignDetailContent } from "./_components/CampaignDetailContent";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CampaignDetailPage(props: PageProps) {
  const params = await props.params;

  const missionId = Number(params.id);

  return <CampaignDetailContent missionId={missionId} />;
}
