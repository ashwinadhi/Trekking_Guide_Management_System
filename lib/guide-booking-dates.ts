import { Guide } from "@/models/Guide";
import { guideBookingOccupiedDates, parseDurationDays } from "./booking-pricing";

/** Remove guide calendar blocks when a guide booking is rejected/cancelled. */
export async function releaseGuideBookingDates(bookingDetails: Record<string, unknown> | undefined): Promise<void> {
  if (!bookingDetails) return;

  const guideId = bookingDetails.guide;
  const startDate = bookingDetails.startDate ? String(bookingDetails.startDate) : "";
  if (!guideId || !startDate) return;

  const durationDays = parseDurationDays(
    bookingDetails.duration != null ? String(bookingDetails.duration) : undefined
  );
  const occupied = new Set(guideBookingOccupiedDates(startDate, durationDays));

  const guide = await Guide.findById(String(guideId));
  if (!guide) return;

  guide.bookedDates = (guide.bookedDates || []).filter((d) => !occupied.has(d));
  await guide.save();
}
