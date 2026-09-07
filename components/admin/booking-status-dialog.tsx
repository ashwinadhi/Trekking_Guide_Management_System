"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type BookingStatusAction = "approve" | "reject";

interface BookingStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: BookingStatusAction;
  customerName: string;
  customerEmail: string;
  summary?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export function BookingStatusDialog({
  open,
  onOpenChange,
  action,
  customerName,
  customerEmail,
  summary,
  loading = false,
  onConfirm,
}: BookingStatusDialogProps) {
  const isApprove = action === "approve";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-gray-700 bg-gray-900 text-white sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            {isApprove ? "Approve booking?" : "Reject booking?"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                {isApprove
                  ? "The customer will receive a confirmation email once you submit."
                  : "The customer will receive an email letting them know this request was not approved."}
              </p>
              <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-3 text-left text-gray-200">
                <p className="font-semibold text-white">{customerName}</p>
                <p className="text-xs text-gray-400">{customerEmail}</p>
                {summary && <p className="mt-2 text-xs text-gray-300">{summary}</p>}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={loading}
            onClick={onConfirm}
            className={
              isApprove
                ? "bg-gold hover:bg-gold/90 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : isApprove ? (
              "Confirm & send email"
            ) : (
              "Reject & send email"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
