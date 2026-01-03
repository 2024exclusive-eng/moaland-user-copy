import api from "@/lib/axios";

// Types
export interface Notice {
  id: number;
  title: string;
  contents: string;
  created: string;
}

export interface Event {
  id: number;
  name: string;
  thumbnailPath: string;
  link: string;
  isActive: string;
  created: string;
  updated: string;
}

export type FaqType = "faq" | "service_guide" | "terms_of_use" | "privacy_policy";

export interface Faq {
  id: number;
  type: FaqType;
  title: string;
  answer: string;
  displayOrder: number;
  isActive: string;
  created: string;
  updated: string;
}

export interface Paging {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    paging: Paging;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

// Notice API
export async function getNotices(
  page: number = 1,
  item: number = 30
): Promise<PaginatedResponse<Notice>["data"]> {
  const response = await api.get<PaginatedResponse<Notice>>("/user/notice", {
    params: { page, item },
  });

  if (!response.data.success) {
    throw new Error("Failed to fetch notices");
  }

  return response.data.data;
}

export async function getNoticeById(id: number): Promise<Notice> {
  const response = await api.get<SingleResponse<Notice>>(`/user/notice/${id}`);

  if (!response.data.success) {
    throw new Error("Failed to fetch notice");
  }

  return response.data.data;
}

// Event API
export async function getEvents(
  page: number = 1,
  item: number = 30
): Promise<PaginatedResponse<Event>["data"]> {
  const response = await api.get<PaginatedResponse<Event>>("/user/event", {
    params: { page, item },
  });

  if (!response.data.success) {
    throw new Error("Failed to fetch events");
  }

  return response.data.data;
}

export async function getEventById(id: number): Promise<Event> {
  const response = await api.get<SingleResponse<Event>>(`/user/event/${id}`);

  if (!response.data.success) {
    throw new Error("Failed to fetch event");
  }

  return response.data.data;
}

// FAQ API
export async function getFaqs(
  type?: FaqType,
  page: number = 1,
  item: number = 30
): Promise<PaginatedResponse<Faq>["data"]> {
  const response = await api.get<PaginatedResponse<Faq>>("/user/faq", {
    params: { type, page, item },
  });

  if (!response.data.success) {
    throw new Error("Failed to fetch FAQs");
  }

  return response.data.data;
}

export async function getFaqById(id: number): Promise<Faq> {
  const response = await api.get<SingleResponse<Faq>>(`/user/faq/${id}`);

  if (!response.data.success) {
    throw new Error("Failed to fetch FAQ");
  }

  return response.data.data;
}

// Utility functions
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}
