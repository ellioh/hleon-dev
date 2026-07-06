import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategorias, getPostsByCategoria } from "@/lib/blog";

interface Props {
  params: Promise<{ categoria: string }>;
}

export async function generateStaticParams() {
  return getCategorias().map((cat) => ({ categoria: cat.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const decoded = decodeURIComponent(categoria);
  const cats = getCategorias().map((c) => c.toLowerCase());
  if (!cats.includes(decoded)) return { title: "Categoría no encontrada | hleon.dev" };

  const displayName = getCategorias().find((c) => c.toLowerCase() === decoded) ?? decoded;

  return {
    title: `${displayName} — Blog | hleon.dev`,
    description: `Artículos sobre ${displayName} — desarrollo de software empresarial, sistemas a medida y digitalización de empresas.`,
    openGraph: {
      title: `${displayName} — Blog de Héctor León`,
      description: `Artículos sobre ${displayName} en el blog de Héctor León, especialista en sistemas empresariales.`,
      type: "website",
    },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const decoded = decodeURIComponent(categoria);
  const allCats = getCategorias();
  const displayName = allCats.find((c) => c.toLowerCase() === decoded);

  if (!displayName) notFound();

  const posts = getPostsByCategoria(displayName);

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

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-400">{displayName}</span>
          </nav>

          <h1 className="text-4xl font-bold text-white mb-2">{displayName}</h1>
          <p className="text-slate-400 mb-4">
            {posts.length} {posts.length === 1 ? "artículo" : "artículos"} en esta categoría
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-all"
            >
              Todos
            </Link>
            {allCats.map((cat) => (
              <Link
                key={cat}
                href={`/blog/categoria/${encodeURIComponent(cat.toLowerCase())}`}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                  cat === displayName
                    ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-medium"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No hay artículos en esta categoría aún.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <h2 className="text-white font-semibold text-lg leading-snug group-hover:text-indigo-300 transition-colors">
                    {post.titulo}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{post.resumen}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
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

      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hleon.dev
          </Link>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
