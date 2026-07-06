import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, getCategorias } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Héctor León — Desarrollo de Sistemas Empresariales",
  description:
    "Artículos sobre desarrollo de software empresarial, ERP, APIs, automatización y transformación digital para empresas en Perú y Latinoamérica.",
  openGraph: {
    title: "Blog de Héctor León — Sistemas Empresariales",
    description:
      "Artículos sobre desarrollo de software empresarial, ERP, APIs, automatización y transformación digital.",
    type: "website",
    url: "https://hleon.dev/blog",
  },
};

export default function BlogPage() {
  const posts = getPosts();
  const categorias = getCategorias();

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
              <Link href="/blog" className="text-white text-sm font-medium">Blog</Link>
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

      {/* HEADER */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-3">
            <Link href="/" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
              ← Inicio
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Artículos sobre desarrollo de sistemas empresariales, digitalización y tecnología para negocios que quieren crecer.
          </p>

          {/* Category filter */}
          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              <Link
                href="/blog"
                className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-sm font-medium transition-all hover:bg-indigo-500/30"
              >
                Todos
              </Link>
              {categorias.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/categoria/${encodeURIComponent(cat.toLowerCase())}`}
                  className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* POSTS */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-xl mb-2">Pronto habrá artículos aquí.</p>
              <p className="text-sm">Vuelve pronto.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                      {post.categoria}
                    </span>
                  </div>
                  <h2 className="text-white font-semibold text-lg leading-snug group-hover:text-indigo-300 transition-colors">
                    {post.titulo}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{post.resumen}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-slate-500 bg-slate-800/70 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <time dateTime={post.fechaPublicacion}>
                      {new Date(post.fechaPublicacion).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">Leer →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">¿Necesitas un sistema para tu empresa?</h2>
          <p className="text-slate-400 mb-6">Cuéntame tu proyecto y en 24 horas te respondo con una evaluación inicial gratuita.</p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-indigo-500/20"
          >
            Solicitar evaluación gratuita
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hleon.dev
          </span>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/portafolio" className="hover:text-white transition-colors">Portafolio</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} Héctor León</p>
        </div>
      </footer>
    </div>
  );
}
