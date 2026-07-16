import useSWR from "swr";

import {
  type Event,
  type Faq,
  type FaqType,
  getEventById,
  getEvents,
  getFaqs,
  getNoticeById,
  getNotices,
  type Notice,
  type Paging,
} from "@/lib/api/content";

// Hook for notices list
export function useNotices(page: number = 1, item: number = 30) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Notice[]; paging: Paging }>(
    ["notices", page, item],
    () => getNotices(page, item),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    notices: data?.data ?? [],
    paging: data?.paging,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for single notice
export function useNotice(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Notice>(
    id ? ["notice", id] : null,
    () => getNoticeById(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    notice: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for events list (supports lazy loading with null page)
export function useEvents(page: number | null = 1, item: number = 30) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Event[]; paging: Paging }>(
    page !== null ? ["events", page, item] : null,
    () => getEvents(page!, item),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    events: data?.data ?? [],
    paging: data?.paging,
    isLoading: page !== null && isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for single event
export function useEvent(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR<Event>(
    id ? ["event", id] : null,
    () => getEventById(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    event: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for FAQs list
export function useFaqs(type?: FaqType, page: number = 1, item: number = 30) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Faq[]; paging: Paging }>(
    ["faqs", type, page, item],
    () => getFaqs(type, page, item),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    faqs: data?.data ?? [],
    paging: data?.paging,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
