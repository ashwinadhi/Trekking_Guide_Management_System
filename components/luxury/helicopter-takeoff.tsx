"use client"

export function HelicopterTakeoff() {
  return (
    <div className="heli-stage relative overflow-hidden border border-gold/20 bg-ink">
      <div className="heli-sky absolute inset-0" />
      <div className="heli-peaks absolute inset-x-0 bottom-0 h-24" />
      <div className="heli-pad absolute bottom-8 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-gold/40" />
      <div className="heli-dust absolute bottom-10 left-1/2 h-8 w-32 -translate-x-1/2" />

      <div className="relative z-10 flex min-h-[280px] flex-col items-center justify-center px-4 pb-8 pt-10">
        <p className="heli-ready luxury-label mb-8 text-center">Ready to take off</p>
        <div className="heli-craft">
          <svg viewBox="0 0 240 90" className="h-20 w-56 text-gold" fill="currentColor" aria-hidden>
            <g className="heli-rotor origin-center">
              <rect x="28" y="8" width="184" height="4" rx="2" opacity="0.9" />
              <rect x="116" y="2" width="8" height="18" rx="1" />
            </g>
            <ellipse cx="108" cy="52" rx="42" ry="18" />
            <path d="M108 38 L168 42 L176 52 L168 58 L108 54 Z" />
            <rect x="168" y="46" width="48" height="6" rx="2" />
            <circle cx="216" cy="49" r="6" />
            <rect x="78" y="66" width="6" height="14" rx="1" />
            <rect x="118" y="66" width="6" height="14" rx="1" />
            <rect x="70" y="78" width="62" height="4" rx="2" />
            <g className="heli-tail-rotor">
              <circle cx="216" cy="49" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
