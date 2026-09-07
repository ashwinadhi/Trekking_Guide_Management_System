import { cn } from "@/lib/utils"
import { BRAND_LOGO_PATH, BRAND_NAME } from "@/lib/brand"

export function BrandMark({
  className,
  imgClassName,
  showWordmark = true,
}: {
  className?: string
  imgClassName?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <img
        src={BRAND_LOGO_PATH}
        alt={BRAND_NAME}
        className={cn("h-12 w-auto object-contain", imgClassName)}
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
