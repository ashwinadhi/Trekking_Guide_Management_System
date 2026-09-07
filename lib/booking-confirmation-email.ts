import { sendSmtpEmail } from "./mail";
import { BRAND_NAME } from "./brand";
import { buildNotificationHtml } from "./email-html";

export type BookingEmailModule =
  | "guide"
  | "equipment"
  | "hotel"
  | "vehicle"
  | "helicopter"
  | "trek_package"
  | "other";

const MODULE_TITLE: Record<BookingEmailModule, string> = {
  guide: "Guide booking",
  equipment: "Equipment rental",
  hotel: "Hotel booking",
  vehicle: "Car / vehicle rental",
  helicopter: "Helicopter charter",
  trek_package: "Trek & guide booking",
  other: "Booking request",
};

function buildHtml(params: {
  customerName: string;
  module: BookingEmailModule;
  intro: string;
  rows: { label: string; value: string }[];
}): string {
  return buildNotificationHtml({
    heading: "Booking received",
    subtitle: MODULE_TITLE[params.module],
    greeting: `Hi ${params.customerName},`,
    intro: params.intro,
    rows: params.rows,
    footer: `If you did not make this request, you can ignore this email or contact us. — ${BRAND_NAME}`,
  });
}

/**
 * Sends a confirmation email via SMTP (Gmail, Outlook, etc.).
 * Requires SMTP_USER and SMTP_PASS in `.env.local`. Booking still succeeds if email is skipped.
 */
export async function sendBookingConfirmationEmail(params: {
  to: string;
  module: BookingEmailModule;
  customerName: string;
  intro: string;
  rows: { label: string; value: string }[];
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const subject = `${MODULE_TITLE[params.module]} — we received your request`;

  return sendSmtpEmail({
    to: params.to,
    subject,
    html: buildHtml(params),
  });
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
            { label: "End date", value: String(bd.endDate || "—") },
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

export function queueHelicopterBookingConfirmation(params: {
  to: string;
  customerName: string;
  helicopterName: string;
  departureHelipad: string;
  landingHelipad: string;
  startDate: string;
  endDate: string;
  passengers: number;
  totalPrice: number;
}): void {
  void sendBookingConfirmationEmail({
    to: params.to,
    module: "helicopter",
    customerName: params.customerName,
    intro: defaultIntro,
    rows: [
      { label: "Aircraft", value: params.helicopterName },
      { label: "Departure", value: params.departureHelipad },
      { label: "Landing", value: params.landingHelipad },
      { label: "Passengers", value: String(params.passengers) },
      { label: "Start", value: params.startDate },
      { label: "End", value: params.endDate },
      { label: "Estimated total", value: `$${Number(params.totalPrice)}` },
      { label: "Status", value: "Pending" },
    ],
  }).catch((e) => console.error("[booking-email] queueHelicopterBookingConfirmation:", e));
}
