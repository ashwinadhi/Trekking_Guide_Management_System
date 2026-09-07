/**
 * Customer emails when admin approves or rejects a booking.
 */
import { sendSmtpEmail } from "./mail";
import { BRAND_NAME } from "./brand";
import { emailBrandHeader, escapeHtml } from "./email-html";
import type { BookingEmailModule } from "./booking-confirmation-email";

export type BookingDecision = "confirmed" | "cancelled";

const MODULE_TITLE: Record<BookingEmailModule, string> = {
  guide: "Guide booking",
  equipment: "Equipment rental",
  hotel: "Hotel booking",
  vehicle: "Car / vehicle rental",
  helicopter: "Helicopter charter",
  trek_package: "Trek & guide booking",
  other: "Booking request",
};

function buildDecisionHtml(params: {
  decision: BookingDecision;
  module: BookingEmailModule;
  customerName: string;
  intro: string;
  rows: { label: string; value: string }[];
}): string {
  const isApproved = params.decision === "confirmed";
  const heading = isApproved ? "Booking confirmed" : "Booking update";
  const title = MODULE_TITLE[params.module];

  const rowsHtml = params.rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;color:#374151;width:40%;">${escapeHtml(r.label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827;">${escapeHtml(r.value)}</td></tr>`
    )
    .join("");

  const footer = isApproved
    ? "We look forward to hosting you. Contact us if you have any questions."
    : "If you have questions or would like to rebook, please reply to this email or visit our website.";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111827;background:#f9fafb;padding:24px;">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    ${emailBrandHeader(heading, title)}
    <tr><td style="padding:24px;">
      <p style="margin:0 0 16px;">Hi ${escapeHtml(params.customerName)},</p>
      <p style="margin:0 0 20px;color:#4b5563;">${escapeHtml(params.intro)}</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${rowsHtml}</table>
      <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">${escapeHtml(footer)}</p>
      <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">— ${escapeHtml(BRAND_NAME)}</p>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export function shouldNotifyCustomerOnStatusChange(
  previousStatus: string,
  newStatus: string,
  notifyCustomer?: boolean
): boolean {
  if (!notifyCustomer) return false;
  if (previousStatus !== "pending") return false;
  return newStatus === "confirmed" || newStatus === "cancelled";
}

export function queueBookingDecisionEmail(params: {
  to: string;
  customerName: string;
  decision: BookingDecision;
  module: BookingEmailModule;
  rows: { label: string; value: string }[];
}): void {
  const isApproved = params.decision === "confirmed";
  const intro = isApproved
    ? "Good news — your booking request has been reviewed and confirmed by our team."
    : "Thank you for your interest. After reviewing your request, we are unable to confirm this booking at this time.";

  const subject = isApproved
    ? `Your ${MODULE_TITLE[params.module].toLowerCase()} is confirmed — ${BRAND_NAME}`
    : `Update on your ${MODULE_TITLE[params.module].toLowerCase()} — ${BRAND_NAME}`;

  const statusLabel = isApproved ? "Confirmed" : "Not approved";

  void sendSmtpEmail({
    to: params.to,
    subject,
    html: buildDecisionHtml({
      decision: params.decision,
      module: params.module,
      customerName: params.customerName,
      intro,
      rows: [...params.rows, { label: "Status", value: statusLabel }],
    }),
  }).catch((e) => console.error("[booking-status-email]", e));
}
