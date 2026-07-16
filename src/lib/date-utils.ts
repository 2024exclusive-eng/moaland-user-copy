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

/**
 * Visit date/time is a timezone-naive "wall clock" the user picked — it must be
 * shown exactly as chosen, regardless of the viewer's timezone. It is stored as a
 * wall-clock string and read back as a UTC instant (DB pool runs in UTC), so its
 * literal parts are the UTC components.
 *
 * Format a picked local Date into the naive "YYYY-MM-DD HH:mm:ss" string to SEND.
 */
export function toWallClockString(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(
    date.getDate()
  )} ${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

/**
 * Parse a stored visit datetime back into its literal wall-clock parts (no
 * timezone shift). Returns a local Date whose local components equal the picked
 * time, so existing `.getHours()`/`toLocaleTimeString()` formatting stays correct.
 */
export function parseWallClock(dateString: string): Date {
  const d = new Date(dateString);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  );
}
