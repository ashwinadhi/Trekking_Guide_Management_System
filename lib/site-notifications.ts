/**
 * Site-wide SMTP notifications: contact form, reviews, and admin alerts.
 */
import { sendSmtpEmail } from "./mail";
import { buildNotificationHtml } from "./email-html";
import { serverEnv } from "./env";

function notifyAdmin(): string | undefined {
  return serverEnv.adminNotifyEmail;
}

/** Customer confirmation + admin alert when someone submits the contact form. */
export function queueContactInquiryEmails(params: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): void {
  const run = async () => {
    await sendSmtpEmail({
      to: params.email,
      subject: "We received your message — Nirvana Luxury Adventure",
      html: buildNotificationHtml({
        heading: "Message received",
        subtitle: "Contact inquiry",
        greeting: `Hi ${params.name},`,
        intro:
          "Thank you for reaching out. We have received your message and will get back to you as soon as possible.",
        rows: [
          { label: "Subject", value: params.subject },
          { label: "Your message", value: params.message },
        ],
      }),
    });

    const adminEmail = notifyAdmin();
    if (!adminEmail) return;

    await sendSmtpEmail({
      to: adminEmail,
      replyTo: params.email,
      subject: `[Contact] ${params.subject}`,
      html: buildNotificationHtml({
        heading: "New contact inquiry",
        intro: "A visitor submitted the contact form on your website.",
        rows: [
          { label: "Name", value: params.name },
          { label: "Email", value: params.email },
          { label: "Phone", value: params.phone },
          { label: "Subject", value: params.subject },
          { label: "Message", value: params.message },
        ],
        footer: "Reply directly to this email to respond to the customer.",
      }),
    });
  };

  void run().catch((e) => console.error("[site-email] queueContactInquiryEmails:", e));
}

/** Admin alert when a new public review is submitted. */
export function queueNewReviewAdminEmail(params: {
  userName: string;
  rating: number;
  slug: string;
  description: string;
}): void {
  const adminEmail = notifyAdmin();
  if (!adminEmail) return;

  void sendSmtpEmail({
    to: adminEmail,
    subject: `[Review] ${params.rating}★ from ${params.userName}`,
    html: buildNotificationHtml({
      heading: "New customer review",
      intro: "A new review was submitted on your website.",
      rows: [
        { label: "Reviewer", value: params.userName },
        { label: "Rating", value: `${params.rating} / 5` },
        { label: "Trek / topic", value: params.slug },
        { label: "Review", value: params.description },
      ],
      footer: "View and manage reviews in the admin panel.",
    }),
  }).catch((e) => console.error("[site-email] queueNewReviewAdminEmail:", e));
}

/** Admin alert for any new booking request (guide, hotel, rental, vehicle). */
export function queueAdminBookingAlert(params: {
  type: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalPrice?: number;
  summary: { label: string; value: string }[];
}): void {
  const adminEmail = notifyAdmin();
  if (!adminEmail) return;

  const rows = [
    { label: "Customer", value: params.customerName },
    { label: "Email", value: params.customerEmail },
  ];
  if (params.customerPhone) {
    rows.push({ label: "Phone", value: params.customerPhone });
  }
  if (params.totalPrice != null) {
    rows.push({ label: "Total", value: `$${params.totalPrice}` });
  }
  rows.push(...params.summary);

  void sendSmtpEmail({
    to: adminEmail,
    replyTo: params.customerEmail,
    subject: `[${params.type}] New booking from ${params.customerName}`,
    html: buildNotificationHtml({
      heading: "New booking request",
      subtitle: params.type,
      intro: "A customer submitted a new booking on your website.",
      rows,
      footer: "Manage bookings in the admin panel.",
    }),
  }).catch((e) => console.error("[site-email] queueAdminBookingAlert:", e));
}
