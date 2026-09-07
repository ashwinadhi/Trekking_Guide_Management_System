"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!session) return null;

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
