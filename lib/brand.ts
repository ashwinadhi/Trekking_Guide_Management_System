export const BRAND_NAME = "Nirvana Luxury Adventure"
export const BRAND_SHORT = "Nirvana"
export const BRAND_TAGLINE = "Private Himalayan expeditions"
export const BRAND_LOGO_PATH = "/images/nirvana-luxury-adventure-logo.jpg"

export function brandLogoAbsoluteUrl(): string {
  const raw =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "https://technietrek.vercel.app"
  const base = raw.toString().replace(/^\/\//, "https://").replace(/\/$/, "")
  const withProtocol = base.startsWith("http") ? base : `https://${base}`
  return `${withProtocol}${BRAND_LOGO_PATH}`
}
