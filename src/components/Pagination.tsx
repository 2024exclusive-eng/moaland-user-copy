"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={`flex items-center justify-center size-8 rounded-full text-sm font-medium leading-normal transition-colors ${
            page === currentPage
              ? "bg-[#E5E7EB] text-[#374151]"
              : "text-[#6B7280] hover:bg-gray-100"
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
