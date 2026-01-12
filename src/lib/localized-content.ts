/**
 * Helper function to get localized content based on current locale.
 * Falls back to Korean content if localized content is not available.
 *
 * @param koContent - Korean content (always available)
 * @param cnContent - Chinese content (nullable)
 * @param locale - Current locale ('ko', 'zh', 'en')
 * @param enContent - English content (nullable, optional)
 * @returns The appropriate content based on locale
 */
export function getLocalizedContent(
  koContent: string,
  cnContent: string | null | undefined,
  locale: string,
  enContent?: string | null | undefined
): string {
  // For Chinese locale, use Chinese content if available, otherwise fallback to Korean
  if (locale === "zh" && cnContent) {
    return cnContent;
  }
  // For English locale, use English content if available, otherwise fallback to Korean
  if (locale === "en" && enContent) {
    return enContent;
  }
  // For all other locales (ko, etc.), use Korean content
  return koContent;
}

/**
 * Hook-friendly helper to create a localized content getter function.
 *
 * @param locale - Current locale
 * @returns A function that takes Korean and Chinese content and returns the appropriate one
 */
export function createLocalizedContentGetter(locale: string) {
  return (koContent: string, cnContent: string | null | undefined): string => {
    return getLocalizedContent(koContent, cnContent, locale);
  };
}
