import type { MyCampaign, MyCampaignStatus } from "@/lib/api/campaign";

// Enable mock data for testing (set to false to use real API)
export const USE_MOCK_DATA = true;

// Helper to create mock campaign with all required fields
const createMockCampaign = (
  data: Partial<MyCampaign> & { missionId: number; title: string }
): MyCampaign => ({
  missionId: data.missionId,
  category: data.category || "Beauty",
  missionContent: data.missionContent || "",
  enrollStartDate: data.enrollStartDate || new Date().toISOString(),
  goodsContents: data.goodsContents || "",
  enrollEndDate: data.enrollEndDate || new Date().toISOString(),
  selectDate: data.selectDate || new Date().toISOString(),
  paymentDate: data.paymentDate || new Date().toISOString(),
  missionStartDate: data.missionStartDate || new Date().toISOString(),
  missionEndDate: data.missionEndDate || new Date().toISOString(),
  contentStartDate: data.contentStartDate || new Date().toISOString(),
  contentEndDate: data.contentEndDate || new Date().toISOString(),
  social: data.social || "Instagram",
  point: data.point || 0,
  maxEnroll: data.maxEnroll || 10,
  brand: data.brand || "",
  title: data.title,
  thumbnailImg: data.thumbnailImg || "/images/placeholder.png",
  isRecommended: data.isRecommended || 0,
  enrollCount: data.enrollCount || 0,
  enrollId: data.enrollId || 1,
  userName: data.userName || "테스트유저",
  status: data.status || "applied",
  link: data.link || null,
  linkUpdated: data.linkUpdated || null,
  visitDatetimeStart: data.visitDatetimeStart || null,
  visitDatetimeEnd: data.visitDatetimeEnd || null,
  instagramLink: data.instagramLink || "instagram.com/rizqiyi",
  wechatId: data.wechatId || null,
  memo: data.memo || null,
  created: data.created || new Date().toISOString(),
});

// Mock data for testing all tabs
export const MOCK_CAMPAIGNS: Record<MyCampaignStatus, MyCampaign[]> = {
  applied: [
    createMockCampaign({
      missionId: 1,
      title: "[강남] 빌라드 블랑",
      missionContent:
        "250,000원 상당 두피스케일링, 헤어크리닉, 헤어크리닉제 증정",
      enrollEndDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 20,
      maxEnroll: 2,
      social: "Instagram",
      point: 50000,
      category: "Beauty",
      brand: "빌라드 블랑",
    }),
    createMockCampaign({
      missionId: 2,
      title: "[홍대] 카페 모카",
      missionContent: "시그니처 음료 2잔 + 디저트 세트 제공, SNS 리뷰 작성",
      enrollEndDate: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 15,
      maxEnroll: 5,
      social: "Instagram,YouTube",
      point: 30000,
      category: "restaurant",
      brand: "카페 모카",
    }),
    createMockCampaign({
      missionId: 3,
      title: "[성수] 플라워 스튜디오",
      missionContent: "꽃다발 제작 클래스 무료 체험 + 완성작 증정",
      enrollEndDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 8,
      maxEnroll: 3,
      social: "Xiaohongshu",
      point: 80000,
      category: "Culture",
      brand: "플라워 스튜디오",
    }),
  ],
  selected: [
    createMockCampaign({
      missionId: 4,
      title: "[압구정] 스킨케어 클리닉",
      missionContent: "프리미엄 피부관리 풀코스 체험 (150,000원 상당)",
      enrollEndDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 10,
      maxEnroll: 2,
      social: "Instagram",
      point: 100000,
      category: "Beauty",
      brand: "스킨케어 클리닉",
      visitDatetimeStart: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      visitDatetimeEnd: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ).toISOString(),
      contentStartDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contentEndDate: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionStartDate: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionEndDate: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }),
    createMockCampaign({
      missionId: 5,
      title: "[이태원] 멕시칸 레스토랑",
      missionContent: "2인 코스요리 + 마가리타 2잔 제공",
      enrollEndDate: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 25,
      maxEnroll: 5,
      social: "YouTube",
      point: 70000,
      category: "restaurant",
      brand: "멕시칸 레스토랑",
      visitDatetimeStart: new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      visitDatetimeEnd: new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ).toISOString(),
      contentStartDate: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contentEndDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionStartDate: new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionEndDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }),
  ],
  registered: [
    createMockCampaign({
      missionId: 6,
      title: "[강남] 네일아트 살롱",
      missionContent: "젤네일 풀세트 + 케어 서비스 (120,000원 상당)",
      enrollEndDate: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 12,
      maxEnroll: 3,
      social: "Instagram",
      point: 60000,
      category: "Beauty",
      brand: "네일아트 살롱",
      visitDatetimeStart: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      visitDatetimeEnd: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ).toISOString(),
      contentStartDate: new Date(
        Date.now() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contentEndDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionStartDate: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionEndDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }),
  ],
  ended: [
    createMockCampaign({
      missionId: 7,
      title: "[명동] 코스메틱 스토어",
      missionContent: "신제품 스킨케어 라인 체험 키트 증정",
      enrollEndDate: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 50,
      maxEnroll: 10,
      social: "Xiaohongshu",
      point: 40000,
      category: "Beauty",
      brand: "코스메틱 스토어",
      visitDatetimeStart: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      visitDatetimeEnd: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ).toISOString(),
      contentStartDate: new Date(
        Date.now() - 24 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contentEndDate: new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionStartDate: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionEndDate: new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }),
    createMockCampaign({
      missionId: 8,
      title: "[잠실] 스포츠 센터",
      missionContent: "PT 3회 무료 체험 + 운동복 증정",
      enrollEndDate: new Date(
        Date.now() - 45 * 24 * 60 * 60 * 1000
      ).toISOString(),
      enrollCount: 30,
      maxEnroll: 5,
      social: "Instagram,YouTube",
      point: 150000,
      category: "Culture",
      brand: "스포츠 센터",
      visitDatetimeStart: new Date(
        Date.now() - 40 * 24 * 60 * 60 * 1000
      ).toISOString(),
      visitDatetimeEnd: new Date(
        Date.now() - 40 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ).toISOString(),
      contentStartDate: new Date(
        Date.now() - 39 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contentEndDate: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionStartDate: new Date(
        Date.now() - 40 * 24 * 60 * 60 * 1000
      ).toISOString(),
      missionEndDate: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }),
  ],
};

export const MOCK_COUNTS = {
  applied: 3,
  selected: 2,
  registered: 1,
  ended: 2,
};
