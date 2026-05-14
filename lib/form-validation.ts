/**
 * Shared validation for public forms (client + API routes).
 * Rules: email format, phone exactly 10 digits, full name letters + spaces only (Unicode letters).
 */

function isValidEmailBasic(value: string): boolean {
  const s = value.trim();
  if (!s || /\s/.test(s) || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Unicode letters and single spaces between words; no digits or punctuation. */
const FULL_NAME_RE = /^[\p{L}]+(?:\s[\p{L}]+)*$/u;

/** Subject: letters, numbers, common punctuation, spaces. */
const SUBJECT_RE = /^[\p{L}\p{N}\s.,'"\-?!:;()]+$/u;

/** Address / location lines (hotel delivery, etc.). */
const ADDRESS_RE = /^[\p{L}\p{N}\s.,'/#()\-]+$/u;

export function isValidEmail(value: string): boolean {
  return isValidEmailBasic(value);
}

/** Keep only digits, cap length (default 10 for local mobile). */
export function normalizePhoneDigits(value: string, maxLen = 10): string {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

export function isTenDigitPhone(value: string): boolean {
  return /^\d{10}$/.test(value.trim());
}

export function isFullNameNoSpecial(value: string): boolean {
  const s = value.trim();
  if (s.length < 2 || s.length > 100) return false;
  return FULL_NAME_RE.test(s);
}

export function sanitizeFullNameInput(value: string, maxLen = 100): string {
  const s = value.replace(/[^\p{L}\s]/gu, "").replace(/\s+/g, " ");
  return s.slice(0, maxLen);
}

export function isCountryName(value: string): boolean {
  return isFullNameNoSpecial(value);
}

export function sanitizeCountryInput(value: string, maxLen = 80): string {
  return sanitizeFullNameInput(value, maxLen);
}

export function isAddressText(value: string, minLen = 5, maxLen = 500): boolean {
  const s = value.trim();
  if (s.length < minLen || s.length > maxLen) return false;
  return ADDRESS_RE.test(s);
}

export function isSubjectLine(value: string, minLen = 3, maxLen = 200): boolean {
  const s = value.trim();
  if (s.length < minLen || s.length > maxLen) return false;
  return SUBJECT_RE.test(s);
}

export function isMessageBody(value: string, minLen = 10, maxLen = 5000): boolean {
  const s = value.trim();
  return s.length >= minLen && s.length <= maxLen;
}

export function isReviewDescription(value: string, minLen = 20, maxLen = 4000): boolean {
  const s = value.trim();
  return s.length >= minLen && s.length <= maxLen;
}

export function isSpecialRequestsText(value: string, minLen = 5, maxLen = 2000): boolean {
  const s = value.trim();
  return s.length >= minLen && s.length <= maxLen;
}
