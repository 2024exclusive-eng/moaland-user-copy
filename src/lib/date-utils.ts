/**
 * Date utilities with Korean timezone (Asia/Seoul) support
 */

const KOREA_TIMEZONE = "Asia/Seoul";

/**
 * Get current date/time in Korean timezone
 */
export function getKoreaTime(): Date {
  const now = new Date();
  const koreaTimeString = now.toLocaleString("en-US", {
    timeZone: KOREA_TIMEZONE,
  });
  return new Date(koreaTimeString);
}

/**
 * Convert a date string to Korean timezone
 */
export function toKoreaTime(dateString: string): Date {
  const date = new Date(dateString);
  const koreaTimeString = date.toLocaleString("en-US", {
    timeZone: KOREA_TIMEZONE,
  });
  return new Date(koreaTimeString);
}

/**
 * Set time to end of day in Korean timezone
 */
export function setKoreaEndOfDay(date: Date): Date {
  const dateInKorea = new Date(
    date.toLocaleString("en-US", { timeZone: KOREA_TIMEZONE })
  );
  dateInKorea.setHours(23, 59, 59, 999);
  return dateInKorea;
}

/**
 * Set time to start of day in Korean timezone
 */
export function setKoreaStartOfDay(date: Date): Date {
  const dateInKorea = new Date(
    date.toLocaleString("en-US", { timeZone: KOREA_TIMEZONE })
  );
  dateInKorea.setHours(0, 0, 0, 0);
  return dateInKorea;
}

/**
 * Get start of today in Korean timezone
 */
export function getKoreaTodayStart(): Date {
  return setKoreaStartOfDay(getKoreaTime());
}

/**
 * Calculate days remaining until a date, using Korean timezone
 */
export function calculateDaysRemainingKST(enrollEndDate: string): number {
  const endDate = toKoreaTime(enrollEndDate);
  const now = getKoreaTime();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display in MM.DD format
 */
export function formatDateMMDD(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

/**
 * Format date range for display in MM.DD~MM.DD format
 */
export function formatDateRangeMMDD(startDate: string, endDate: string): string {
  const start = toKoreaTime(startDate);
  const end = toKoreaTime(endDate);
  return `${formatDateMMDD(start)}~${formatDateMMDD(end)}`;
}
