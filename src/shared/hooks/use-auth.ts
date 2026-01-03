"use client";

import { useCallback, useState } from "react";

import {
  type AuthResponse,
  login as loginApi,
  register as registerApi,
  resetPassword as resetPasswordApi,
  sendForgotPasswordCode as sendForgotPasswordCodeApi,
  sendVerificationCode as sendVerificationCodeApi,
  type UserInfo,
  verifyCode as verifyCodeApi,
  verifyForgotPasswordCode as verifyForgotPasswordCodeApi,
} from "@/lib/api/auth";
import { tokenStorage } from "@/lib/axios";

interface ApiErrorResponse {
  response?: {
    data?: {
      error?: {
        code?: number;
        msg?: string;
      } | string;
    };
  };
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const apiError = err as ApiErrorResponse;
  const errorData = apiError?.response?.data?.error;
  if (typeof errorData === "object" && errorData?.msg) {
    return errorData.msg;
  }
  if (typeof errorData === "string") {
    return errorData;
  }
  return fallback;
}

interface UseAuthReturn {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    email: string,
    password: string,
    verify: string,
    code: string
  ) => Promise<AuthResponse>;
  sendVerificationCode: (email: string) => Promise<{ verify: string }>;
  verifyCode: (
    email: string,
    verify: string,
    code: string
  ) => Promise<boolean>;
  // Forgot password methods
  sendForgotPasswordCode: (email: string) => Promise<{ verify: string }>;
  verifyForgotPasswordCode: (
    email: string,
    verify: string,
    code: string
  ) => Promise<boolean>;
  resetPassword: (
    email: string,
    verify: string,
    code: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginApi(email, password);
      if (response.success && response.accessToken && response.userInfo) {
        tokenStorage.set(response.accessToken);
        setUser(response.userInfo);
      } else if (!response.success && response.error) {
        const errorMsg =
          typeof response.error === "object"
            ? response.error.msg
            : response.error;
        setError(errorMsg || "Login failed");
        return response;
      }
      return response;
    } catch (err) {
      setError(extractErrorMessage(err, "Login failed"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, verify: string, code: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await registerApi(email, password, verify, code);
        if (response.success && response.accessToken && response.userInfo) {
          tokenStorage.set(response.accessToken);
          setUser(response.userInfo);
        } else if (!response.success && response.error) {
          const errorMsg =
            typeof response.error === "object"
              ? response.error.msg
              : response.error;
          setError(errorMsg || "Registration failed");
          return response;
        }
        return response;
      } catch (err) {
        setError(extractErrorMessage(err, "Registration failed"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const sendVerificationCode = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sendVerificationCodeApi(email);
      return { verify: response.verify };
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to send verification code"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCode = useCallback(
    async (email: string, verify: string, code: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await verifyCodeApi(email, verify, code);
        if (!response.success && response.error) {
          const errorMsg =
            typeof response.error === "object"
              ? response.error.msg
              : response.error;
          setError(errorMsg || "Verification failed");
          return false;
        }
        return response.success;
      } catch (err) {
        setError(extractErrorMessage(err, "Verification failed"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    tokenStorage.remove();
    setUser(null);
  }, []);

  // Forgot Password Methods
  const sendForgotPasswordCode = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sendForgotPasswordCodeApi(email);
      if (!response.success || !response.verify) {
        const errorMsg =
          typeof response.error === "object"
            ? response.error.msg
            : response.error;
        setError(errorMsg || "Failed to send verification code");
        throw new Error(errorMsg || "Failed to send verification code");
      }
      return { verify: response.verify };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to send verification code");
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyForgotPasswordCode = useCallback(
    async (email: string, verify: string, code: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await verifyForgotPasswordCodeApi(email, verify, code);
        if (!response.success && response.error) {
          const errorMsg =
            typeof response.error === "object"
              ? response.error.msg
              : response.error;
          setError(errorMsg || "Verification failed");
          return false;
        }
        return response.success;
      } catch (err) {
        setError(extractErrorMessage(err, "Verification failed"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string, verify: string, code: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await resetPasswordApi(email, verify, code, password);
        if (!response.success && response.error) {
          const errorMsg =
            typeof response.error === "object"
              ? response.error.msg
              : response.error;
          setError(errorMsg || "Password reset failed");
          return false;
        }
        return response.success;
      } catch (err) {
        setError(extractErrorMessage(err, "Password reset failed"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    user,
    isLoading,
    error,
    login,
    register,
    sendVerificationCode,
    verifyCode,
    sendForgotPasswordCode,
    verifyForgotPasswordCode,
    resetPassword,
    logout,
    clearError,
  };
}
