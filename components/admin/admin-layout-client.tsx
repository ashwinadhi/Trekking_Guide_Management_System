"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AdminShell } from "@/components/admin/admin-shell";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="admin-ui-theme">
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  );
}
