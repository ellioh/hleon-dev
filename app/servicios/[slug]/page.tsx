import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServicioPorSlug, getServiciosVisibles } from "@/lib/servicios-api";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatearPrecio(s: { rangoPrecioMin: string | null; rangoPrecioMax: string | null; moneda: string | null }) {
  if (!s.rangoPrecioMin || !s.moneda) return null;
  const min = Number(s.rangoPrecioMin).toLocaleString("es-PE");
  if (!s.rangoPrecioMax) return `Desde ${s.moneda} ${min}`;
  const max = Number(s.rangoPrecioMax).toLocaleString("es-PE");
  return `${s.moneda} ${min} — ${max}`;
}

export async function generateStaticParams() {
  const servicios = await getServiciosVisibles();
  return servicios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const servicio = await getServicioPorSlug(slug);
  if (!servicio) return { title: "Servicio no encontrado" };

  const seo = servicio.seo;
  const titulo = seo?.metaTitulo || servicio.nombre;
  const descripcion = seo?.metaDescripcion || servicio.resumenBreve;
  const canonical = seo?.canonicalUrl || `https://hleon.dev/servicios/${servicio.slug}`;
  const ogImagen = seo?.ogImagen?.url;
  const twitterImagen = seo?.twitterImagen?.url ?? ogImagen;

  return {
    title: seo?.metaTitulo ? { absolute: seo.metaTitulo } : servicio.nombre,
    description: descripcion,
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true,
    },
    openGraph: {
      title: seo?.ogTitulo || titulo,
      description: seo?.ogDescripcion || descripcion,
      type: "website",
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

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params;
  const servicio = await getServicioPorSlug(slug);
  if (!servicio) notFound();

  const todos = await getServiciosVisibles();
  const relacionados = todos
    .filter((s) => s.slug !== slug && s.categoria?.id === servicio.categoria?.id)
    .slice(0, 3);

  const urlCanonica = `https://hleon.dev/servicios/${servicio.slug}`;
  const precio = formatearPrecio(servicio);

  const jsonLdServicio = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: servicio.nombre,
    description: servicio.resumenBreve,
    provider: {
      "@type": "Person",
      name: "Héctor León",
      url: "https://hleon.dev",
    },
    ...(servicio.categoria ? { serviceType: servicio.categoria.nombre } : {}),
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
      { "@type": "ListItem", position: 2, name: "Servicios", item: "https://hleon.dev/servicios" },
      { "@type": "ListItem", position: 3, name: servicio.nombre, item: urlCanonica },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdServicio) }}
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
            <Link href="/servicios" className="hover:text-slate-300 transition-colors">Servicios</Link>
            {servicio.categoria && (
              <>
                <span>/</span>
                <span className="text-slate-400">{servicio.categoria.nombre}</span>
              </>
            )}
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {servicio.iconoEmoji && <span className="text-4xl">{servicio.iconoEmoji}</span>}
              {servicio.categoria && (
                <span className="text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                  {servicio.categoria.nombre}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{servicio.nombre}</h1>
            <p className="text-lg text-slate-400 leading-relaxed">{servicio.resumenBreve}</p>

            {(precio || servicio.tiempoEstimado) && (
              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-800/70">
                {precio && (
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Inversión estimada</p>
                    <p className="text-white font-semibold">{precio}</p>
                  </div>
                )}
                {servicio.tiempoEstimado && (
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Tiempo estimado</p>
                    <p className="text-white font-semibold">{servicio.tiempoEstimado}</p>
                  </div>
                )}
              </div>
            )}
          </header>

          {/* Descripción completa */}
          {servicio.descripcionCompleta && (
            <section className="mb-10">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{servicio.descripcionCompleta}</p>
            </section>
          )}

          {/* Entregables */}
          {servicio.entregables.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Qué incluye</h2>
              <ul className="space-y-2">
                {servicio.entregables.map((e) => (
                  <li key={e.id} className="text-slate-300 flex gap-2">
                    <span className="text-indigo-400 shrink-0">✓</span>
                    {e.texto}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Proyecto de ejemplo */}
          {servicio.proyectoEjemplo && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Un ejemplo real</h2>
              <Link
                href={`/portafolio/${servicio.proyectoEjemplo.slug}`}
                className="group flex items-center gap-4 bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 transition-all"
              >
                {servicio.proyectoEjemplo.imagenPrincipal && (
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={servicio.proyectoEjemplo.imagenPrincipal.url}
                      alt={servicio.proyectoEjemplo.nombre}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">
                    {servicio.proyectoEjemplo.nombre}
                  </p>
                  <p className="text-indigo-400 text-xs mt-1">Ver caso de estudio →</p>
                </div>
              </Link>
            </section>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">¿Te interesa este servicio?</h3>
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
                href="/servicios"
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-semibold transition-all text-sm border border-slate-700"
              >
                ← Más servicios
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* RELACIONADOS */}
      {relacionados.length > 0 && (
        <section className="pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Servicios relacionados</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relacionados.map((s) => (
                <Link
                  key={s.id}
                  href={`/servicios/${s.slug}`}
                  className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 transition-all hover:-translate-y-0.5"
                >
                  {s.iconoEmoji && <span className="text-2xl mb-2 block">{s.iconoEmoji}</span>}
                  <h3 className="text-white text-sm font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                    {s.nombre}
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
