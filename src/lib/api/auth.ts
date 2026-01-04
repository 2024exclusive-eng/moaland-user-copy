import api from "@/lib/axios";

// Types
export interface UserInfo {
  id: number;
  email: string;
  link: string | null;
}

export interface AuthResponse {
  success: boolean;
  userInfo?: UserInfo;
  accessToken?: string;
  error?: ApiErrorDetail | string;
}

export interface VerifyEmailResponse {
  success: boolean;
  verify: string;
}

export interface ApiErrorDetail {
  code?: number;
  msg?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  error?: ApiErrorDetail | string;
}

export interface ApiError {
  success: false;
  error: ApiErrorDetail | string;
}

// API Functions

/**
 * Step 1 of registration: Send verification code to email
 */
export async function sendVerificationCode(
  email: string
): Promise<VerifyEmailResponse> {
  const response = await api.post<VerifyEmailResponse>(
    "/user/auth/email/verify",
    { email }
  );
  return response.data;
}

/**
 * Step 2 of registration (optional): Verify the code
 */
export async function verifyCode(
  email: string,
  verify: string,
  code: string
): Promise<VerifyCodeResponse> {
  const response = await api.post<VerifyCodeResponse>(
    "/user/auth/email/verify/check",
    { email, verify, code }
  );
  return response.data;
}

/**
 * Step 3 of registration: Complete registration
 */
export async function register(
  email: string,
  password: string,
  verify: string,
  code: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/user/auth/join/email", {
    email,
    password,
    verify,
    code,
  });
  return response.data;
}

/**
 * Login with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/user/auth/login/email", {
    email,
    password,
  });
  return response.data;
}

/**
 * Logout - clear the session
 */
export async function logout(): Promise<void> {
  // Clear token from cookie via API or client-side
  // If your backend has a logout endpoint, call it here
  // For now, we'll handle it client-side by redirecting
  if (typeof window !== "undefined") {
    const locale = window.location.pathname.split("/")[1] || "en";
    window.location.href = `/${locale}/login`;
  }
}

export interface ChangePasswordResponse {
  success: boolean;
  error?: ApiErrorDetail | string;
}

/**
 * Change password
 */
export async function changePassword(
  password: string
): Promise<ChangePasswordResponse> {
  const response = await api.put<ChangePasswordResponse>(
    "/user/auth/changepw",
    { password }
  );
  return response.data;
}

// Forgot Password API Functions

export interface ForgotPasswordVerifyResponse {
  success: boolean;
  verify?: string;
  error?: ApiErrorDetail | string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  error?: ApiErrorDetail | string;
}

/**
 * Step 1 of forgot password: Send verification code to email
 */
export async function sendForgotPasswordCode(
  email: string
): Promise<ForgotPasswordVerifyResponse> {
  const response = await api.post<ForgotPasswordVerifyResponse>(
    "/user/auth/findpw/email/verify",
    { email }
  );
  return response.data;
}

/**
 * Step 2 of forgot password: Verify the code
 */
export async function verifyForgotPasswordCode(
  email: string,
  verify: string,
  code: string
): Promise<ForgotPasswordResponse> {
  const response = await api.post<ForgotPasswordResponse>(
    "/user/auth/findpw/email/verify/check",
    { email, verify, code }
  );
  return response.data;
}

/**
 * Step 3 of forgot password: Reset password
 */
export async function resetPassword(
  email: string,
  verify: string,
  code: string,
  password: string
): Promise<ForgotPasswordResponse> {
  const response = await api.put<ForgotPasswordResponse>(
    "/user/auth/findpw",
    { email, verify, code, password }
  );
  return response.data;
}

export interface SecessionResponse {
  success: boolean;
  error?: ApiErrorDetail | string;
}

/**
 * Delete user account (secession/withdrawal)
 */
export async function deleteAccount(): Promise<SecessionResponse> {
  const response = await api.delete<SecessionResponse>("/user/auth/secession");
  return response.data;
}
