import { getProyectos, getSolicitudes } from "@/lib/data";
import Link from "next/link";

export default function DashboardPage() {
  const proyectos = getProyectos();
  const solicitudes = getSolicitudes();
  const pendientes = solicitudes.filter((s) => !s.leido).length;
  const destacados = proyectos.filter((p) => p.destacado).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen de tu sitio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Proyectos totales",
            value: proyectos.length,
            icon: "💼",
            color: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20",
          },
          {
            label: "Proyectos destacados",
            value: destacados,
            icon: "⭐",
            color: "from-yellow-500/10 to-orange-500/10 border-yellow-500/20",
          },
          {
            label: "Solicitudes totales",
            value: solicitudes.length,
            icon: "📩",
            color: "from-cyan-500/10 to-sky-500/10 border-cyan-500/20",
          },
          {
            label: "Solicitudes pendientes",
            value: pendientes,
            icon: "🔔",
            color: pendientes > 0
              ? "from-red-500/10 to-rose-500/10 border-red-500/30"
              : "from-slate-500/10 to-slate-600/10 border-slate-700",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`bg-gradient-to-br ${s.color} border rounded-2xl p-5`}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-slate-400 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent solicitudes */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Últimas solicitudes</h2>
            <Link href="/admin/dashboard/solicitudes" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
              Ver todas →
            </Link>
          </div>
          {solicitudes.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay solicitudes aún.</p>
          ) : (
            <div className="space-y-3">
              {solicitudes.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${s.leido ? "bg-slate-600" : "bg-cyan-400"}`} />
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{s.nombre}</div>
                    <div className="text-slate-400 text-xs">{s.tipo} · {new Date(s.fecha).toLocaleDateString("es-PE")}</div>
                  </div>
                  {!s.leido && (
                    <span className="shrink-0 text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                      Nuevo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Proyectos recientes</h2>
            <Link href="/admin/dashboard/proyectos" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
              Gestionar →
            </Link>
          </div>
          {proyectos.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay proyectos aún.</p>
          ) : (
            <div className="space-y-3">
              {proyectos.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <span className="text-lg">
                    {p.categoria === "ERP" ? "🏭" : p.categoria === "CRM" ? "🤝" : p.categoria === "E-commerce" ? "🛒" : "💻"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-medium truncate">{p.titulo}</div>
                    <div className="text-slate-400 text-xs">{p.categoria}</div>
                  </div>
                  {p.destacado && (
                    <span className="shrink-0 text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                      Destacado
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
