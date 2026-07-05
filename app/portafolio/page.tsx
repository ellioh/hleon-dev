import { getProyectos } from "@/lib/data";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portafolio — Héctor León",
  description: "Proyectos de desarrollo de software empresarial: ERP, CRM, e-commerce y más.",
};

const categoryIcons: Record<string, string> = {
  ERP: "🏭",
  CRM: "🤝",
  "E-commerce": "🛒",
  default: "💻",
};

export default function PortafolioPage() {
  const proyectos = getProyectos().sort((a, b) => a.orden - b.orden);
  const categorias = Array.from(new Set(proyectos.map((p) => p.categoria)));

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
                {cat} ({proyectos.filter((p) => p.categoria === cat).length})
              </span>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectos.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 group"
              >
                <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 flex items-center justify-center border-b border-slate-800 relative">
                  <span className="text-5xl opacity-50">
                    {categoryIcons[p.categoria] ?? categoryIcons.default}
                  </span>
                  {p.destacado && (
                    <span className="absolute top-3 right-3 text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-0.5 rounded-full">
                      Destacado
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                      {p.categoria}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {p.titulo}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.descripcion}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tecnologias.map((t) => (
                      <span key={t} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      Ver proyecto en vivo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

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
    </div>
  );
}
