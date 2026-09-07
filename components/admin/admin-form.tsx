"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, X, Plus, Pencil, Save } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Shared control styling for all admin create/edit forms. */
export const adminControlClassName =
  "h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:ring-gold/40 dark:border-gray-700 dark:bg-gray-950/70 dark:text-white dark:placeholder:text-gray-500";

export const adminTextareaClassName =
  "min-h-[100px] rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:ring-gold/40 dark:border-gray-700 dark:bg-gray-950/70 dark:text-white dark:placeholder:text-gray-500";

export const adminSelectClassName = cn(
  adminControlClassName,
  "w-full px-3 py-2.5 text-sm appearance-none cursor-pointer"
);

interface AdminFormShellProps {
  title: string;
  description?: string;
  mode?: "create" | "edit";
  icon?: LucideIcon;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormShell({
  title,
  description,
  mode = "create",
  icon: Icon,
  onClose,
  children,
  className,
}: AdminFormShellProps) {
  const ModeIcon = mode === "edit" ? Pencil : Plus;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/90",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold dark:text-gold">
            {Icon ? <Icon className="h-5 w-5" /> : <ModeIcon className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="shrink-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {children}
    </div>
  );
}

interface AdminFormSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormSection({
  title,
  description,
  action,
  children,
  className,
}: AdminFormSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminFormGrid({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}) {
  const gridClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 3
        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2";

  return <div className={cn("grid gap-5", gridClass, className)}>{children}</div>;
}

interface AdminFormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormField({
  label,
  htmlFor,
  hint,
  required,
  fullWidth,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn(fullWidth && "md:col-span-2", className)}>
      <Label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-200"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-500 dark:text-gray-500">{hint}</p>}
    </div>
  );
}

type InputProps = React.ComponentProps<typeof Input>;

export const AdminFormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input ref={ref} className={cn(adminControlClassName, className)} {...props} />
  )
);
AdminFormInput.displayName = "AdminFormInput";

type TextareaProps = React.ComponentProps<typeof Textarea>;

export const AdminFormTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <Textarea ref={ref} className={cn(adminTextareaClassName, className)} {...props} />
  )
);
AdminFormTextarea.displayName = "AdminFormTextarea";

interface AdminFormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function AdminFormSelect({
  options,
  placeholder,
  className,
  ...props
}: AdminFormSelectProps) {
  return (
    <select className={cn(adminSelectClassName, className)} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function AdminFormSubPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-gray-700 dark:bg-gray-950/40",
        className
      )}
    >
      <h4 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-gold dark:border-gray-700 dark:text-gold">
        {title}
      </h4>
      {children}
    </div>
  );
}

interface AdminFormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
}

export function AdminFormActions({
  onCancel,
  submitLabel = "Save",
  loading = false,
  loadingLabel = "Saving…",
  className,
}: AdminFormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800",
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
        className="border-slate-200 dark:border-gray-700"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="min-w-[140px] bg-gold hover:bg-gold/90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
}

export function AdminFormAlert({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  if (!message) return null;

  const styles =
    type === "success"
      ? "border-gold/30 bg-gold/10 text-gold"
      : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400";

  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm font-medium", styles)}>
      {message}
    </div>
  );
}

interface AdminTagInputProps {
  label: string;
  hint?: string;
  placeholder?: string;
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  addLabel?: string;
  variant?: "default" | "danger";
  inputType?: React.HTMLInputTypeAttribute;
}

export function AdminTagInput({
  label,
  hint,
  placeholder,
  tags,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  addLabel = "Add",
  variant = "default",
  inputType = "text",
}: AdminTagInputProps) {
  return (
    <AdminFormField label={label} hint={hint} fullWidth>
      <div className="flex gap-2">
        <AdminFormInput
          type={inputType}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={onAdd} className="shrink-0">
          {addLabel}
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                variant === "danger"
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                  : "border-gold/30 bg-gold/10 text-gold"
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-full p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </AdminFormField>
  );
}

export function AdminFormBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-8 p-6", className)}>{children}</div>;
}
