/**
 * Centralized server-side environment variables.
 * Keep all secrets in `.env.local` — never hardcode them in application code.
 */

function getRequired(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function getOptionalInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? fallback : n;
}

/** Runtime secrets used by the application (database, auth, email). */
export const serverEnv = {
  get mongodbUri() {
    return getRequired("MONGODB_URI");
  },
  get nextAuthSecret() {
    return getRequired("NEXTAUTH_SECRET");
  },
  get nextAuthUrl() {
    return getOptional("NEXTAUTH_URL");
  },
  /** SMTP host, e.g. smtp.gmail.com */
  get smtpHost() {
    return getOptional("SMTP_HOST") || "smtp.gmail.com";
  },
  get smtpPort() {
    return getOptionalInt("SMTP_PORT", 587);
  },
  get smtpSecure() {
    return getOptional("SMTP_SECURE") === "true";
  },
  get smtpUser() {
    return getOptional("SMTP_USER");
  },
  get smtpPass() {
    return getOptional("SMTP_PASS");
  },
  get emailFrom() {
    return (
      getOptional("EMAIL_FROM") ||
      (this.smtpUser ? `Nirvana Luxury Adventure <${this.smtpUser}>` : "Nirvana Luxury Adventure <noreply@localhost>")
    );
  },
  /** Inbox that receives contact forms, reviews, and new-booking admin alerts */
  get adminNotifyEmail() {
    return getOptional("ADMIN_NOTIFY_EMAIL") || getOptional("SMTP_USER");
  },
  get smtpConfigured() {
    return Boolean(this.smtpUser && this.smtpPass);
  },
};

/** Admin bootstrap credentials — used only by `npm run seed:admin`, not at login runtime. */
export const adminSeedEnv = {
  get email() {
    return getOptional("ADMIN_EMAIL");
  },
  get password() {
    return getOptional("ADMIN_PASSWORD");
  },
};
