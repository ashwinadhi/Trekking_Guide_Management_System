import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LuxuryCardProps {
  href?: string
  image?: string
  title: string
  description?: string
  meta?: string
  price?: string
  cta?: string
  className?: string
}

export function LuxuryCard({ href, image, title, description, meta, price, cta = "View details", className }: LuxuryCardProps) {
  const inner = (
    <article
      className={cn(
        "group overflow-hidden border border-gold/20 bg-card transition-colors duration-500 hover:border-gold/50",
        className,
      )}
    >
      <div className="relative h-72 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/placeholder.svg"
            }}
          />
        ) : (
          <div className="h-full w-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        {price && (
          <span className="absolute bottom-4 right-4 font-display text-2xl text-gold">${price}</span>
        )}
      </div>
      <div className="p-6">
        {meta && <p className="luxury-label mb-2">{meta}</p>}
        <h3 className="font-display text-2xl text-ivory group-hover:text-gold">{title}</h3>
        {description && <p className="mt-2 line-clamp-2 text-sm text-stone">{description}</p>}
        {href && (
          <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
            {cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </article>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    )
  }
  return inner
}
