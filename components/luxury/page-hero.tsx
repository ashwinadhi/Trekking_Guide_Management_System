import Image from "next/image"
import { cn } from "@/lib/utils"

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  imageSrc?: string
  compact?: boolean
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  imageSrc = "/images/mountain-sunrise.jpg",
  compact = false,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("page-hero relative flex items-end", compact ? "min-h-[42vh]" : "min-h-[56vh]", className)}>
      <div className="absolute inset-0">
        <Image src={imageSrc} alt="" fill className="object-cover ken-burns" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-black/40" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        {eyebrow && <p className="luxury-label mb-4">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-medium leading-tight text-ivory md:text-6xl">{title}</h1>
        <div className="luxury-hairline ml-0" />
        {subtitle && <p className="mt-6 max-w-2xl text-lg text-stone">{subtitle}</p>}
      </div>
    </section>
  )
}
