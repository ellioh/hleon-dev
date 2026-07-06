import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artículo no encontrado | hleon.dev" };

  return {
    title: `${post.titulo} | hleon.dev`,
    description: post.metaDescripcion,
    keywords: post.tags,
    authors: [{ name: "Héctor León", url: "https://hleon.dev" }],
    openGraph: {
      title: post.titulo,
      description: post.metaDescripcion,
      type: "article",
      url: `https://hleon.dev/blog/${post.slug}`,
      publishedTime: post.fechaPublicacion,
      modifiedTime: post.fechaActualizacion,
      section: post.categoria,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description: post.metaDescripcion,
    },
    alternates: {
      canonical: `https://hleon.dev/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const relatedPosts = getPosts()
    .filter((p) => p.slug !== slug && p.categoria === post.categoria)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.metaDescripcion,
    keywords: post.tags.join(", "),
    datePublished: post.fechaPublicacion,
    dateModified: post.fechaActualizacion,
    author: {
      "@type": "Person",
      name: "Héctor León",
      url: "https://hleon.dev",
      jobTitle: "Desarrollador de Software Empresarial",
    },
    publisher: {
      "@type": "Person",
      name: "Héctor León",
      url: "https://hleon.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://hleon.dev/blog/${post.slug}`,
    },
  };

  const contentHtml = renderMarkdown(post.contenido);

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      {/* ARTICLE */}
      <article className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
            <span>/</span>
            <Link
              href={`/blog/categoria/${encodeURIComponent(post.categoria.toLowerCase())}`}
              className="hover:text-slate-300 transition-colors"
            >
              {post.categoria}
            </Link>
          </nav>

          {/* Post header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <Link
                href={`/blog/categoria/${encodeURIComponent(post.categoria.toLowerCase())}`}
                className="text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full hover:bg-indigo-500/20 transition-colors"
              >
                {post.categoria}
              </Link>
              <time dateTime={post.fechaPublicacion} className="text-slate-500 text-sm">
                {new Date(post.fechaPublicacion).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              {post.titulo}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">{post.resumen}</p>
          </header>

          {/* Author */}
          <div className="flex items-center gap-4 py-5 border-y border-slate-800/70 mb-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              HL
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Héctor León</p>
              <p className="text-slate-400 text-xs">Ingeniero de Software · Especialista en Sistemas Empresariales</p>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-800/70">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-800/70 border border-slate-700/50 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">¿Necesitas un sistema para tu empresa?</h3>
            <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
              Cuéntame tu proyecto y en 24 horas te respondo con una evaluación inicial gratuita. Sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contacto"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm"
              >
                Solicitar evaluación gratuita
              </Link>
              <Link
                href="/blog"
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-semibold transition-all text-sm border border-slate-700"
              >
                ← Más artículos
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Artículos relacionados</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 transition-all hover:-translate-y-0.5"
                >
                  <span className="text-xs text-indigo-400 mb-2 block">{p.categoria}</span>
                  <h3 className="text-white text-sm font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    {p.titulo}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hleon.dev
          </Link>
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
