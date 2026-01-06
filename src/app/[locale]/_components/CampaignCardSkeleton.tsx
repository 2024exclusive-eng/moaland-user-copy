"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CampaignCardSkeleton() {
  return (
    <div className="group">
      {/* Image Container */}
      <Skeleton className="w-full aspect-square rounded-lg mb-3" />

      {/* Content */}
      <div className="mt-3">
        {/* Social & Days Remaining */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-sm" />
            <Skeleton className="w-16 h-4" />
          </div>
          <Skeleton className="w-14 h-3" />
        </div>

        {/* Title */}
        <div className="mt-2">
          <Skeleton className="w-full h-5 mb-2" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}

export function CampaignCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CampaignCardSkeleton key={i} />
      ))}
    </div>
  );
}
