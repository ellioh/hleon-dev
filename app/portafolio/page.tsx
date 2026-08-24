import { getProyectosPublicados } from "@/lib/proyectos-api";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portafolio — Héctor León",
  description: "Proyectos de desarrollo de software empresarial: ERP, CRM, e-commerce y más.",
  alternates: {
    canonical: "https://hleon.dev/portafolio",
  },
};

const categoryIcons: Record<string, string> = {
  ERP: "🏭",
  CRM: "🤝",
  "E-commerce": "🛒",
  default: "💻",
};

export default async function PortafolioPage() {
  const proyectos = await getProyectosPublicados();
  const categorias = Array.from(
    new Set(proyectos.map((p) => p.categoria?.nombre).filter((c): c is string => Boolean(c)))
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              hleon.dev
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                ← Inicio
              </Link>
              <Link
                href="/contacto"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Solicitar proyecto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Portafolio de{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                proyectos
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Sistemas empresariales desarrollados para clientes reales. Cada proyecto representa un desafío único
              resuelto con tecnología sólida.
            </p>
          </div>

          {proyectos.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="text-slate-400 text-lg mb-2">Aún no hay proyectos publicados.</p>
              <p className="text-slate-500 text-sm">
                Estoy documentando casos de estudio reales. Vuelve pronto o{" "}
                <Link href="/contacto" className="text-indigo-400 hover:text-indigo-300">
                  hablemos de tu proyecto
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              {/* Category summary */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <span className="bg-slate-800 text-slate-300 border border-slate-700 px-4 py-1.5 rounded-full text-sm font-medium">
                  Todos ({proyectos.length})
                </span>
                {categorias.map((cat) => (
                  <span
                    key={cat}
                    className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-sm font-medium"
                  >
                    {cat} ({proyectos.filter((p) => p.categoria?.nombre === cat).length})
                  </span>
                ))}
              </div>

              {/* Projects grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {proyectos.map((p) => (
                  <Link
                    key={p.id}
                    href={`/portafolio/${p.slug}`}
                    className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 group"
                  >
                    <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 flex items-center justify-center border-b border-slate-800 relative">
                      {p.imagenPrincipal ? (
                        <Image
                          src={p.imagenPrincipal.url}
                          alt={p.imagenPrincipal.altText ?? p.nombre}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-5xl opacity-50">
                          {categoryIcons[p.categoria?.nombre ?? ""] ?? categoryIcons.default}
                        </span>
                      )}
                      {p.destacado && (
                        <span className="absolute top-3 right-3 text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-0.5 rounded-full z-10">
                          Destacado
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      {p.categoria && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                            {p.categoria.nombre}
                          </span>
                        </div>
                      )}
                      <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                        {p.nombre}
                      </h2>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.resumenEjecutivo}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tecnologias.map((t) => (
                          <span key={t.id} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            {t.nombre}
                          </span>
                        ))}
                      </div>
                      {p.urlPublica && (
                        <span className="inline-flex items-center gap-1 text-cyan-400 text-sm">
                          Ver proyecto en vivo ↗
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-10 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-3">¿Tu proyecto no está aquí?</h2>
              <p className="text-slate-400 mb-6">
                Cada cliente tiene necesidades únicas. Cuéntame el tuyo y construimos algo excepcional juntos.
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
