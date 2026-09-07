/**
 * Shared booking pricing and validation helpers.
 * All totals must be calculated server-side — never trust client values.
 */

export function rentalDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new Error("Invalid date format");
  }
  if (end < start) {
    throw new Error("End date must be on or after start date");
  }
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

export function parseDurationDays(duration: string | undefined | null): number {
  const parsed = parseInt(String(duration || "1").replace(/\D/g, "") || "1", 10);
  return Math.max(1, parsed);
}

export function calculateGuideBookingTotal(params: {
  guideDailyRate: number;
  trekPrice?: number;
  groupSize?: number | string;
  durationDays?: number;
}): number {
  const groupSize = Math.max(1, parseInt(String(params.groupSize || "1"), 10) || 1);
  const durationDays = Math.max(1, params.durationDays ?? 1);
  let total = params.guideDailyRate * durationDays;
  if (params.trekPrice != null && params.trekPrice > 0) {
    total += params.trekPrice * groupSize;
  }
  return Math.round(total * 100) / 100;
}

export function datesOverlap(
  startA: string | Date,
  endA: string | Date,
  startB: string | Date,
  endB: string | Date
): boolean {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();
  return aStart <= bEnd && aEnd >= bStart;
}

export function dateRangeIncludesBlocked(
  checkIn: string,
  checkOut: string,
  blockedDates: (string | Date)[]
): boolean {
  const checkInTime = new Date(checkIn).getTime();
  const checkOutTime = new Date(checkOut).getTime();
  for (const dateStr of blockedDates) {
    const blocked = new Date(dateStr).getTime();
    if (blocked >= checkInTime && blocked < checkOutTime) {
      return true;
    }
  }
  return false;
}

function parseYmd(dateStr: string): { y: number; m: number; d: number } {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return { y, m, d };
}

/** Last calendar day of a guide assignment (inclusive). 14-day trek → start + 13 days. */
export function computeGuideBookingEndDate(startDate: string, durationDays: number): string {
  const days = Math.max(1, durationDays);
  const { y, m, d } = parseYmd(startDate);
  const end = new Date(Date.UTC(y, m - 1, d + days - 1));
  return end.toISOString().slice(0, 10);
}

export function expandDateRange(startDate: string, endDate?: string): string[] {
  const start = parseYmd(startDate);
  const end = endDate ? parseYmd(endDate) : start;
  const dates: string[] = [];
  const cursor = Date.UTC(start.y, start.m - 1, start.d);
  const endTime = Date.UTC(end.y, end.m - 1, end.d);
  for (let t = cursor; t <= endTime; t += 86400000) {
    dates.push(new Date(t).toISOString().slice(0, 10));
  }
  return dates;
}

/** All dates a guide is occupied for a booking starting on startDate for durationDays. */
export function guideBookingOccupiedDates(startDate: string, durationDays: number): string[] {
  const endDate = computeGuideBookingEndDate(startDate, durationDays);
  return expandDateRange(startDate, endDate);
}

export function rangeConflictsWithBookedDates(
  bookedDates: string[] | undefined,
  startDate: string,
  durationDays: number
): boolean {
  const booked = new Set(bookedDates || []);
  return guideBookingOccupiedDates(startDate, durationDays).some((d) => booked.has(d));
}

const DEDUP_WINDOW_MS = 2 * 60 * 1000;

export function isWithinDedupWindow(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < DEDUP_WINDOW_MS;
}

export { DEDUP_WINDOW_MS };
