import api from "@/lib/axios";

// Types
export interface Banner {
  id: number;
  type: string;
  name: string;
  thumbnailPath: string;
  link: string;
  isActive: string;
  created: string;
  updated: string;
}

export interface Campaign {
  missionId: number;
  category: string;
  missionContent: string;
  enrollStartDate: string;
  enrollEndDate: string;
  social: string;
  point: number;
  maxEnroll: number;
  brand: string;
  title: string;
  thumbnailImg: string;
  isRecommended: number;
  enrollCount: number;
}

// Campaign Detail (full mission info)
export interface CampaignDetail {
  missionId: number;
  category: string;
  enrollStartDate: string;
  enrollEndDate: string;
  selectDate: string;
  paymentDate: string;
  missionStartDate: string;
  missionEndDate: string;
  contentStartDate: string;
  contentEndDate: string;
  social: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  point: number;
  maxEnroll: number;
  brand: string;
  title: string;
  thumbnailImg: string;
  detailImg: string;
  goodsContents: string;
  missionContents: string;
  additionalInfo: string;
  guideline: string;
  isRecommended: boolean;
  enrollCount: number;
}

export interface CampaignDetailResponse {
  success: boolean;
  mission: CampaignDetail;
  isEnrolled: boolean;
}

export interface Paging {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface CampaignListResponse {
  success: boolean;
  data: {
    data: Campaign[];
    paging: Paging;
  };
}

export interface BannerListResponse {
  success: boolean;
  data: Banner[];
}

export interface CampaignParams {
  page?: number;
  item?: number;
  category?: string;
  region?: string;
  social?: string;
  is_recommended?: boolean;
  sort?: "deadline" | "newest";
  search?: string;
}

// My Campaign Types
export type MyCampaignStatus = "applied" | "selected" | "registered" | "ended";

export interface MyCampaign {
  missionId: number;
  category: string;
  missionContent: string;
  enrollStartDate: string;
  goodsContents: string;
  enrollEndDate: string;
  selectDate: string;
  paymentDate: string;
  missionStartDate: string;
  missionEndDate: string;
  contentStartDate: string;
  contentEndDate: string;
  social: string;
  point: number;
  maxEnroll: number;
  brand: string;
  title: string;
  thumbnailImg: string;
  isRecommended: number;
  enrollCount: number;
  // Enrollment fields
  enrollId: number;
  userName: string;
  status: string;
  link: string | null;
  linkUpdated: string | null;
  visitDatetimeStart: string | null;
  visitDatetimeEnd: string | null;
  instagramLink: string | null;
  wechatId: string | null;
  memo: string | null;
  created: string;
}

export interface MyCampaignListResponse {
  success: boolean;
  data: {
    data: MyCampaign[];
    paging: Paging;
  };
}

export interface MyCampaignParams {
  type: MyCampaignStatus;
  page?: number;
  item?: number;
}

// Category mappings
export const CATEGORY_MAP: Record<string, string> = {
  restaurant: "맛집",
  Hospital: "병원",
  Beauty: "뷰티",
  Culture: "문화",
  Stay: "숙박",
  Massage: "마사지",
};

// Social platform label mappings (Korean)
export const SOCIAL_LABEL_MAP: Record<string, string> = {
  Xiaohongshu: "샤오홍슈",
  Douyin: "도우인",
  Dajongdienping: "따종디엔핑",
  Instagram: "인스타그램",
  YouTube: "유튜브",
};

// Helper function to get social label
export function getSocialLabel(social: string): string {
  // Handle comma-separated social platforms, get the first one
  const firstSocial = social.split(",")[0].trim();
  return SOCIAL_LABEL_MAP[firstSocial] || firstSocial;
}

// Social platform mappings with custom dimensions
export interface SocialLogoConfig {
  src: string;
  width: number;
  height: number;
}

export const SOCIAL_LOGO_MAP: Record<string, SocialLogoConfig> = {
  Xiaohongshu: { src: "/images/xiaohongshu-logo.png", width: 16, height: 16 },
  Douyin: { src: "/images/douyin-logo.png", width: 22, height: 22 },
  Dajongdienping: { src: "/images/dianping-logo.jpg", width: 16, height: 16 },
  Instagram: { src: "/images/instagram-logo.webp", width: 16, height: 16 },
  YouTube: { src: "/images/youtube-logo.png", width: 20, height: 14 },
};

// API functions
export async function getBanners(
  type: "home" | "right_banner" = "home"
): Promise<Banner[]> {
  const response = await api.get<BannerListResponse>("/user/banner", {
    params: { type },
  });

  if (!response.data.success) {
    throw new Error("Failed to fetch banners");
  }

  return response.data.data;
}

export async function getCampaigns(
  params: CampaignParams = {}
): Promise<CampaignListResponse["data"]> {
  const response = await api.get<CampaignListResponse>("/user/mission/info", {
    params,
  });

  if (!response.data.success) {
    throw new Error("Failed to fetch campaigns");
  }

  return response.data.data;
}

// Get campaign/mission detail by ID
export async function getCampaignDetail(
  missionId: number
): Promise<CampaignDetailResponse> {
  const response = await api.get<CampaignDetailResponse>(
    `/user/mission/info/${missionId}`
  );

  if (!response.data.success) {
    throw new Error("Failed to fetch campaign detail");
  }

  return response.data;
}

export async function getRecommendedCampaigns(
  limit: number = 4
): Promise<Campaign[]> {
  const data = await getCampaigns({ is_recommended: true, item: limit });
  return data.data;
}

export async function getNewCampaigns(
  page: number = 1,
  limit: number = 8
): Promise<CampaignListResponse["data"]> {
  return getCampaigns({ page, item: limit });
}

// Utility functions
export function calculateDaysRemaining(enrollEndDate: string): number {
  const endDate = new Date(enrollEndDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDeadlineApproachingCampaigns(
  campaigns: Campaign[],
  maxDays: number = 7
): Campaign[] {
  return campaigns.filter((campaign) => {
    const days = calculateDaysRemaining(campaign.enrollEndDate);
    return days > 0 && days <= maxDays;
  });
}

export function parseSocialPlatforms(social: string): string[] {
  return social
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// My Campaigns API
export async function getMyCampaigns(
  params: MyCampaignParams
): Promise<MyCampaignListResponse["data"]> {
  const response = await api.get<MyCampaignListResponse>("/user/mission/my", {
    params,
  });

  if (!response.data.success) {
    throw new Error("Failed to fetch my campaigns");
  }

  return response.data.data;
}

// Campaign Application Types
export interface CampaignApplyRequest {
  name: string;
  instagramLink: string;
  wechatId: string;
  visitDatetimeStart: string;
  visitDatetimeEnd: string;
  memo?: string;
}

export interface CampaignApplyResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

// Enrollment Status Types
export type EnrollmentStatus =
  | "applied"
  | "selected"
  | "completed"
  | "rewarded"
  | "rejected"
  | "delayed";

export interface Enrollment {
  enrollId: number;
  missionId: number;
  userId: number;
  name: string;
  status: EnrollmentStatus;
  link: string | null;
  linkUpdated: string | null;
  created: string;
}

export interface EnrollmentStatusResponse {
  success: boolean;
  isEnrolled: boolean;
  enrollment: Enrollment | null;
}

// Apply for a campaign/mission
export async function applyForCampaign(
  missionId: number,
  data: CampaignApplyRequest
): Promise<CampaignApplyResponse> {
  const response = await api.post<CampaignApplyResponse>(
    `/user/mission/my/${missionId}`,
    data
  );

  return response.data;
}

// Cancel campaign application
export async function cancelCampaignApplication(
  missionId: number
): Promise<{ success: boolean }> {
  const response = await api.delete<{ success: boolean }>(
    `/user/mission/my/${missionId}`
  );

  return response.data;
}

// Check enrollment status for a mission
export async function checkEnrollmentStatus(
  missionId: number
): Promise<EnrollmentStatusResponse> {
  const response = await api.get<EnrollmentStatusResponse>(
    `/user/mission/my/${missionId}/status`
  );

  return response.data;
}

// Submit content links for a campaign
export interface SubmitContentResponse {
  success: boolean;
  data?: {
    links: Record<string, string>;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function submitContentLinks(
  missionId: number,
  links: Record<string, string>
): Promise<SubmitContentResponse> {
  const response = await api.put<SubmitContentResponse>(
    `/user/mission/my/${missionId}`,
    { links }
  );

  return response.data;
}
