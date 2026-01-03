"use client";

import useSWR from "swr";

import { getProfile, type ProfileResponse } from "@/lib/api/profile";

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<ProfileResponse>(
    "profile",
    getProfile,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    profile: data,
    isLoading,
    error,
    mutate,
  };
}
