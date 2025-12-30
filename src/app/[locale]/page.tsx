import { CategoryIcons } from "@/app/[locale]/_components/CategoryIcons";
import { HeroBanner } from "@/app/[locale]/_components/HeroBanner";
import { LandmarkSection } from "@/app/[locale]/_components/LandmarkSection";
import { Pagination } from "@/components/Pagination";
import { initLingui, PageLangParam } from "@/lib/i18n.server";

// Mock data - replace with real data later
const mockLandmarks = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    title: "랜드마크 레스토랑",
    category: "카페",
    rating: 4.5,
    reviewCount: 128,
    address: "서울시 강남구 테헤란로 427, 위워크타워 10층",
    distance: "1.2km",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    title: "멋진 레스토랑",
    category: "음식점",
    rating: 4.8,
    reviewCount: 256,
    address: "서울시 강남구 역삼동 123-45",
    distance: "2.5km",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    title: "모던 다이닝",
    category: "음식점",
    rating: 4.6,
    reviewCount: 89,
    address: "서울시 서초구 서초대로 123",
    distance: "3.1km",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    title: "힐링 카페",
    category: "카페",
    rating: 4.7,
    reviewCount: 145,
    address: "서울시 강남구 논현동 456-78",
    distance: "1.8km",
  },
];

export default async function Home(props: PageLangParam) {
  const lang = (await props.params).locale;
  initLingui(lang);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroBanner />
      <CategoryIcons />

      <div className="flex flex-col gap-16">
        <LandmarkSection
          title="캠페인"
          subtitle="추천"
          landmarks={mockLandmarks}
        />

        <LandmarkSection
          title="캠페인"
          subtitle="마감임박"
          landmarks={mockLandmarks}
        />

        <LandmarkSection
          title="캠페인 "
          subtitle="새로운"
          landmarks={[
            ...mockLandmarks,
            ...mockLandmarks.map((landmark) => ({
              ...landmark,
              id: `${landmark.id}_2`,
            })),
            ...mockLandmarks.map((landmark) => ({
              ...landmark,
              id: `${landmark.id}_3`,
            })),
            ...mockLandmarks.map((landmark) => ({
              ...landmark,
              id: `${landmark.id}_4`,
            })),
          ]}
        />
      </div>
      <div className="pt-10 pb-25">
        <Pagination currentPage={1} totalPages={5} />
      </div>
    </div>
  );
}
