import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page itself is under /admin but we don't want to redirect there
  // We handle auth check per-page for the dashboard routes
  return <>{children}</>;
}
