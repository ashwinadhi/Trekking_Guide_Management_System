import Image from "next/image"
import { cn } from "@/lib/utils"
import { BRAND_NAME, BRAND_LOGO_PATH } from "@/lib/brand"

interface BrandLogoProps {
  compact?: boolean
  className?: string
  showWordmark?: boolean
}

export function BrandLogo({ compact = false, className, showWordmark = true }: BrandLogoProps) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Image
        src={BRAND_LOGO_PATH}
        alt={BRAND_NAME}
        width={compact ? 176 : 224}
        height={compact ? 44 : 56}
        className={cn("w-auto object-contain", compact ? "h-11" : "h-14")}
        priority
      />
      {showWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-lg font-medium tracking-wide text-ivory sm:text-xl">Nirvana</span>
          <span className="text-[9px] uppercase tracking-[0.22em] text-gold">Luxury Adventure</span>
        </span>
      )}
    </span>
  )
}
