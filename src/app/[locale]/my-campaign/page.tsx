"use client";

import Image from "next/image";
import { useState } from "react";

import LocalizedLink from "@/components/LocalizedLink";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  calculateDaysRemaining,
  type MyCampaign,
  type MyCampaignStatus,
  parseSocialPlatforms,
  SOCIAL_LOGO_MAP,
} from "@/lib/api/campaign";
import {
  useMyCampaigns,
  useMyCampaignsCounts,
} from "@/shared/hooks/use-campaigns";

import { CancelConfirmDialog } from "./_components/CancelConfirmDialog";
import { CancelSuccessDialog } from "./_components/CancelSuccessDialog";
import { EditContentDialog } from "./_components/EditContentDialog";
import { SubmitContentDialog } from "./_components/SubmitContentDialog";
import { ViewApplicationDialog } from "./_components/ViewApplicationDialog";
import { ViewContentDialog } from "./_components/ViewContentDialog";
import { ViewSelectedCampaignDialog } from "./_components/ViewSelectedCampaignDialog";

const ITEMS_PER_PAGE = 10;

// Tab configuration with labels
const TABS: { key: MyCampaignStatus; label: string }[] = [
  { key: "applied", label: "신청한 캠페인" },
  { key: "selected", label: "선정된 캠페인" },
  { key: "registered", label: "등록한 캠페인" },
  { key: "ended", label: "종료된 캠페인" },
];

// Action button configuration based on status
function getActionButtons(status: MyCampaignStatus) {
  switch (status) {
    case "applied":
      return [
        { label: "신청취소", variant: "cancel" as const },
        { label: "신청서 보기", variant: "view" as const },
      ];
    case "selected":
      return [
        { label: "콘텐츠 등록", variant: "view" as const },
        { label: "캠페인 보기", variant: "primaryFilled" as const },
      ];
    case "registered":
      return [
        { label: "콘텐츠 수정", variant: "view" as const },
        { label: "캠페인 보기", variant: "primaryFilled" as const },
      ];
    case "ended":
      return [
        { label: "캠페인 보기", variant: "view" as const },
        { label: "콘텐츠 보기", variant: "view" as const },
      ];
    default:
      return [];
  }
}

