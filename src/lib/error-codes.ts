"use client";

import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { useCallback, useMemo } from "react";

// Error codes from backend API
export const ERROR_CODES = {
  // AUTH 10XX
  NOT_MATCH_CODE: 1001,
  EXPIRE_CODE: 1002,
  DUPLICATED_EMAIL: 1003,
  NO_USER_BY_EMAIL: 1004,
  NOT_MATCH_LOGIN_INFO: 1005,
  NEED_EMAIL: 1006,
  INVALID_EMAIL: 1007,
  NEED_PASSWORD: 1010,
  NEED_LINK: 1011,
  DUPLICATED_LINK: 1012,
  NEED_ACCOUNT: 1013,
  NEED_DEPOSITOR: 1014,

  // USER PROFILE 20XX
  NEED_TITLE: 2001,
  NEED_PROFILE_IMAGE: 2002,
  NEED_PROFILE_BACKGROUND_IMAGE: 2003,
  NEED_DESIGN_BACKGROUND_TYPE: 2004,
  NEED_DESIGN_BACKGROUND_IMAGE: 2005,
  NEED_DESIGN_BACKGROUND_COLOR: 2006,
  NEED_DESIGN_BLOCK_BACKGROUND_COLOR: 2008,
  NEED_DESIGN_BLOCK_TEXT_FONT: 2010,
  NEED_PROFILE_BUTTON_TEXT: 2011,
  NEED_PROFILE_BUTTON_URL: 2012,

  // USER INQUIRY 30XX
  NEED_INQUIRY_BLOCK_ID: 3001,
  NEED_INQUIRY_CONTENTS: 3002,
  NEED_INQUIRY_NAME: 3003,
  NEED_INQUIRY_LINE_ID: 3004,
  NEED_INQUIRY_TITLE: 3005,

  // USER BLOCK 40XX
  NEED_BLOCK_LINK_LINK: 4001,
  NEED_BLOCK_LINK_TITLE: 4002,
  NEED_BLOCK_LINK_LAYOUT: 4003,
  NEED_BLOCK_LINK_IMAGE: 4004,
  NEED_BLOCK_TEXT_TITLE: 4011,
  NEED_BLOCK_TEXT_ALIGN: 4012,
  NEED_BLOCK_IMAGE_LIST: 4021,
  NEED_BLOCK_IMAGE_LAYOUT: 4022,
  NEED_BLOCK_VIDEO_URL: 4031,
  NEED_BLOCK_DIVIDER_TYPE: 4041,
  NEED_BLOCK_DIVIDER_MARGIN: 4042,
  NEED_BLOCK_SCHEDULE_LIST: 4051,
  NEED_BLOCK_SCHEDULE_TITLE: 4052,
  NEED_BLOCK_SCHEDULE_START_DATE: 4053,
  NEED_BLOCK_SCHEDULE_END_DATE: 4054,
  NEED_BLOCK_MAP_ADDRESS: 4061,
  NEED_BLOCK_MAP_LATITUDE: 4062,
  NEED_BLOCK_MAP_LONGITUDE: 4063,
  NEED_BLOCK_SNS_LIST: 4071,
  NEED_BLOCK_SNS_LINK: 4072,
  NEED_BLOCK_SNS_TITLE: 4073,
  NEED_BLOCK_SNS_LAYOUT: 4074,
  NEED_BLOCK_INQUIRY_LIST: 4081,
  NEED_BLOCK_INQUIRY_FORM: 4082,
  NEED_BLOCK_INQUIRY_TITLE: 4083,

  // MISSION 50XX
  MISSION_ALREADY_ENROLLED: 5001,
  MISSION_MAX_ENROLL_REACHED: 5002,
  MISSION_ALREADY_STARTED: 5003,
  MISSION_ALREADY_ENDED: 5004,
  MISSION_NEED_NAME: 5005,
  MISSION_NEED_SOCIAL: 5006,
  MISSION_NEED_ADDRESS: 5007,
  MISSION_NEED_LINKS: 5008,
  MISSION_NOT_FOUND: 5009,
  MISSION_CONTENT_PERIOD_EXPIRED: 5010,
  MISSION_CONTENT_PERIOD_NOT_STARTED: 5011,
  MISSION_NEED_INSTAGRAM: 5012,
  MISSION_NEED_WECHAT: 5013,
  MISSION_NEED_VISIT_DATE: 5014,

  // POINT 60XX
  NOT_ENOUGH_BALANCE: 6001,

  // COMMON 90XX
  NEED_IMAGE: 9001,

  // ADMIN AUTH 100XX
  ADMIN_AUTH_NOT_MATCH_INFO: 10001,
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Hook to get translated error messages based on error codes
 * Uses Lingui for i18n support
 */
export function useErrorCodeTranslation() {
  const { _ } = useLingui();

  const errorMessages = useMemo(
    () =>
      ({
        // AUTH 10XX
        [ERROR_CODES.NOT_MATCH_CODE]: _(msg`인증코드가 일치하지 않습니다.`),
        [ERROR_CODES.EXPIRE_CODE]: _(msg`인증코드가 만료되었습니다.`),
        [ERROR_CODES.DUPLICATED_EMAIL]: _(msg`이미 가입된 이메일입니다.`),
        [ERROR_CODES.NO_USER_BY_EMAIL]: _(msg`가입된 이메일이 없습니다.`),
        [ERROR_CODES.NOT_MATCH_LOGIN_INFO]: _(
          msg`이메일이나 비밀번호가 일치하지 않습니다.`
        ),
        [ERROR_CODES.NEED_EMAIL]: _(msg`이메일을 입력해주세요.`),
        [ERROR_CODES.INVALID_EMAIL]: _(msg`올바른 이메일 형식이 아닙니다.`),
        [ERROR_CODES.NEED_PASSWORD]: _(msg`비밀번호를 입력해주세요.`),
        [ERROR_CODES.NEED_LINK]: _(msg`링크를 입력해주세요.`),
        [ERROR_CODES.DUPLICATED_LINK]: _(msg`이미 등록된 링크입니다.`),
        [ERROR_CODES.NEED_ACCOUNT]: _(msg`계좌번호를 입력해주세요.`),
        [ERROR_CODES.NEED_DEPOSITOR]: _(msg`예금주를 입력해주세요.`),

        // USER PROFILE 20XX
        [ERROR_CODES.NEED_TITLE]: _(msg`프로필명이 필요합니다.`),
        [ERROR_CODES.NEED_PROFILE_IMAGE]: _(msg`프로필 이미지가 필요합니다.`),
        [ERROR_CODES.NEED_PROFILE_BACKGROUND_IMAGE]: _(
          msg`프로필 배경 이미지가 필요합니다.`
        ),
        [ERROR_CODES.NEED_DESIGN_BACKGROUND_TYPE]: _(
          msg`프로필 디자인 배경 타입이 필요합니다.`
        ),
        [ERROR_CODES.NEED_DESIGN_BACKGROUND_IMAGE]: _(
          msg`프로필 디자인 배경 이미지가 필요합니다.`
        ),
        [ERROR_CODES.NEED_DESIGN_BACKGROUND_COLOR]: _(
          msg`프로필 디자인 배경 색상이 필요합니다.`
        ),
        [ERROR_CODES.NEED_DESIGN_BLOCK_BACKGROUND_COLOR]: _(
          msg`프로필 디자인 버튼 배경 색상이 필요합니다.`
        ),
        [ERROR_CODES.NEED_DESIGN_BLOCK_TEXT_FONT]: _(
          msg`프로필 디자인 버튼 폰트가 필요합니다.`
        ),
        [ERROR_CODES.NEED_PROFILE_BUTTON_TEXT]: _(
          msg`프로필 버튼 텍스트가 필요합니다.`
        ),
        [ERROR_CODES.NEED_PROFILE_BUTTON_URL]: _(
          msg`프로필 버튼 링크가 필요합니다.`
        ),

        // USER INQUIRY 30XX
        [ERROR_CODES.NEED_INQUIRY_BLOCK_ID]: _(msg`block id가 필요합니다.`),
        [ERROR_CODES.NEED_INQUIRY_CONTENTS]: _(msg`문의내용을 입력해주세요.`),
        [ERROR_CODES.NEED_INQUIRY_NAME]: _(msg`이름을 입력해주세요.`),
        [ERROR_CODES.NEED_INQUIRY_LINE_ID]: _(msg`라인 ID를 입력해주세요.`),
        [ERROR_CODES.NEED_INQUIRY_TITLE]: _(msg`block title이 필요합니다.`),

        // USER BLOCK 40XX
        [ERROR_CODES.NEED_BLOCK_LINK_LINK]: _(
          msg`링크 블록의 링크가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_LINK_TITLE]: _(
          msg`링크 블록의 제목이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_LINK_LAYOUT]: _(
          msg`링크 블록의 레이아웃이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_LINK_IMAGE]: _(
          msg`링크 블록의 이미지가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_TEXT_TITLE]: _(
          msg`텍스트 블록의 제목이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_TEXT_ALIGN]: _(
          msg`텍스트 블록의 정렬 정보가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_IMAGE_LIST]: _(
          msg`이미지 블록의 이미지 리스트가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_IMAGE_LAYOUT]: _(
          msg`이미지 블록의 레이아웃이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_VIDEO_URL]: _(
          msg`비디오 블록의 URL이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_DIVIDER_TYPE]: _(
          msg`구분 블록의 타입이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_DIVIDER_MARGIN]: _(
          msg`구분 블록의 여백 정보가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_SCHEDULE_LIST]: _(
          msg`캘린더 블록의 일정 리스트가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_SCHEDULE_TITLE]: _(
          msg`캘린더 블록의 일정 제목이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_SCHEDULE_START_DATE]: _(
          msg`캘린더 블록의 일정 시작 날짜가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_SCHEDULE_END_DATE]: _(
          msg`캘린더 블록의 일정 종료 날짜가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_MAP_ADDRESS]: _(
          msg`지도 블록의 주소가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_MAP_LATITUDE]: _(
          msg`지도 블록의 위도 정보가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_MAP_LONGITUDE]: _(
          msg`지도 블록의 경도 정보가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_SNS_LIST]: _(
          msg`SNS 블록의 SNS 리스트가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_SNS_LINK]: _(msg`SNS 블록의 링크가 필요합니다.`),
        [ERROR_CODES.NEED_BLOCK_SNS_TITLE]: _(
          msg`SNS 블록의 제목이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_SNS_LAYOUT]: _(
          msg`SNS 블록의 레이아웃이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_INQUIRY_LIST]: _(
          msg`문의 블록의 문의 리스트가 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_INQUIRY_FORM]: _(
          msg`문의 블록의 문의 양식이 필요합니다.`
        ),
        [ERROR_CODES.NEED_BLOCK_INQUIRY_TITLE]: _(
          msg`문의 블록의 제목이 필요합니다.`
        ),

        // MISSION 50XX
        [ERROR_CODES.MISSION_ALREADY_ENROLLED]: _(msg`이미 신청한 미션입니다.`),
        [ERROR_CODES.MISSION_MAX_ENROLL_REACHED]: _(
          msg`미션 신청자가 초과되었습니다.`
        ),
        [ERROR_CODES.MISSION_ALREADY_STARTED]: _(
          msg`시작하지 않은 미션입니다.`
        ),
        [ERROR_CODES.MISSION_ALREADY_ENDED]: _(msg`종료된 미션입니다.`),
        [ERROR_CODES.MISSION_NEED_NAME]: _(msg`이름을 입력해주세요.`),
        [ERROR_CODES.MISSION_NEED_SOCIAL]: _(msg`소셜정보를 입력해주세요.`),
        [ERROR_CODES.MISSION_NEED_ADDRESS]: _(msg`주소를 입력해주세요.`),
        [ERROR_CODES.MISSION_NEED_LINKS]: _(msg`컨텐츠 링크를 입력해주세요.`),
        [ERROR_CODES.MISSION_NOT_FOUND]: _(msg`미션을 찾을 수 없습니다.`),
        [ERROR_CODES.MISSION_CONTENT_PERIOD_EXPIRED]: _(
          msg`컨텐츠 등록 기간이 만료되었습니다.`
        ),
        [ERROR_CODES.MISSION_CONTENT_PERIOD_NOT_STARTED]: _(
          msg`컨텐츠 등록 기간이 시작되지 않았습니다.`
        ),
        [ERROR_CODES.MISSION_NEED_INSTAGRAM]: _(
          msg`Instagram 링크를 입력해주세요.`
        ),
        [ERROR_CODES.MISSION_NEED_WECHAT]: _(msg`WeChat ID를 입력해주세요.`),
        [ERROR_CODES.MISSION_NEED_VISIT_DATE]: _(
          msg`방문 날짜와 시간을 입력해주세요.`
        ),

        // POINT 60XX
        [ERROR_CODES.NOT_ENOUGH_BALANCE]: _(msg`포인트가 충분하지 않습니다.`),

        // COMMON 90XX
        [ERROR_CODES.NEED_IMAGE]: _(msg`업로드할 이미지가 없습니다.`),

        // ADMIN AUTH 100XX
        [ERROR_CODES.ADMIN_AUTH_NOT_MATCH_INFO]: _(
          msg`아이디나 비밀번호가 일치하지 않습니다.`
        ),
      }) as Record<ErrorCode, string>,
    [_]
  );

  /**
   * Get translated error message by error code
   * Returns null if code is not found
   */
  const getErrorMessage = useCallback(
    (code: number | undefined | null): string | null => {
      if (code === undefined || code === null) return null;
      return errorMessages[code as ErrorCode] || null;
    },
    [errorMessages]
  );

  /**
   * Get translated error message from API error response
   * Falls back to original message if code is not found
   */
  const translateApiError = useCallback(
    (error: { code?: number; msg?: string } | string | null | undefined): string | null => {
      if (!error) return null;

      if (typeof error === "string") {
        return error;
      }

      // Try to translate by code first
      if (error.code) {
        const translatedMsg = getErrorMessage(error.code);
        if (translatedMsg) return translatedMsg;
      }

      // Fall back to original message
      return error.msg || null;
    },
    [getErrorMessage]
  );

  return {
    getErrorMessage,
    translateApiError,
    errorMessages,
  };
}

/**
 * Extract error code and message from API error response
 */
export function extractApiError(err: unknown): { code?: number; msg?: string } | null {
  const apiError = err as {
    response?: {
      data?: {
        error?: { code?: number; msg?: string } | string;
      };
    };
    error?: { code?: number; msg?: string } | string;
  };

  // Check axios error response structure
  const errorData = apiError?.response?.data?.error;
  if (errorData) {
    if (typeof errorData === "object") {
      return { code: errorData.code, msg: errorData.msg };
    }
    return { msg: errorData };
  }

  // Check direct error object (for API response with success: false)
  const directError = apiError?.error;
  if (directError) {
    if (typeof directError === "object") {
      return { code: directError.code, msg: directError.msg };
    }
    return { msg: directError };
  }

  // Check for Error object message
  if (err instanceof Error && err.message) {
    return { msg: err.message };
  }

  return null;
}
