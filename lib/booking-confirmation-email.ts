import { Resend } from "resend";

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type BookingEmailModule =
  | "guide"
  | "equipment"
  | "hotel"
  | "vehicle"
  | "trek_package"
  | "other";

const MODULE_TITLE: Record<BookingEmailModule, string> = {
  guide: "Guide booking",
  equipment: "Equipment rental",
  hotel: "Hotel booking",
  vehicle: "Car / vehicle rental",
  trek_package: "Trek & guide booking",
  other: "Booking request",
};

function buildHtml(params: {
  customerName: string;
  module: BookingEmailModule;
  intro: string;
  rows: { label: string; value: string }[];
}): string {
  const title = MODULE_TITLE[params.module];
  const rowsHtml = params.rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;color:#374151;width:40%;">${escapeHtml(r.label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827;">${escapeHtml(r.value)}</td></tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111827;background:#f9fafb;padding:24px;">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <tr><td style="background:#047857;color:#fff;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;">Booking received</h1>
      <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">${escapeHtml(title)}</p>
    </td></tr>
    <tr><td style="padding:24px;">
      <p style="margin:0 0 16px;">Hi ${escapeHtml(params.customerName)},</p>
      <p style="margin:0 0 20px;color:#4b5563;">${escapeHtml(params.intro)}</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${rowsHtml}</table>
      <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">If you did not make this request, you can ignore this email or contact us.</p>
      <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">— Technie Trek</p>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

/**
 * Sends a confirmation email to the address the user submitted on the booking form.
 * Requires RESEND_API_KEY. If missing, logs and returns (booking still succeeds).
 * Set RESEND_FROM_EMAIL to a verified sender, e.g. "Bookings <bookings@yourdomain.com>".
 */
export async function sendBookingConfirmationEmail(params: {
  to: string;
  module: BookingEmailModule;
  customerName: string;
  intro: string;
  rows: { label: string; value: string }[];
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[booking-email] RESEND_API_KEY is not set; skipping confirmation email to", params.to);
    return { ok: false, skipped: true };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Technie Trek <onboarding@resend.dev>";

  const subject = `${MODULE_TITLE[params.module]} — we received your request`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: [params.to.trim().toLowerCase()],
      subject,
      html: buildHtml(params),
    });
    if (error) {
      console.error("[booking-email] Resend error:", error);
      return { ok: false, error: error.message };
    }
    if (!data?.id) {
      console.warn("[booking-email] Resend returned no id", data);
    }
    return { ok: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[booking-email] Failed to send:", message);
    return { ok: false, error: message };
  }
}

const defaultIntro =
  "Thank you for your request. We have received your details and will review availability. You will hear from us shortly.";

