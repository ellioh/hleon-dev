import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hleon.dev
          </Link>
          <p className="text-slate-500 text-xs mt-0.5">Panel de administración</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            href="/admin/dashboard/proyectos"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
          >
            <span>💼</span> Proyectos
          </Link>
          <Link
            href="/admin/dashboard/solicitudes"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
          >
            <span>📩</span> Solicitudes
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Ver sitio
          </Link>
          <form action="/api/admin/logout" method="POST" className="mt-2">
            <button
              type="submit"
              className="text-slate-500 hover:text-red-400 text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      {/* Main content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
