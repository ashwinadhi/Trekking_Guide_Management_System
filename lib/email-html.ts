/** Shared HTML helpers for all outbound emails. */
import { BRAND_NAME, brandLogoAbsoluteUrl } from "@/lib/brand"

export function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailBrandHeader(heading?: string, subtitle?: string): string {
  const logo = brandLogoAbsoluteUrl();
  const headingHtml = heading
    ? `<h1 style="margin:16px 0 0;font-size:20px;color:#F4EFE6;">${escapeHtml(heading)}</h1>`
    : "";
  const subtitleHtml = subtitle
    ? `<p style="margin:8px 0 0;font-size:14px;color:#C9A86A;">${escapeHtml(subtitle)}</p>`
    : "";

  return `<tr><td style="background:#070707;color:#F4EFE6;padding:24px 24px 20px;text-align:center;">
  <img src="${escapeHtml(logo)}" alt="${escapeHtml(BRAND_NAME)}" width="220" style="display:block;margin:0 auto;max-width:220px;height:auto;border:0;" />
  <p style="margin:12px 0 0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#C9A86A;">${escapeHtml(BRAND_NAME)}</p>
  ${headingHtml}
  ${subtitleHtml}
</td></tr>`;
}

export function buildNotificationHtml(params: {
  heading: string;
  subtitle?: string;
  greeting?: string;
  intro: string;
  rows?: { label: string; value: string }[];
  footer?: string;
}): string {
  const rowsHtml = (params.rows || [])
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;color:#374151;width:40%;">${escapeHtml(r.label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827;">${escapeHtml(r.value)}</td></tr>`
    )
    .join("");

  const greeting = params.greeting
    ? `<p style="margin:0 0 16px;">${escapeHtml(params.greeting)}</p>`
    : "";

  const table = rowsHtml
    ? `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">${rowsHtml}</table>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111827;background:#f9fafb;padding:24px;">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    ${emailBrandHeader(params.heading, params.subtitle)}
    <tr><td style="padding:24px;">
      ${greeting}
      <p style="margin:0 0 8px;color:#4b5563;">${escapeHtml(params.intro)}</p>
      ${table}
      <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">${escapeHtml(params.footer || `— ${BRAND_NAME}`)}</p>
    </td></tr>
  </table>
</body>
</html>`.trim();
}
