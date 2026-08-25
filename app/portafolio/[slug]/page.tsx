import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProyectoPorSlug, getProyectosPublicados } from "@/lib/proyectos-api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const proyectos = await getProyectosPublicados();
  return proyectos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = await getProyectoPorSlug(slug);
  if (!proyecto) return { title: "Proyecto no encontrado" };

  const seo = proyecto.seo;
  // El layout raíz ya aplica la plantilla "%s | hleon.dev" - si el admin
  // definió un título SEO propio se usa tal cual (title.absolute, sin
  // plantilla); si no, se usa el nombre y se deja que la plantilla añada
  // el sufijo.
  const titulo = seo?.metaTitulo || proyecto.nombre;
  const descripcion = seo?.metaDescripcion || proyecto.resumenEjecutivo;
  const canonical = seo?.canonicalUrl || `https://hleon.dev/portafolio/${proyecto.slug}`;
  const ogImagen = seo?.ogImagen?.url ?? proyecto.imagenPrincipal?.url;
  const twitterImagen = seo?.twitterImagen?.url ?? ogImagen;

  return {
    title: seo?.metaTitulo ? { absolute: seo.metaTitulo } : proyecto.nombre,
    description: descripcion,
    authors: [{ name: "Héctor León", url: "https://hleon.dev" }],
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true,
    },
    openGraph: {
      title: seo?.ogTitulo || titulo,
      description: seo?.ogDescripcion || descripcion,
      type: (seo?.ogTipo as "website" | "article") || "website",
      url: canonical,
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

export default async function ProyectoDetallePage({ params }: Props) {
  const { slug } = await params;
  const proyecto = await getProyectoPorSlug(slug);
  if (!proyecto) notFound();

  const todos = await getProyectosPublicados();
  const relacionados = todos
    .filter((p) => p.slug !== slug && p.categoria?.id === proyecto.categoria?.id)
    .slice(0, 3);

  const urlCanonica = `https://hleon.dev/portafolio/${proyecto.slug}`;

  const jsonLdProyecto = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: proyecto.nombre,
    description: proyecto.resumenEjecutivo,
    creator: {
      "@type": "Person",
      name: "Héctor León",
      url: "https://hleon.dev",
    },
    ...(proyecto.imagenPrincipal ? { image: proyecto.imagenPrincipal.url } : {}),
    ...(proyecto.tecnologias.length > 0
      ? { keywords: proyecto.tecnologias.map((t) => t.nombre).join(", ") }
      : {}),
    ...(proyecto.fechaInicio ? { dateCreated: proyecto.fechaInicio } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": urlCanonica,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://hleon.dev" },
      { "@type": "ListItem", position: 2, name: "Portafolio", item: "https://hleon.dev/portafolio" },
      { "@type": "ListItem", position: 3, name: proyecto.nombre, item: urlCanonica },
    ],
  };

  const seccionesCaso: { titulo: string; contenido: string | null }[] = [
    { titulo: "El desafío", contenido: proyecto.elDesafio },
    { titulo: "La solución", contenido: proyecto.laSolucion },
    { titulo: "Mi rol", contenido: proyecto.miRol },
    { titulo: "Arquitectura", contenido: proyecto.arquitectura },
    { titulo: "Retos técnicos", contenido: proyecto.retos },
    { titulo: "Aprendizajes", contenido: proyecto.aprendizajes },
  ].filter((s) => s.contenido && s.contenido.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProyecto) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
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
              <Link href="/servicios" className="text-slate-400 hover:text-white text-sm transition-colors">Servicios</Link>
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

      <article className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/portafolio" className="hover:text-slate-300 transition-colors">Portafolio</Link>
            {proyecto.categoria && (
              <>
                <span>/</span>
                <span className="text-slate-400">{proyecto.categoria.nombre}</span>
              </>
            )}
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {proyecto.categoria && (
                <span className="text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                  {proyecto.categoria.nombre}
                </span>
              )}
              {proyecto.destacado && (
                <span className="text-sm bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full">
                  Destacado
                </span>
              )}
              {proyecto.fechaInicio && (
                <span className="text-slate-500 text-sm">
                  {new Date(proyecto.fechaInicio).toLocaleDateString("es-PE", { year: "numeric", month: "long" })}
                  {proyecto.fechaFin &&
                    ` — ${new Date(proyecto.fechaFin).toLocaleDateString("es-PE", { year: "numeric", month: "long" })}`}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{proyecto.nombre}</h1>
            <p className="text-lg text-slate-400 leading-relaxed">{proyecto.resumenEjecutivo}</p>

            {!proyecto.esConfidencial && proyecto.organizacion && (
              <p className="text-slate-500 text-sm mt-4">Cliente: {proyecto.organizacion.nombre}</p>
            )}

            {proyecto.urlPublica && (
              <a
                href={proyecto.urlPublica}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm mt-3 transition-colors"
              >
                Ver proyecto en vivo ↗
              </a>
            )}
          </header>

          {proyecto.imagenPrincipal && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 mb-10">
              <Image
                src={proyecto.imagenPrincipal.url}
                alt={proyecto.imagenPrincipal.altText ?? proyecto.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Tecnologías */}
          {proyecto.tecnologias.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {proyecto.tecnologias.map((t) => (
                <span key={t.id} className="text-xs text-slate-400 bg-slate-800/70 border border-slate-700/50 px-3 py-1 rounded-full">
                  {t.nombre}
                </span>
              ))}
            </div>
          )}

          {/* Caso de estudio */}
          <div className="space-y-10">
            {seccionesCaso.map((seccion) => (
              <section key={seccion.titulo}>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">{seccion.titulo}</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{seccion.contenido}</p>
              </section>
            ))}
          </div>

          {/* Resultados */}
          {proyecto.resultados.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Resultados</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {proyecto.resultados.map((r) => (
                  <div key={r.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">
                      {r.valor}
                    </p>
                    <p className="text-white text-sm font-medium mb-1">{r.metrica}</p>
                    {r.descripcion && <p className="text-slate-500 text-xs">{r.descripcion}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Galería */}
          {proyecto.galeria.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Galería</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {proyecto.galeria.map((img) => (
                  <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800">
                    <Image
                      src={img.url}
                      alt={img.altText ?? proyecto.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos */}
          {proyecto.videos.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
              <ul className="space-y-2">
                {proyecto.videos.map((v) => (
                  <li key={v.id}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      {v.titulo ?? "Ver video"} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">¿Necesitas algo similar?</h3>
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
                href="/portafolio"
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-semibold transition-all text-sm border border-slate-700"
              >
                ← Más proyectos
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* RELACIONADOS */}
      {relacionados.length > 0 && (
        <section className="pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Proyectos relacionados</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relacionados.map((p) => (
                <Link
                  key={p.id}
                  href={`/portafolio/${p.slug}`}
                  className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 transition-all hover:-translate-y-0.5"
                >
                  {p.categoria && <span className="text-xs text-indigo-400 mb-2 block">{p.categoria.nombre}</span>}
                  <h3 className="text-white text-sm font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    {p.nombre}
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
