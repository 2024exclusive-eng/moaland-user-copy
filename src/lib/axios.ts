import axios from "axios";

import { ERROR_CODES } from "./error-codes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const TOKEN_COOKIE_NAME = "token";

// Static translation maps for each locale
const ERROR_MESSAGES: Record<string, Record<number, string>> = {
  ko: {
    [ERROR_CODES.NOT_MATCH_CODE]: "인증코드가 일치하지 않습니다.",
    [ERROR_CODES.EXPIRE_CODE]: "인증코드가 만료되었습니다.",
    [ERROR_CODES.DUPLICATED_EMAIL]: "이미 가입된 이메일입니다.",
    [ERROR_CODES.NO_USER_BY_EMAIL]: "가입된 이메일이 없습니다.",
    [ERROR_CODES.NOT_MATCH_LOGIN_INFO]: "이메일이나 비밀번호가 일치하지 않습니다.",
    [ERROR_CODES.NEED_EMAIL]: "이메일을 입력해주세요.",
    [ERROR_CODES.INVALID_EMAIL]: "올바른 이메일 형식이 아닙니다.",
    [ERROR_CODES.NEED_PASSWORD]: "비밀번호를 입력해주세요.",
    [ERROR_CODES.NEED_LINK]: "링크를 입력해주세요.",
    [ERROR_CODES.DUPLICATED_LINK]: "이미 등록된 링크입니다.",
    [ERROR_CODES.NEED_ACCOUNT]: "계좌번호를 입력해주세요.",
    [ERROR_CODES.NEED_DEPOSITOR]: "예금주를 입력해주세요.",
    [ERROR_CODES.NEED_TITLE]: "프로필명이 필요합니다.",
    [ERROR_CODES.NEED_PROFILE_IMAGE]: "프로필 이미지가 필요합니다.",
    [ERROR_CODES.NEED_PROFILE_BACKGROUND_IMAGE]: "프로필 배경 이미지가 필요합니다.",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_TYPE]: "프로필 디자인 배경 타입이 필요합니다.",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_IMAGE]: "프로필 디자인 배경 이미지가 필요합니다.",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_COLOR]: "프로필 디자인 배경 색상이 필요합니다.",
    [ERROR_CODES.NEED_DESIGN_BLOCK_BACKGROUND_COLOR]: "프로필 디자인 버튼 배경 색상이 필요합니다.",
    [ERROR_CODES.NEED_DESIGN_BLOCK_TEXT_FONT]: "프로필 디자인 버튼 폰트가 필요합니다.",
    [ERROR_CODES.NEED_PROFILE_BUTTON_TEXT]: "프로필 버튼 텍스트가 필요합니다.",
    [ERROR_CODES.NEED_PROFILE_BUTTON_URL]: "프로필 버튼 링크가 필요합니다.",
    [ERROR_CODES.NEED_INQUIRY_BLOCK_ID]: "block id가 필요합니다.",
    [ERROR_CODES.NEED_INQUIRY_CONTENTS]: "문의내용을 입력해주세요.",
    [ERROR_CODES.NEED_INQUIRY_NAME]: "이름을 입력해주세요.",
    [ERROR_CODES.NEED_INQUIRY_LINE_ID]: "라인 ID를 입력해주세요.",
    [ERROR_CODES.NEED_INQUIRY_TITLE]: "block title이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_LINK_LINK]: "링크 블록의 링크가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_LINK_TITLE]: "링크 블록의 제목이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_LINK_LAYOUT]: "링크 블록의 레이아웃이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_LINK_IMAGE]: "링크 블록의 이미지가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_TEXT_TITLE]: "텍스트 블록의 제목이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_TEXT_ALIGN]: "텍스트 블록의 정렬 정보가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_IMAGE_LIST]: "이미지 블록의 이미지 리스트가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_IMAGE_LAYOUT]: "이미지 블록의 레이아웃이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_VIDEO_URL]: "비디오 블록의 URL이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_DIVIDER_TYPE]: "구분 블록의 타입이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_DIVIDER_MARGIN]: "구분 블록의 여백 정보가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_LIST]: "캘린더 블록의 일정 리스트가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_TITLE]: "캘린더 블록의 일정 제목이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_START_DATE]: "캘린더 블록의 일정 시작 날짜가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_END_DATE]: "캘린더 블록의 일정 종료 날짜가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_MAP_ADDRESS]: "지도 블록의 주소가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_MAP_LATITUDE]: "지도 블록의 위도 정보가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_MAP_LONGITUDE]: "지도 블록의 경도 정보가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SNS_LIST]: "SNS 블록의 SNS 리스트가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SNS_LINK]: "SNS 블록의 링크가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SNS_TITLE]: "SNS 블록의 제목이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_SNS_LAYOUT]: "SNS 블록의 레이아웃이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_LIST]: "문의 블록의 문의 리스트가 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_FORM]: "문의 블록의 문의 양식이 필요합니다.",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_TITLE]: "문의 블록의 제목이 필요합니다.",
    [ERROR_CODES.MISSION_ALREADY_ENROLLED]: "이미 신청한 미션입니다.",
    [ERROR_CODES.MISSION_MAX_ENROLL_REACHED]: "미션 신청자가 초과되었습니다.",
    [ERROR_CODES.MISSION_ALREADY_STARTED]: "시작하지 않은 미션입니다.",
    [ERROR_CODES.MISSION_ALREADY_ENDED]: "종료된 미션입니다.",
    [ERROR_CODES.MISSION_NEED_NAME]: "이름을 입력해주세요.",
    [ERROR_CODES.MISSION_NEED_SOCIAL]: "소셜정보를 입력해주세요.",
    [ERROR_CODES.MISSION_NEED_ADDRESS]: "주소를 입력해주세요.",
    [ERROR_CODES.MISSION_NEED_LINKS]: "컨텐츠 링크를 입력해주세요.",
    [ERROR_CODES.MISSION_NOT_FOUND]: "미션을 찾을 수 없습니다.",
    [ERROR_CODES.MISSION_CONTENT_PERIOD_EXPIRED]: "컨텐츠 등록 기간이 만료되었습니다.",
    [ERROR_CODES.MISSION_CONTENT_PERIOD_NOT_STARTED]: "컨텐츠 등록 기간이 시작되지 않았습니다.",
    [ERROR_CODES.MISSION_NEED_INSTAGRAM]: "Instagram 링크를 입력해주세요.",
    [ERROR_CODES.MISSION_NEED_WECHAT]: "WeChat ID를 입력해주세요.",
    [ERROR_CODES.MISSION_NEED_VISIT_DATE]: "방문 날짜와 시간을 입력해주세요.",
    [ERROR_CODES.NOT_ENOUGH_BALANCE]: "포인트가 충분하지 않습니다.",
    [ERROR_CODES.NEED_IMAGE]: "업로드할 이미지가 없습니다.",
    [ERROR_CODES.ADMIN_AUTH_NOT_MATCH_INFO]: "아이디나 비밀번호가 일치하지 않습니다.",
  },
  en: {
    [ERROR_CODES.NOT_MATCH_CODE]: "Verification code does not match.",
    [ERROR_CODES.EXPIRE_CODE]: "Verification code has expired.",
    [ERROR_CODES.DUPLICATED_EMAIL]: "This email is already registered.",
    [ERROR_CODES.NO_USER_BY_EMAIL]: "No account found with this email.",
    [ERROR_CODES.NOT_MATCH_LOGIN_INFO]: "Email or password does not match.",
    [ERROR_CODES.NEED_EMAIL]: "Please enter your email.",
    [ERROR_CODES.INVALID_EMAIL]: "Invalid email format.",
    [ERROR_CODES.NEED_PASSWORD]: "Please enter your password.",
    [ERROR_CODES.NEED_LINK]: "Please enter a link.",
    [ERROR_CODES.DUPLICATED_LINK]: "This link is already registered.",
    [ERROR_CODES.NEED_ACCOUNT]: "Please enter your account number.",
    [ERROR_CODES.NEED_DEPOSITOR]: "Please enter the account holder name.",
    [ERROR_CODES.NEED_TITLE]: "Profile name is required.",
    [ERROR_CODES.NEED_PROFILE_IMAGE]: "Profile image is required.",
    [ERROR_CODES.NEED_PROFILE_BACKGROUND_IMAGE]: "Profile background image is required.",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_TYPE]: "Profile design background type is required.",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_IMAGE]: "Profile design background image is required.",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_COLOR]: "Profile design background color is required.",
    [ERROR_CODES.NEED_DESIGN_BLOCK_BACKGROUND_COLOR]: "Profile design button background color is required.",
    [ERROR_CODES.NEED_DESIGN_BLOCK_TEXT_FONT]: "Profile design button font is required.",
    [ERROR_CODES.NEED_PROFILE_BUTTON_TEXT]: "Profile button text is required.",
    [ERROR_CODES.NEED_PROFILE_BUTTON_URL]: "Profile button link is required.",
    [ERROR_CODES.NEED_INQUIRY_BLOCK_ID]: "Block ID is required.",
    [ERROR_CODES.NEED_INQUIRY_CONTENTS]: "Please enter inquiry contents.",
    [ERROR_CODES.NEED_INQUIRY_NAME]: "Please enter your name.",
    [ERROR_CODES.NEED_INQUIRY_LINE_ID]: "Please enter your Line ID.",
    [ERROR_CODES.NEED_INQUIRY_TITLE]: "Block title is required.",
    [ERROR_CODES.NEED_BLOCK_LINK_LINK]: "Link block URL is required.",
    [ERROR_CODES.NEED_BLOCK_LINK_TITLE]: "Link block title is required.",
    [ERROR_CODES.NEED_BLOCK_LINK_LAYOUT]: "Link block layout is required.",
    [ERROR_CODES.NEED_BLOCK_LINK_IMAGE]: "Link block image is required.",
    [ERROR_CODES.NEED_BLOCK_TEXT_TITLE]: "Text block title is required.",
    [ERROR_CODES.NEED_BLOCK_TEXT_ALIGN]: "Text block alignment is required.",
    [ERROR_CODES.NEED_BLOCK_IMAGE_LIST]: "Image block image list is required.",
    [ERROR_CODES.NEED_BLOCK_IMAGE_LAYOUT]: "Image block layout is required.",
    [ERROR_CODES.NEED_BLOCK_VIDEO_URL]: "Video block URL is required.",
    [ERROR_CODES.NEED_BLOCK_DIVIDER_TYPE]: "Divider block type is required.",
    [ERROR_CODES.NEED_BLOCK_DIVIDER_MARGIN]: "Divider block margin is required.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_LIST]: "Calendar block schedule list is required.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_TITLE]: "Calendar block schedule title is required.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_START_DATE]: "Calendar block start date is required.",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_END_DATE]: "Calendar block end date is required.",
    [ERROR_CODES.NEED_BLOCK_MAP_ADDRESS]: "Map block address is required.",
    [ERROR_CODES.NEED_BLOCK_MAP_LATITUDE]: "Map block latitude is required.",
    [ERROR_CODES.NEED_BLOCK_MAP_LONGITUDE]: "Map block longitude is required.",
    [ERROR_CODES.NEED_BLOCK_SNS_LIST]: "SNS block list is required.",
    [ERROR_CODES.NEED_BLOCK_SNS_LINK]: "SNS block link is required.",
    [ERROR_CODES.NEED_BLOCK_SNS_TITLE]: "SNS block title is required.",
    [ERROR_CODES.NEED_BLOCK_SNS_LAYOUT]: "SNS block layout is required.",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_LIST]: "Inquiry block list is required.",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_FORM]: "Inquiry block form is required.",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_TITLE]: "Inquiry block title is required.",
    [ERROR_CODES.MISSION_ALREADY_ENROLLED]: "You have already applied for this mission.",
    [ERROR_CODES.MISSION_MAX_ENROLL_REACHED]: "Mission application limit has been reached.",
    [ERROR_CODES.MISSION_ALREADY_STARTED]: "This mission has not started yet.",
    [ERROR_CODES.MISSION_ALREADY_ENDED]: "This mission has ended.",
    [ERROR_CODES.MISSION_NEED_NAME]: "Please enter your name.",
    [ERROR_CODES.MISSION_NEED_SOCIAL]: "Please enter your social information.",
    [ERROR_CODES.MISSION_NEED_ADDRESS]: "Please enter your address.",
    [ERROR_CODES.MISSION_NEED_LINKS]: "Please enter content links.",
    [ERROR_CODES.MISSION_NOT_FOUND]: "Mission not found.",
    [ERROR_CODES.MISSION_CONTENT_PERIOD_EXPIRED]: "Content registration period has expired.",
    [ERROR_CODES.MISSION_CONTENT_PERIOD_NOT_STARTED]: "Content registration period has not started.",
    [ERROR_CODES.MISSION_NEED_INSTAGRAM]: "Please enter your Instagram link.",
    [ERROR_CODES.MISSION_NEED_WECHAT]: "Please enter your WeChat ID.",
    [ERROR_CODES.MISSION_NEED_VISIT_DATE]: "Please enter your visit date and time.",
    [ERROR_CODES.NOT_ENOUGH_BALANCE]: "Insufficient points balance.",
    [ERROR_CODES.NEED_IMAGE]: "No image to upload.",
    [ERROR_CODES.ADMIN_AUTH_NOT_MATCH_INFO]: "ID or password does not match.",
  },
  zh: {
    [ERROR_CODES.NOT_MATCH_CODE]: "验证码不匹配。",
    [ERROR_CODES.EXPIRE_CODE]: "验证码已过期。",
    [ERROR_CODES.DUPLICATED_EMAIL]: "该邮箱已被注册。",
    [ERROR_CODES.NO_USER_BY_EMAIL]: "该邮箱尚未注册。",
    [ERROR_CODES.NOT_MATCH_LOGIN_INFO]: "邮箱或密码不匹配。",
    [ERROR_CODES.NEED_EMAIL]: "请输入邮箱。",
    [ERROR_CODES.INVALID_EMAIL]: "邮箱格式不正确。",
    [ERROR_CODES.NEED_PASSWORD]: "请输入密码。",
    [ERROR_CODES.NEED_LINK]: "请输入链接。",
    [ERROR_CODES.DUPLICATED_LINK]: "该链接已被注册。",
    [ERROR_CODES.NEED_ACCOUNT]: "请输入账号。",
    [ERROR_CODES.NEED_DEPOSITOR]: "请输入存款人姓名。",
    [ERROR_CODES.NEED_TITLE]: "需要个人资料名称。",
    [ERROR_CODES.NEED_PROFILE_IMAGE]: "需要个人资料图片。",
    [ERROR_CODES.NEED_PROFILE_BACKGROUND_IMAGE]: "需要个人资料背景图片。",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_TYPE]: "需要个人资料设计背景类型。",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_IMAGE]: "需要个人资料设计背景图片。",
    [ERROR_CODES.NEED_DESIGN_BACKGROUND_COLOR]: "需要个人资料设计背景颜色。",
    [ERROR_CODES.NEED_DESIGN_BLOCK_BACKGROUND_COLOR]: "需要个人资料设计按钮背景颜色。",
    [ERROR_CODES.NEED_DESIGN_BLOCK_TEXT_FONT]: "需要个人资料设计按钮字体。",
    [ERROR_CODES.NEED_PROFILE_BUTTON_TEXT]: "需要个人资料按钮文字。",
    [ERROR_CODES.NEED_PROFILE_BUTTON_URL]: "需要个人资料按钮链接。",
    [ERROR_CODES.NEED_INQUIRY_BLOCK_ID]: "需要区块ID。",
    [ERROR_CODES.NEED_INQUIRY_CONTENTS]: "请输入咨询内容。",
    [ERROR_CODES.NEED_INQUIRY_NAME]: "请输入姓名。",
    [ERROR_CODES.NEED_INQUIRY_LINE_ID]: "请输入Line ID。",
    [ERROR_CODES.NEED_INQUIRY_TITLE]: "需要区块标题。",
    [ERROR_CODES.NEED_BLOCK_LINK_LINK]: "需要链接区块的链接。",
    [ERROR_CODES.NEED_BLOCK_LINK_TITLE]: "需要链接区块的标题。",
    [ERROR_CODES.NEED_BLOCK_LINK_LAYOUT]: "需要链接区块的布局。",
    [ERROR_CODES.NEED_BLOCK_LINK_IMAGE]: "需要链接区块的图片。",
    [ERROR_CODES.NEED_BLOCK_TEXT_TITLE]: "需要文本区块的标题。",
    [ERROR_CODES.NEED_BLOCK_TEXT_ALIGN]: "需要文本区块的对齐信息。",
    [ERROR_CODES.NEED_BLOCK_IMAGE_LIST]: "需要图片区块的图片列表。",
    [ERROR_CODES.NEED_BLOCK_IMAGE_LAYOUT]: "需要图片区块的布局。",
    [ERROR_CODES.NEED_BLOCK_VIDEO_URL]: "需要视频区块的URL。",
    [ERROR_CODES.NEED_BLOCK_DIVIDER_TYPE]: "需要分隔区块的类型。",
    [ERROR_CODES.NEED_BLOCK_DIVIDER_MARGIN]: "需要分隔区块的边距信息。",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_LIST]: "需要日历区块的日程列表。",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_TITLE]: "需要日历区块的日程标题。",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_START_DATE]: "需要日历区块的日程开始日期。",
    [ERROR_CODES.NEED_BLOCK_SCHEDULE_END_DATE]: "需要日历区块的日程结束日期。",
    [ERROR_CODES.NEED_BLOCK_MAP_ADDRESS]: "需要地图区块的地址。",
    [ERROR_CODES.NEED_BLOCK_MAP_LATITUDE]: "需要地图区块的纬度信息。",
    [ERROR_CODES.NEED_BLOCK_MAP_LONGITUDE]: "需要地图区块的经度信息。",
    [ERROR_CODES.NEED_BLOCK_SNS_LIST]: "需要SNS区块的SNS列表。",
    [ERROR_CODES.NEED_BLOCK_SNS_LINK]: "需要SNS区块的链接。",
    [ERROR_CODES.NEED_BLOCK_SNS_TITLE]: "需要SNS区块的标题。",
    [ERROR_CODES.NEED_BLOCK_SNS_LAYOUT]: "需要SNS区块的布局。",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_LIST]: "需要咨询区块的咨询列表。",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_FORM]: "需要咨询区块的咨询表单。",
    [ERROR_CODES.NEED_BLOCK_INQUIRY_TITLE]: "需要咨询区块的标题。",
    [ERROR_CODES.MISSION_ALREADY_ENROLLED]: "您已申请过此任务。",
    [ERROR_CODES.MISSION_MAX_ENROLL_REACHED]: "任务申请人数已达上限。",
    [ERROR_CODES.MISSION_ALREADY_STARTED]: "任务尚未开始。",
    [ERROR_CODES.MISSION_ALREADY_ENDED]: "任务已结束。",
    [ERROR_CODES.MISSION_NEED_NAME]: "请输入姓名。",
    [ERROR_CODES.MISSION_NEED_SOCIAL]: "请输入社交信息。",
    [ERROR_CODES.MISSION_NEED_ADDRESS]: "请输入地址。",
    [ERROR_CODES.MISSION_NEED_LINKS]: "请输入内容链接。",
    [ERROR_CODES.MISSION_NOT_FOUND]: "未找到任务。",
    [ERROR_CODES.MISSION_CONTENT_PERIOD_EXPIRED]: "内容注册期限已过。",
    [ERROR_CODES.MISSION_CONTENT_PERIOD_NOT_STARTED]: "内容注册期限尚未开始。",
    [ERROR_CODES.MISSION_NEED_INSTAGRAM]: "请输入Instagram链接。",
    [ERROR_CODES.MISSION_NEED_WECHAT]: "请输入微信ID。",
    [ERROR_CODES.MISSION_NEED_VISIT_DATE]: "请输入访问日期和时间。",
    [ERROR_CODES.NOT_ENOUGH_BALANCE]: "积分余额不足。",
    [ERROR_CODES.NEED_IMAGE]: "没有可上传的图片。",
    [ERROR_CODES.ADMIN_AUTH_NOT_MATCH_INFO]: "账号或密码不匹配。",
  },
};

