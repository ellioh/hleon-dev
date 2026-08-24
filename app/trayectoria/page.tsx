import { getExperienciasPublicadas } from "@/lib/experiencias-api";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trayectoria — Héctor León",
  description: "Línea de tiempo profesional: experiencia laboral, roles y logros como ingeniero de software especializado en sistemas empresariales.",
  alternates: {
    canonical: "https://hleon.dev/trayectoria",
  },
};

function formatearMes(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-PE", { year: "numeric", month: "long" });
}

export default async function TrayectoriaPage() {
  const experiencias = await getExperienciasPublicadas();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"
            >
              hleon.dev
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#servicios" className="text-slate-400 hover:text-white text-sm transition-colors">Servicios</Link>
              <Link href="/portafolio" className="text-slate-400 hover:text-white text-sm transition-colors">Portafolio</Link>
              <Link href="/trayectoria" className="text-white text-sm font-medium">Trayectoria</Link>
              <Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link>
              <Link href="/contacto" className="text-slate-400 hover:text-white text-sm transition-colors">Contacto</Link>
            </div>
            <Link
              href="/contacto"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Solicitar proyecto
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Trayectoria{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                profesional
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Roles, responsabilidades y resultados a lo largo de mi carrera como ingeniero de sistemas.
            </p>
          </div>

          {experiencias.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="text-slate-400 text-lg mb-2">Aún no hay experiencia publicada.</p>
              <p className="text-slate-500 text-sm">
                Vuelve pronto o{" "}
                <Link href="/contacto" className="text-indigo-400 hover:text-indigo-300">
                  hablemos directamente
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {experiencias.map((exp, index) => (
                <article
                  key={exp.id}
                  className="relative pl-8 border-l border-slate-800 pb-2 last:border-transparent"
                >
                  <span
                    className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
                      index === 0 && exp.actual ? "bg-indigo-400" : "bg-slate-700"
                    }`}
                  />

                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-xl font-semibold text-white">{exp.rol}</h2>
                    {exp.destacado && (
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-0.5 rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400 mb-4">
                    {exp.organizacion && <span className="text-slate-300 font-medium">{exp.organizacion.nombre}</span>}
                    <span>
                      {formatearMes(exp.fechaInicio)} — {exp.actual ? "Actual" : exp.fechaFin ? formatearMes(exp.fechaFin) : "—"}
                    </span>
                    {exp.ubicacion && <span>{exp.ubicacion}</span>}
                    <span className="capitalize">{exp.modalidad}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-4">{exp.resumen}</p>

                  {exp.logros.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {exp.logros.map((logro) => (
                        <li key={logro.id} className="text-slate-400 text-sm flex gap-2">
                          <span className="text-indigo-400 shrink-0">▹</span>
                          {logro.texto}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.tecnologias.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {exp.tecnologias.map((t) => (
                        <span key={t.id} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          {t.nombre}
                        </span>
                      ))}
                    </div>
                  )}

                  {exp.proyectos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.proyectos.map((p) => (
                        <Link
                          key={p.id}
                          href={`/portafolio/${p.slug}`}
                          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Ver proyecto: {p.nombre} ↗
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-10 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-3">¿Buscas este perfil para tu equipo?</h2>
              <p className="text-slate-400 mb-6">
                Disponible para roles remotos como Senior Systems Analyst o proyectos de consultoría puntuales.
              </p>
              <Link
                href="/contacto"
                className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
              >
                Conversemos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hleon.dev
          </Link>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/portafolio" className="hover:text-white transition-colors">Portafolio</Link>
            <Link href="/trayectoria" className="hover:text-white transition-colors">Trayectoria</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} Héctor León</p>
        </div>
      </footer>
    </div>
  );
}
