import { getServiciosVisibles } from "@/lib/servicios-api";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios — Héctor León",
  description: "Servicios de desarrollo de software empresarial: ERP, CRM, e-commerce, APIs, automatización y consultoría técnica.",
  alternates: {
    canonical: "https://hleon.dev/servicios",
  },
};

function formatearPrecio(s: { rangoPrecioMin: string | null; rangoPrecioMax: string | null; moneda: string | null }) {
  if (!s.rangoPrecioMin || !s.moneda) return null;
  const min = Number(s.rangoPrecioMin).toLocaleString("es-PE");
  if (!s.rangoPrecioMax) return `Desde ${s.moneda} ${min}`;
  const max = Number(s.rangoPrecioMax).toLocaleString("es-PE");
  return `${s.moneda} ${min} — ${max}`;
}

export default async function ServiciosPage() {
  const servicios = await getServiciosVisibles();

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
              <Link href="/servicios" className="text-white text-sm font-medium">Servicios</Link>
              <Link href="/portafolio" className="text-slate-400 hover:text-white text-sm transition-colors">Portafolio</Link>
              <Link href="/trayectoria" className="text-slate-400 hover:text-white text-sm transition-colors">Trayectoria</Link>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Qué puedo{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                construir para ti
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Me especializo en sistemas empresariales robustos y escalables, diseñados para resolver problemas reales de tu negocio.
            </p>
          </div>

          {servicios.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="text-slate-400 text-lg mb-2">Aún no hay servicios publicados.</p>
              <p className="text-slate-500 text-sm">
                Vuelve pronto o{" "}
                <Link href="/contacto" className="text-indigo-400 hover:text-indigo-300">
                  hablemos directamente
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicios.map((s) => {
                const precio = formatearPrecio(s);
                return (
                  <Link
                    key={s.id}
                    href={`/servicios/${s.slug}`}
                    className="bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 group"
                  >
                    {s.iconoEmoji && <div className="text-3xl">{s.iconoEmoji}</div>}
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                        {s.nombre}
                      </h2>
                      <p className="text-slate-400 text-sm leading-relaxed">{s.resumenBreve}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 mt-auto border-t border-slate-800">
                      {precio ? (
                        <span className="text-indigo-400 font-medium">{precio}</span>
                      ) : (
                        <span className="text-slate-600">Cotización a medida</span>
                      )}
                      {s.tiempoEstimado && <span className="text-slate-500">{s.tiempoEstimado}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-10 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-3">¿No encuentras lo que necesitas?</h2>
              <p className="text-slate-400 mb-6">
                Cada negocio es distinto. Cuéntame tu caso y definimos juntos la solución correcta.
              </p>
              <Link
                href="/contacto"
                className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
              >
                Hablar de mi proyecto
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
            <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
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
