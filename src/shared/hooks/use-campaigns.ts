import useSWR from "swr";

import {
  type Banner,
  type Campaign,
  type CampaignDetail,
  type CampaignDetailResponse,
  type CampaignParams,
  getBanners,
  getCampaignDetail,
  getCampaigns,
  getMyCampaigns,
  type MyCampaign,
  type MyCampaignParams,
  type MyCampaignStatus,
  type Paging,
} from "@/lib/api/campaign";

// Fetcher functions
const bannerFetcher = (type: "home" | "right_banner") => getBanners(type);
const campaignFetcher = (params: CampaignParams) => getCampaigns(params);

// Hook for banners
export function useBanners(type: "home" | "right_banner" = "home") {
  const { data, error, isLoading, mutate } = useSWR<Banner[]>(
    ["banners", type],
    () => bannerFetcher(type),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    banners: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for campaigns with params
export function useCampaigns(params: CampaignParams = {}) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Campaign[]; paging: Paging }>(
    ["campaigns", params],
    () => campaignFetcher(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    campaigns: data?.data ?? [],
    paging: data?.paging,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for recommended campaigns
export function useRecommendedCampaigns(limit: number = 4) {
  return useCampaigns({ is_recommended: true, item: limit });
}

// Hook for deadline approaching campaigns
export function useDeadlineCampaigns(limit: number = 8) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Campaign[]; paging: Paging }>(
    ["campaigns", "deadline", limit],
    // pin: 관리자가 고정한 캠페인이 먼저 노출된다 (P34)
    // deadline_days: 마감된 캠페인을 제외하고 7일 이내 마감 건만 노출한다 (QA)
    () =>
      campaignFetcher({
        item: limit,
        sort: "deadline",
        pin: "deadline",
        deadline_days: 7,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    campaigns: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for new campaigns (paginated)
export function useNewCampaigns(page: number = 1, limit: number = 8) {
  // pin: 관리자가 고정한 캠페인이 먼저 노출된다 (P34)
  return useCampaigns({ page, item: limit, pin: "new" });
}

// Fetcher for my campaigns
const myCampaignFetcher = (params: MyCampaignParams) => getMyCampaigns(params);

// Hook for my campaigns by status
export function useMyCampaigns(
  type: MyCampaignStatus,
  page: number = 1,
  limit: number = 10
) {
  const params: MyCampaignParams = { type, page, item: limit };

  const { data, error, isLoading, mutate } = useSWR<{
    data: MyCampaign[];
    paging: Paging;
  }>(["my-campaigns", type, page, limit], () => myCampaignFetcher(params), {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  return {
    campaigns: data?.data ?? [],
    paging: data?.paging,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for all my campaigns counts (for tab badges)
export function useMyCampaignsCounts() {
  const applied = useMyCampaigns("applied", 1, 1);
  const selected = useMyCampaigns("selected", 1, 1);
  const registered = useMyCampaigns("registered", 1, 1);
  const ended = useMyCampaigns("ended", 1, 1);
  const rejected = useMyCampaigns("rejected", 1, 1);

  const mutateAll = () => {
    applied.mutate();
    selected.mutate();
    registered.mutate();
    ended.mutate();
    rejected.mutate();
  };

  return {
    applied: applied.paging?.totalItems ?? 0,
    selected: selected.paging?.totalItems ?? 0,
    registered: registered.paging?.totalItems ?? 0,
    ended: ended.paging?.totalItems ?? 0,
    rejected: rejected.paging?.totalItems ?? 0,
    isLoading:
      applied.isLoading ||
      selected.isLoading ||
      registered.isLoading ||
      ended.isLoading ||
      rejected.isLoading,
    mutate: mutateAll,
  };
}

// Fetcher for campaign detail
const campaignDetailFetcher = (missionId: number) => getCampaignDetail(missionId);

// Hook for campaign detail
export function useCampaignDetail(missionId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<CampaignDetailResponse>(
    missionId ? ["campaign-detail", missionId] : null,
    () => campaignDetailFetcher(missionId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    mission: data?.mission as CampaignDetail | undefined,
    isEnrolled: data?.isEnrolled ?? false,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
