"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookingSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  buttonLabel?: string
  onClose?: () => void
}

export function BookingSuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  buttonLabel = "Done",
  onClose,
}: BookingSuccessDialogProps) {
  const handleClose = () => {
    onOpenChange(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-gold/30 bg-card p-0 [&>button]:hidden">
        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center border border-gold/40">
            <CheckCircle2 className="h-9 w-9 text-gold" strokeWidth={1.5} />
          </div>

          <DialogHeader className="space-y-3">
            <DialogTitle className="font-display text-3xl text-ivory">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-base leading-relaxed text-stone">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <Button onClick={handleClose} className="mt-8 h-12 w-full">
            {buttonLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
