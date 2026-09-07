/**
 * SMTP email via nodemailer — send from your personal/business mailbox (Gmail, Outlook, etc.).
 */
import nodemailer from "nodemailer";
import { serverEnv } from "./env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!serverEnv.smtpConfigured) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: serverEnv.smtpHost,
      port: serverEnv.smtpPort,
      secure: serverEnv.smtpSecure,
      auth: {
        user: serverEnv.smtpUser,
        pass: serverEnv.smtpPass,
      },
    });
  }
  return transporter;
}

export async function sendSmtpEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const transport = getTransporter();
  if (!transport) {
    console.warn("[mail] SMTP is not configured; skipping email to", params.to);
    return { ok: false, skipped: true };
  }

  try {
    await transport.sendMail({
      from: serverEnv.emailFrom,
      to: params.to.trim().toLowerCase(),
      replyTo: params.replyTo?.trim(),
      subject: params.subject,
      html: params.html,
    });
    return { ok: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[mail] Failed to send:", message);
    return { ok: false, error: message };
  }
}
