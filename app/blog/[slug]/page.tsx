import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostPorSlug, getPostsPublicados } from "@/lib/posts-api";
import { renderMarkdown } from "@/lib/markdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPostsPublicados();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostPorSlug(slug);
  if (!post) return { title: "Artículo no encontrado" };

  const seo = post.seo;
  const titulo = seo?.metaTitulo || post.titulo;
  const descripcion = seo?.metaDescripcion || post.resumen;
  const canonical = seo?.canonicalUrl || `https://hleon.dev/blog/${post.slug}`;
  const ogImagen = seo?.ogImagen?.url ?? post.imagenDestacada?.url;
  const twitterImagen = seo?.twitterImagen?.url ?? ogImagen;
  const nombreAutor = post.autor?.nombre ?? "Héctor León";

  return {
    title: seo?.metaTitulo ? { absolute: seo.metaTitulo } : post.titulo,
    description: descripcion,
    keywords: post.tags,
    authors: [{ name: nombreAutor, url: "https://hleon.dev" }],
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true,
    },
    openGraph: {
      title: seo?.ogTitulo || titulo,
      description: seo?.ogDescripcion || descripcion,
      type: "article",
      url: canonical,
      publishedTime: post.fechaPublicacion ?? undefined,
      modifiedTime: post.fechaActualizacion,
      section: post.categoria?.nombre,
      tags: post.tags,
      images: ogImagen ? [{ url: ogImagen }] : undefined,
    },
    twitter: {
      card: (seo?.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      title: seo?.twitterTitulo || titulo,
      description: seo?.twitterDescripcion || descripcion,
      images: twitterImagen ? [twitterImagen] : undefined,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostPorSlug(slug);
  if (!post) notFound();

  const todos = await getPostsPublicados();
  const relatedPosts = todos
    .filter((p) => p.slug !== slug && p.categoria?.id === post.categoria?.id)
    .slice(0, 3);

  const urlCanonica = `https://hleon.dev/blog/${post.slug}`;
  const nombreAutor = post.autor?.nombre ?? "Héctor León";
  const tituloAutor = post.autor?.tituloProfesional ?? "Ingeniero de Software · Especialista en Sistemas Empresariales";
  const inicialesAutor = nombreAutor
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.seo?.metaDescripcion || post.resumen,
    keywords: post.tags.join(", "),
    datePublished: post.fechaPublicacion,
    dateModified: post.fechaActualizacion,
    author: {
      "@type": "Person",
      name: nombreAutor,
      url: "https://hleon.dev",
      jobTitle: tituloAutor,
    },
    publisher: {
      "@type": "Person",
      name: nombreAutor,
      url: "https://hleon.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": urlCanonica,
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

      {/* ARTICLE */}
      <article className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
            {post.categoria && (
              <>
                <span>/</span>
                <Link
                  href={`/blog/categoria/${encodeURIComponent(post.categoria.nombre.toLowerCase())}`}
                  className="hover:text-slate-300 transition-colors"
                >
                  {post.categoria.nombre}
                </Link>
              </>
            )}
          </nav>

          {/* Post header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {post.categoria && (
                <Link
                  href={`/blog/categoria/${encodeURIComponent(post.categoria.nombre.toLowerCase())}`}
                  className="text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full hover:bg-indigo-500/20 transition-colors"
                >
                  {post.categoria.nombre}
                </Link>
              )}
              {post.fechaPublicacion && (
                <time dateTime={post.fechaPublicacion} className="text-slate-500 text-sm">
                  {new Date(post.fechaPublicacion).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              {post.titulo}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">{post.resumen}</p>
          </header>

          {post.imagenDestacada && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 mb-10">
              <Image
                src={post.imagenDestacada.url}
                alt={post.imagenDestacada.altText ?? post.titulo}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-4 py-5 border-y border-slate-800/70 mb-10">
            {post.autor?.foto ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image src={post.autor.foto.url} alt={nombreAutor} fill sizes="48px" className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {inicialesAutor}
              </div>
            )}
            <div>
              <p className="text-white font-semibold text-sm">{nombreAutor}</p>
              <p className="text-slate-400 text-xs">{tituloAutor}</p>
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
                  {p.categoria && <span className="text-xs text-indigo-400 mb-2 block">{p.categoria.nombre}</span>}
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