/**
 * Get current locale from URL path
 */
function getCurrentLocale(): string {
  if (typeof window === "undefined") return "ko";
  const pathLocale = window.location.pathname.split("/")[1];
  return ["en", "zh", "ko"].includes(pathLocale) ? pathLocale : "ko";
}

/**
 * Translate error message by error code using current locale
 */
function translateErrorByCode(code: number): string | null {
  const locale = getCurrentLocale();
  const messages = ERROR_MESSAGES[locale] || ERROR_MESSAGES["ko"];
  return messages[code] || null;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cookie utilities
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number = 1): void {
  if (typeof document === "undefined") return;
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function removeCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Custom event for auth state changes
const AUTH_CHANGE_EVENT = "auth-state-change";

export function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function subscribeAuthChange(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// Token storage utilities (using cookies for middleware compatibility)
export const tokenStorage = {
  get: (): string | null => {
    return getCookie(TOKEN_COOKIE_NAME);
  },
  set: (token: string): void => {
    // Token expires in 5 hours (matching backend)
    setCookie(TOKEN_COOKIE_NAME, token, 5 / 24);
    dispatchAuthChange();
  },
  remove: (): void => {
    removeCookie(TOKEN_COOKIE_NAME);
    dispatchAuthChange();
  },
};

// Request interceptor - add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors and translate error messages
api.interceptors.response.use(
  (response) => {
    // Check for API-level errors (success: false with error object)
    if (response.data?.success === false && response.data?.error) {
      const apiError = response.data.error;

      // Translate error message by error code if available
      if (typeof apiError === "object" && apiError.code) {
        const translatedMsg = translateErrorByCode(apiError.code);
        if (translatedMsg) {
          response.data.error.msg = translatedMsg;
        }
      }

      // Create an error object that mimics axios error structure
      const error = new Error(
        typeof apiError === "object" ? apiError.msg : apiError
      ) as Error & { response: typeof response };
      error.response = response;
      return Promise.reject(error);
    }

    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      tokenStorage.remove();
      if (typeof window !== "undefined") {
        const locale = window.location.pathname.split("/")[1] || "en";
        window.location.href = `/${locale}/login`;
      }
    }

    // Translate error message by error code if available
    const apiError = error.response?.data?.error;
    if (apiError && typeof apiError === "object" && apiError.code) {
      const translatedMsg = translateErrorByCode(apiError.code);
      if (translatedMsg) {
        // Update the error message with translated version
        error.response.data.error.msg = translatedMsg;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
