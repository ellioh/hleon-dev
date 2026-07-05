"use client";

import { useEffect, useState } from "react";

interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  tipo: string;
  descripcion: string;
  presupuesto: string;
  fecha: string;
  leido: boolean;
}

export default function SolicitudesAdminPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/solicitudes");
    const data = await res.json();
    setSolicitudes(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function marcarLeido(id: string) {
    await fetch("/api/admin/solicitudes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  const pendientes = solicitudes.filter((s) => !s.leido).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Solicitudes de proyecto</h1>
        <p className="text-slate-400 text-sm mt-1">
          {solicitudes.length} total{" "}
          {pendientes > 0 && (
            <span className="text-cyan-400 font-medium">· {pendientes} sin leer</span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Cargando...</div>
      ) : solicitudes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-400">No hay solicitudes aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                s.leido ? "border-slate-800" : "border-cyan-500/30"
              }`}
            >
              {/* Header row */}
              <button
                onClick={() => toggle(s.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-800/30 transition-colors"
              >
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.leido ? "bg-slate-600" : "bg-cyan-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-medium text-sm">{s.nombre}</span>
                    {!s.leido && (
                      <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-xs flex items-center gap-2 flex-wrap">
                    <span>{s.email}</span>
                    {s.empresa && (
                      <>
                        <span>·</span>
                        <span>{s.empresa}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{s.tipo}</span>
                    <span>·</span>
                    <span>{new Date(s.fecha).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
                {s.presupuesto && (
                  <span className="shrink-0 text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full">
                    {s.presupuesto}
                  </span>
                )}
                <span className="text-slate-500 text-sm">{expanded === s.id ? "▲" : "▼"}</span>
              </button>

              {/* Expanded content */}
              {expanded === s.id && (
                <div className="px-5 pb-5 border-t border-slate-800">
                  <div className="pt-4 space-y-4">
                    <div>
                      <div className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Descripción del proyecto</div>
                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{s.descripcion}</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 text-xs mb-0.5">Email</div>
                        <a href={`mailto:${s.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                          {s.email}
                        </a>
                      </div>
                      {s.empresa && (
                        <div>
                          <div className="text-slate-500 text-xs mb-0.5">Empresa</div>
                          <span className="text-slate-200">{s.empresa}</span>
                        </div>
                      )}
                      {s.presupuesto && (
                        <div>
                          <div className="text-slate-500 text-xs mb-0.5">Presupuesto</div>
                          <span className="text-slate-200">{s.presupuesto}</span>
                        </div>
                      )}
                    </div>
                    {!s.leido && (
                      <button
                        onClick={() => marcarLeido(s.id)}
                        className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-all"
                      >
                        Marcar como leído
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