/** Fire-and-forget: does not reject; logs errors. */
export function queueUnifiedBookingConfirmation(
  booking: {
    email: string;
    name: string;
    bookingType: string;
    totalPrice?: number;
    bookingDetails?: Record<string, unknown>;
    cartItems?: Array<Record<string, unknown>>;
    message?: string;
    date?: string;
  }
): void {
  const to = booking.email;
  const customerName = booking.name;
  const bd = booking.bookingDetails || {};
  const total = Number(booking.totalPrice ?? 0);

  const run = async () => {
    switch (booking.bookingType) {
      case "guide": {
        const trekName = bd.trekName ? String(bd.trekName) : "";
        const module: BookingEmailModule = trekName ? "trek_package" : "guide";
        await sendBookingConfirmationEmail({
          to,
          module,
          customerName,
          intro: defaultIntro,
          rows: [
            { label: "Guide", value: String(bd.guideName || "—") },
            { label: "Trek package", value: trekName || "Not specified" },
            { label: "Start date", value: String(bd.startDate || "—") },
            { label: "Group size", value: String(bd.groupSize || "—") },
            { label: "Country", value: String(bd.country || "—") },
            { label: "Estimated total", value: `$${total}` },
            { label: "Status", value: "Pending" },
          ],
        });
        break;
      }
      case "equipment": {
        const items = booking.cartItems || [];
        const itemLines =
          items.length > 0
            ? items
                .map((i) => `${Number(i.quantity) || 1}× ${String(i.name || "Item")}`)
                .join(" · ")
            : "—";
        await sendBookingConfirmationEmail({
          to,
          module: "equipment",
          customerName,
          intro: defaultIntro,
          rows: [
            { label: "Rental items", value: itemLines },
            { label: "Estimated total", value: `$${total}` },
            { label: "Status", value: "Pending" },
          ],
        });
        break;
      }
      case "hotel": {
        await sendBookingConfirmationEmail({
          to,
          module: "hotel",
          customerName,
          intro: defaultIntro,
          rows: [
            { label: "Check-in", value: String(bd.checkIn || "—") },
            { label: "Check-out", value: String(bd.checkOut || "—") },
            { label: "Hotel", value: String(bd.hotelName || bd.hotelId || "—") },
            { label: "Estimated total", value: `$${total}` },
            { label: "Status", value: "Pending" },
          ],
        });
        break;
      }
      case "car": {
        await sendBookingConfirmationEmail({
          to,
          module: "vehicle",
          customerName,
          intro: defaultIntro,
          rows: [
            { label: "Pickup date", value: String(bd.pickupDate || "—") },
            { label: "Pickup location", value: String(bd.pickupLocation || "—") },
            { label: "Estimated total", value: `$${total}` },
            { label: "Status", value: "Pending" },
          ],
        });
        break;
      }
      default: {
        await sendBookingConfirmationEmail({
          to,
          module: "other",
          customerName,
          intro: defaultIntro,
          rows: [
            { label: "Date", value: String(booking.date || bd.startDate || "—") },
            { label: "Notes", value: String(booking.message || "—") },
            { label: "Estimated total", value: `$${total}` },
            { label: "Status", value: "Pending" },
          ],
        });
      }
    }
  };

  void run().catch((e) => console.error("[booking-email] queueUnifiedBookingConfirmation:", e));
}

export function queueRentalEquipmentConfirmation(params: {
  to: string;
  customerName: string;
  startDate: string;
  endDate: string;
  deliveryLocation: string;
  totalPrice: number;
  itemSummary: string;
}): void {
  void sendBookingConfirmationEmail({
    to: params.to,
    module: "equipment",
    customerName: params.customerName,
    intro: defaultIntro,
    rows: [
      { label: "Rental period", value: `${params.startDate} → ${params.endDate}` },
      { label: "Delivery", value: params.deliveryLocation },
      { label: "Items", value: params.itemSummary },
      { label: "Estimated total", value: `$${Number(params.totalPrice)}` },
      { label: "Status", value: "Pending" },
    ],
  }).catch((e) => console.error("[booking-email] queueRentalEquipmentConfirmation:", e));
}

export function queueHotelBookingConfirmation(params: {
  to: string;
  customerName: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}): void {
  void sendBookingConfirmationEmail({
    to: params.to,
    module: "hotel",
    customerName: params.customerName,
    intro: defaultIntro,
    rows: [
      { label: "Hotel", value: params.hotelName },
      { label: "Room", value: params.roomType },
      { label: "Check-in", value: params.checkIn },
      { label: "Check-out", value: params.checkOut },
      { label: "Total", value: `$${Number(params.totalPrice)}` },
      { label: "Status", value: "Pending" },
    ],
  }).catch((e) => console.error("[booking-email] queueHotelBookingConfirmation:", e));
}

export function queueVehicleBookingConfirmation(params: {
  to: string;
  customerName: string;
  vehicleName: string;
  pickupLocation: string;
  dropOffLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}): void {
  void sendBookingConfirmationEmail({
    to: params.to,
    module: "vehicle",
    customerName: params.customerName,
    intro: defaultIntro,
    rows: [
      { label: "Vehicle", value: params.vehicleName },
      { label: "Pickup", value: params.pickupLocation },
      { label: "Drop-off", value: params.dropOffLocation },
      { label: "Start", value: params.startDate },
      { label: "End", value: params.endDate },
      { label: "Estimated total", value: `$${Number(params.totalPrice)}` },
      { label: "Status", value: "Pending" },
    ],
  }).catch((e) => console.error("[booking-email] queueVehicleBookingConfirmation:", e));
}
