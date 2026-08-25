import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPerfil } from "@/lib/perfil-api";
import { getExperienciasPublicadas } from "@/lib/experiencias-api";
import { getEducacionesVisibles } from "@/lib/educaciones-api";

export const metadata: Metadata = {
  title: "Hire Me — Héctor León",
  description: "Systems consultant CV: professional summary, work experience, and education.",
  alternates: {
    canonical: "https://hleon.dev/hire-me",
  },
};

function formatMonth(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

const DISPONIBILIDAD_EN: Record<string, string> = {
  abierto_remoto: "Open to remote roles",
  abierto_proyectos: "Open to project work",
  abierto_ambos: "Open to remote roles and project work",
  no_disponible: "Not currently available",
};

export default async function HireMePage() {
  const [perfil, experiencias, educaciones] = await Promise.all([
    getPerfil(),
    getExperienciasPublicadas(),
    getEducacionesVisibles(),
  ]);

  // Solo se muestra lo que realmente tiene contenido en inglés - nunca se
  // cae al texto en español en esta página (ver ADR de Educación/hire-me).
  const experienciasEn = experiencias.filter((exp) => exp.rolEn && exp.resumenEn);
  const educacionesEn = educaciones.filter((edu) => edu.tituloEn);

  const nombre = perfil?.nombrePublico ?? perfil?.nombreCompleto ?? "Héctor León";
  const tituloEn = perfil?.tituloProfesionalEn;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"
            >
              hleon.dev
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/trayectoria" className="text-slate-400 hover:text-white text-sm transition-colors">
                Ver en español
              </Link>
              <Link
                href="/contacto"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* HEADER */}
          <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-14 text-center sm:text-left">
            {perfil?.foto && (
              <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-slate-800">
                <Image src={perfil.foto.url} alt={perfil.foto.altText ?? nombre} fill sizes="96px" className="object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">{nombre}</h1>
              {tituloEn && <p className="text-lg text-indigo-400 font-medium mb-3">{tituloEn}</p>}
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-slate-400">
                {perfil?.ubicacion && <span>{perfil.ubicacion}</span>}
                {perfil?.email && (
                  <a href={`mailto:${perfil.email}`} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    {perfil.email}
                  </a>
                )}
                {perfil?.disponibilidad && perfil.disponibilidad !== "no_disponible" && (
                  <span className="text-emerald-400">{DISPONIBILIDAD_EN[perfil.disponibilidad]}</span>
                )}
              </div>
            </div>
          </header>

          {/* SUMMARY */}
          {perfil?.bioLargaEn && (
            <section className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Summary</h2>
              <p className="text-slate-300 leading-relaxed">{perfil.bioLargaEn}</p>
            </section>
          )}

          {/* EXPERIENCE */}
          {experienciasEn.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Experience</h2>
              <div className="space-y-6">
                {experienciasEn.map((exp) => (
                  <article key={exp.id} className="border-l-2 border-slate-800 pl-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-white font-semibold">{exp.rolEn}</h3>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatMonth(exp.fechaInicio)} – {exp.actual ? "Present" : exp.fechaFin ? formatMonth(exp.fechaFin) : ""}
                      </span>
                    </div>
                    {exp.organizacion && <p className="text-sm text-slate-400 mb-1.5">{exp.organizacion.nombre}</p>}
                    <p className="text-slate-300 text-sm leading-relaxed">{exp.resumenEn}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {educacionesEn.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Education</h2>
              <div className="space-y-5">
                {educacionesEn.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-slate-800 pl-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-white font-semibold">{edu.tituloEn}</h3>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatMonth(edu.fechaInicio)} – {edu.enCurso ? "Present" : edu.fechaFin ? formatMonth(edu.fechaFin) : ""}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{edu.institucion}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {experienciasEn.length === 0 && educacionesEn.length === 0 && !perfil?.bioLargaEn && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-2">The English version of this CV isn&apos;t ready yet.</p>
              <p className="text-slate-500 text-sm">
                Please check{" "}
                <Link href="/trayectoria" className="text-indigo-400 hover:text-indigo-300">
                  the Spanish version
                </Link>{" "}
                or{" "}
                <Link href="/contacto" className="text-indigo-400 hover:text-indigo-300">
                  get in touch
                </Link>
                .
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-10">
              <h2 className="text-2xl font-bold text-white mb-3">Looking for this profile on your team?</h2>
              <p className="text-slate-400 mb-6">
                Available for remote roles or focused consulting engagements.
              </p>
              <Link
                href="/contacto"
                className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
              >
                Let&apos;s talk
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hleon.dev
          </Link>
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} Héctor León</p>
        </div>
      </footer>
    </div>
  );
}