function CampaignCardSkeleton() {
  return (
    <div className="border-b border-[#e5e7eb] px-3 py-5 flex gap-3 items-center">
      <Skeleton className="w-19.5 h-19.5 rounded shrink-0" />
      <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-3 items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}

function CampaignCard({
  campaign,
  status,
  onViewApplication,
  onCancelApplication,
  onViewSelectedCampaign,
  onSubmitContent,
  onViewContent,
  onEditContent,
}: {
  campaign: MyCampaign;
  status: MyCampaignStatus;
  onViewApplication?: (campaign: MyCampaign) => void;
  onCancelApplication?: (campaign: MyCampaign) => void;
  onViewSelectedCampaign?: (campaign: MyCampaign) => void;
  onSubmitContent?: (campaign: MyCampaign) => void;
  onViewContent?: (campaign: MyCampaign) => void;
  onEditContent?: (campaign: MyCampaign) => void;
}) {
  const daysRemaining = calculateDaysRemaining(campaign.enrollEndDate);
  const socialPlatforms = parseSocialPlatforms(campaign.social);
  const actionButtons = getActionButtons(status);

  const handleButtonClick = (variant: string, label: string) => {
    if (status === "applied") {
      if (variant === "view" && onViewApplication) {
        onViewApplication(campaign);
      } else if (variant === "cancel" && onCancelApplication) {
        onCancelApplication(campaign);
      }
    } else if (status === "selected") {
      if (variant === "view" && onViewSelectedCampaign) {
        onViewSelectedCampaign(campaign);
      } else if (variant === "primaryFilled" && onSubmitContent) {
        onSubmitContent(campaign);
      }
    } else if (status === "registered") {
      if (variant === "view" && onViewContent) {
        onViewContent(campaign);
      } else if (variant === "primaryFilled" && onEditContent) {
        onEditContent(campaign);
      }
    } else if (status === "ended") {
      if (label === "캠페인 보기" && onViewSelectedCampaign) {
        onViewSelectedCampaign(campaign);
      } else if (label === "콘텐츠 보기" && onViewContent) {
        onViewContent(campaign);
      }
    }
  };

  return (
    <div className="border-b border-[#e5e7eb] px-3 py-5 flex gap-3 items-center">
      {/* Campaign Image */}
      <div className="w-19.5 h-19.5 rounded overflow-hidden shrink-0">
        <Image
          src={campaign.thumbnailImg || "/images/placeholder.png"}
          width={78}
          height={78}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Campaign Info */}
      <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-[#111827] leading-[1.7]">
            {campaign.title}
          </h3>
          <p className="text-sm text-[#6b7280] leading-[1.7] line-clamp-1">
            {campaign.missionContent}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {socialPlatforms.length > 0 && (
            <div className="flex gap-1.5 items-center">
              {socialPlatforms.slice(0, 1).map((platform) => {
                const logoConfig = SOCIAL_LOGO_MAP[platform];
                if (!logoConfig) return null;
                return (
                  <Image
                    key={platform}
                    src={logoConfig.src}
                    width={logoConfig.width}
                    height={logoConfig.height}
                    alt={platform}
                    className="object-cover"
                  />
                );
              })}
              {status !== "ended" && daysRemaining > 0 && (
                <p className="text-xs font-semibold text-[#111827] leading-[1.7]">
                  {daysRemaining}일 남음
                </p>
              )}
              {status === "ended" && (
                <p className="text-xs font-semibold text-[#9ca3af] leading-[1.7]">
                  종료됨
                </p>
              )}
            </div>
          )}

          <div className="h-2.5 w-0 border-l border-[#e5e7eb]" />

          <p className="text-xs text-[#4b5563] leading-[1.7]">
            신청 {campaign.enrollCount}/ {campaign.maxEnroll}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-50 shrink-0">
        {actionButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button.variant, button.label)}
            className={`flex-1 h-8 px-3 rounded-md flex items-center justify-center ${
              button.variant === "primaryFilled"
                ? "bg-[#ea3a50] border border-[#ea3a50]"
                : "bg-transparent border border-[#e5e7eb]"
            }`}
          >
            <span
              className={`text-sm font-medium leading-normal ${
                button.variant === "cancel"
                  ? "text-[#ff614e]"
                  : button.variant === "primaryFilled"
                  ? "text-white"
                  : "text-[#374151]"
              }`}
            >
              {button.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ status }: { status: MyCampaignStatus }) {
  const messages: Record<MyCampaignStatus, string> = {
    applied: "신청한 캠페인이 없습니다.",
    selected: "선정된 캠페인이 없습니다.",
    registered: "등록한 캠페인이 없습니다.",
    ended: "종료된 캠페인이 없습니다.",
  };

  return (
    <div className="py-20 text-center">
      <p className="text-[#9ca3af] text-base">{messages[status]}</p>
      <LocalizedLink
        href="/campaigns"
        className="mt-4 inline-block text-[#3b82f6] text-sm font-medium hover:underline"
      >
        캠페인 둘러보기
      </LocalizedLink>
    </div>
  );
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<MyCampaignStatus>("applied");

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [cancelConfirmDialogOpen, setCancelConfirmDialogOpen] = useState(false);
  const [cancelSuccessDialogOpen, setCancelSuccessDialogOpen] = useState(false);
  const [viewSelectedDialogOpen, setViewSelectedDialogOpen] = useState(false);
  const [submitContentDialogOpen, setSubmitContentDialogOpen] = useState(false);
  const [viewContentDialogOpen, setViewContentDialogOpen] = useState(false);
  const [editContentDialogOpen, setEditContentDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MyCampaign | null>(
    null
  );

  // Fetch campaigns for active tab
  const { campaigns, paging, isLoading, mutate } = useMyCampaigns(
    activeTab,
    currentPage,
    ITEMS_PER_PAGE
  );

  // Fetch counts for all tabs
  const counts = useMyCampaignsCounts();

  // Reset page when tab changes
  const handleTabChange = (tab: MyCampaignStatus) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle view application
  const handleViewApplication = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setViewDialogOpen(true);
  };

  // Handle cancel application
  const handleCancelApplication = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setCancelConfirmDialogOpen(true);
  };

  // Handle cancel from view dialog
  const handleCancelFromView = () => {
    setCancelConfirmDialogOpen(true);
  };

  // Handle cancel success
  const handleCancelSuccess = () => {
    setCancelSuccessDialogOpen(true);
    // Refresh the campaigns list and counts
    mutate();
    counts.mutate();
  };

  // Handle view selected campaign (for "selected" status)
  const handleViewSelectedCampaign = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setViewSelectedDialogOpen(true);
  };

  // Handle submit content (for "selected" status)
  const handleSubmitContent = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setSubmitContentDialogOpen(true);
  };

  // Handle content submit success
  const handleContentSubmitSuccess = () => {
    // Refresh the campaigns list and counts
    mutate();
    counts.mutate();
  };

  // Handle view content (for "registered" status)
  const handleViewContent = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setViewContentDialogOpen(true);
  };

  // Handle edit content (for "registered" status)
  const handleEditContent = (campaign: MyCampaign) => {
    setSelectedCampaign(campaign);
    setEditContentDialogOpen(true);
  };

  // Handle content edit success
  const handleContentEditSuccess = () => {
    // Refresh the campaigns list and counts
    mutate();
    counts.mutate();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 pt-10">
          <h1 className="text-[#111827] text-2xl font-bold">커뮤니티</h1>

          <div className="pl-3 mt-5">
            <LocalizedLink
              href="/my-campaign"
              className="text-lg transition-colors font-semibold text-[#111827] block"
            >
              나의 캠페인
            </LocalizedLink>
            <LocalizedLink
              href="/profile"
              className="text-lg mt-3 block transition-colors text-[#9CA3AF]"
            >
              계정 정보
            </LocalizedLink>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 md:border-l min-h-[64vh] border-[#e5e7eb] md:pl-10 py-10 flex flex-col gap-5.75">
          <h2 className="text-xl font-semibold text-[#111827] leading-normal">
            나의 캠페인
          </h2>

          <div className="flex flex-col gap-3">
            {/* Tab Menu */}
            <div className="border-b border-[#e5e7eb] flex items-center">
              {TABS.map((tab) => {
                const countMap = {
                  applied: counts.applied,
                  selected: counts.selected,
                  registered: counts.registered,
                  ended: counts.ended,
                };
                const count = countMap[tab.key] ?? 0;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`px-5 py-2.5 cursor-pointer text-base text-center ${
                      isActive
                        ? "border-b border-black font-bold text-[#111827]"
                        : "font-medium text-[#9ca3af]"
                    }`}
                  >
                    {tab.label}{" "}
                    <span className={isActive ? "text-[#ea3a50]" : ""}>
                      {counts.isLoading ? "-" : count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Campaign List */}
            <div className="flex flex-col">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <CampaignCardSkeleton key={index} />
                ))
              ) : campaigns.length === 0 ? (
                // Empty state
                <EmptyState status={activeTab} />
              ) : (
                // Campaign list
                campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.missionId}
                    campaign={campaign}
                    status={activeTab}
                    onViewApplication={handleViewApplication}
                    onCancelApplication={handleCancelApplication}
                    onViewSelectedCampaign={handleViewSelectedCampaign}
                    onSubmitContent={handleSubmitContent}
                    onViewContent={handleViewContent}
                    onEditContent={handleEditContent}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && campaigns.length > 0 && paging && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={paging.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ViewApplicationDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        campaign={selectedCampaign}
        onCancel={handleCancelFromView}
      />

      <CancelConfirmDialog
        open={cancelConfirmDialogOpen}
        onOpenChange={setCancelConfirmDialogOpen}
        missionId={selectedCampaign?.missionId ?? null}
        onSuccess={handleCancelSuccess}
      />

      <CancelSuccessDialog
        open={cancelSuccessDialogOpen}
        onOpenChange={setCancelSuccessDialogOpen}
      />

      <ViewSelectedCampaignDialog
        open={viewSelectedDialogOpen}
        onOpenChange={setViewSelectedDialogOpen}
        campaign={selectedCampaign}
      />

      <SubmitContentDialog
        open={submitContentDialogOpen}
        onOpenChange={setSubmitContentDialogOpen}
        campaign={selectedCampaign}
        onSuccess={handleContentSubmitSuccess}
      />

      <ViewContentDialog
        open={viewContentDialogOpen}
        onOpenChange={setViewContentDialogOpen}
        campaign={selectedCampaign}
      />

      <EditContentDialog
        open={editContentDialogOpen}
        onOpenChange={setEditContentDialogOpen}
        campaign={selectedCampaign}
        onSuccess={handleContentEditSuccess}
      />
    </div>
  );
}
