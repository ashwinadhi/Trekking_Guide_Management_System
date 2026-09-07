import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeader({ eyebrow, title, subtitle, align = "center", className }: SectionHeaderProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && <p className="luxury-label mb-3">{eyebrow}</p>}
      <h2 className="font-display text-4xl font-medium text-ivory md:text-5xl">{title}</h2>
      <div className={cn("luxury-hairline", align === "left" && "ml-0")} />
      {subtitle && (
        <p className={cn("mt-6 text-lg text-stone", align === "center" && "mx-auto max-w-2xl")}>{subtitle}</p>
      )}
    </div>
  )
}
