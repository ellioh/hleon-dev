import { getProyectos } from "@/lib/data";
import { getPosts } from "@/lib/blog";
import Link from "next/link";

// Actualiza estas URLs con tus perfiles reales
const SOCIAL = {
  upwork: "#", // "https://www.upwork.com/freelancers/~..."
  workana: "#", // "https://www.workana.com/freelancer/..."
  linkedin: "#", // "https://www.linkedin.com/in/..."
  github: "https://github.com/ellioh",
};

const services = [
  {
    icon: "🏭",
    title: "ERP / Gestión Empresarial",
    desc: "Sistemas integrales que unifican producción, inventario, finanzas y RRHH en una sola plataforma adaptada a tu empresa.",
  },
  {
    icon: "🤝",
    title: "CRM / Gestión de Clientes",
    desc: "Controla tu pipeline de ventas, historial de clientes, seguimiento de oportunidades y automatización de comunicaciones.",
  },
  {
    icon: "🛒",
    title: "E-commerce / Tiendas Online",
    desc: "Plataformas de venta online con catálogo, carrito, pagos integrados y gestión de pedidos en tiempo real.",
  },
  {
    icon: "🔌",
    title: "APIs e Integraciones",
    desc: "Conecta tus sistemas existentes con APIs REST, webhooks e integraciones con terceros como facturación electrónica, pasarelas de pago.",
  },
  {
    icon: "⚙️",
    title: "Automatización de Procesos",
    desc: "Elimina tareas manuales repetitivas con bots, scripts y flujos automatizados que ahorran tiempo y reducen errores.",
  },
  {
    icon: "💡",
    title: "Consultoría Técnica",
    desc: "Auditoría de sistemas existentes, arquitectura de soluciones, elección de tecnología y hoja de ruta de digitalización.",
  },
];

const steps = [
  {
    num: "01",
    title: "Análisis",
    desc: "Entendemos tu negocio, procesos actuales y objetivos. Definimos el alcance y los requerimientos del sistema.",
  },
  {
    num: "02",
    title: "Diseño",
    desc: "Arquitectura técnica, modelo de datos y wireframes. Presentamos una propuesta clara antes de escribir código.",
  },
  {
    num: "03",
    title: "Desarrollo",
    desc: "Desarrollo iterativo con entregas parciales. Te mantenemos informado del avance en todo momento.",
  },
  {
    num: "04",
    title: "Soporte",
    desc: "Capacitación, documentación y soporte post-lanzamiento. Tu sistema siempre funcionando.",
  },
];

const techs = [
  { name: "Laravel", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  { name: "Next.js", color: "bg-slate-500/10 text-slate-300 border-slate-500/20" },
  { name: "PHP", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  { name: "MySQL", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { name: "Python", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { name: "Vue.js", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { name: "TypeScript", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { name: "Redis", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  { name: "Docker", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  { name: "PostgreSQL", color: "bg-blue-600/10 text-blue-300 border-blue-600/20" },
  { name: "REST APIs", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  { name: "Linux/VPS", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
];

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Gerente General, Textiles del Norte SAC",
    text: "Héctor desarrolló nuestro sistema ERP desde cero. En 4 meses pasamos de hojas de cálculo caóticas a un sistema que controla producción, inventario y ventas en tiempo real. La inversión se recuperó en menos de 6 meses.",
    initials: "CM",
  },
  {
    name: "Ana Quispe",
    role: "Directora, Estudio Jurídico Quispe & Asociados",
    text: "El sistema de gestión de expedientes que nos entregó es exactamente lo que necesitábamos. Fácil de usar, rápido y nos ahorra horas de trabajo administrativo cada día. Muy profesional en todo el proceso.",
    initials: "AQ",
  },
  {
    name: "Roberto Flores",
    role: "CEO, Tiendas Moda Express",
    text: "Implementamos el sistema de punto de venta e inventario en nuestras 3 tiendas. La integración fue impecable y el soporte post-lanzamiento fue excelente. Lo recomiendo ampliamente.",
    initials: "RF",
  },
];

export default async function Home() {
  const proyectos = getProyectos();
  const destacados = proyectos.filter((p) => p.destacado).slice(0, 3);
  const recentPosts = getPosts().slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                hleon.dev
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#servicios" className="text-slate-400 hover:text-white text-sm transition-colors">
                Servicios
              </Link>
              <Link href="#portafolio" className="text-slate-400 hover:text-white text-sm transition-colors">
                Portafolio
              </Link>
              <Link href="#proceso" className="text-slate-400 hover:text-white text-sm transition-colors">
                Proceso
              </Link>
              <Link href="#tecnologias" className="text-slate-400 hover:text-white text-sm transition-colors">
                Tecnologías
              </Link>
              <Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">
                Blog
              </Link>
              <Link href="/portafolio" className="text-slate-400 hover:text-white text-sm transition-colors">
                Todos los proyectos
              </Link>
            </div>
            <Link
              href="/contacto"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              Solicitar proyecto
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm mb-8">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            Disponible para nuevos proyectos
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Transformo tus procesos en{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              sistemas que funcionan
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Desarrollo software empresarial a medida — ERP, CRM, plataformas web y APIs — para empresas que quieren
            dejar de perder tiempo en procesos manuales y empezar a escalar con tecnología.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Cuéntame tu proyecto
            </Link>
            <Link
              href="#portafolio"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all border border-slate-700 hover:border-slate-600"
            >
              Ver mi trabajo
            </Link>
          </div>

          {/* Social profiles */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-slate-800/60">
            <span className="text-slate-500 text-sm self-center">Encuéntrame en:</span>
            {SOCIAL.upwork !== "#" && (
              <a
                href={SOCIAL.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-900/30 border border-green-700/40 text-green-400 text-sm hover:bg-green-900/50 transition-all"
              >
                ↗ Upwork
              </a>
            )}
            {SOCIAL.workana !== "#" && (
              <a
                href={SOCIAL.workana}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/30 border border-blue-700/40 text-blue-400 text-sm hover:bg-blue-900/50 transition-all"
              >
                ↗ Workana
              </a>
            )}
            {SOCIAL.linkedin !== "#" && (
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-900/30 border border-sky-700/40 text-sky-400 text-sm hover:bg-sky-900/50 transition-all"
              >
                in LinkedIn
              </a>
            )}
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-sm hover:bg-slate-700 transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "10+", label: "Proyectos entregados" },
              { num: "5+", label: "Años de experiencia" },
              { num: "3", label: "Países atendidos" },
              { num: "100%", label: "Clientes satisfechos" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                  {s.num}
                </div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicios" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Qué puedo construir para ti
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Me especializo en sistemas empresariales robustos y escalables, diseñados para resolver problemas reales
              de tu negocio.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 group"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section id="portafolio" className="py-24 px-4 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Proyectos destacados</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Soluciones reales para empresas reales. Cada proyecto es construido con atención al detalle y pensando en
              la escalabilidad a largo plazo.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {destacados.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 group"
              >
                <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 flex items-center justify-center border-b border-slate-800">
                  <span className="text-4xl opacity-60">
                    {p.categoria === "ERP" ? "🏭" : p.categoria === "CRM" ? "🤝" : p.categoria === "E-commerce" ? "🛒" : "💻"}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                      {p.categoria}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {p.titulo}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.descripcion}</p>
                  <div className="flex flex-wrap gap-1.5">
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
                      className="inline-flex items-center gap-1 mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      Ver proyecto ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
            >
              Ver todos los proyectos →
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="proceso" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Cómo trabajo</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Un proceso claro y transparente, desde la primera conversación hasta el sistema en producción.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-500/40 to-transparent z-10" />
                )}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center relative">
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-3">
                    {s.num}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="tecnologias" className="py-24 px-4 bg-slate-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stack tecnológico</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Elijo la tecnología correcta para cada proyecto, priorizando robustez, rendimiento y facilidad de
              mantenimiento a largo plazo.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techs.map((t) => (
              <span
                key={t.name}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:scale-105 ${t.color}`}
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      {recentPosts.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Artículos recientes</h2>
                <p className="text-slate-400 max-w-xl">
                  Escribo sobre desarrollo de sistemas, digitalización y tecnología para empresas.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors shrink-0"
              >
                Ver todos los artículos →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full w-fit">
                    {post.categoria}
                  </span>
                  <h3 className="text-white font-semibold leading-snug group-hover:text-indigo-300 transition-colors">
                    {post.titulo}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{post.resumen}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
                    <time dateTime={post.fechaPublicacion}>
                      {new Date(post.fechaPublicacion).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">Leer →</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                Ver todos los artículos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Lo que dicen mis clientes</h2>
            <p className="text-slate-400">Resultados reales de empresas que confiaron en mi trabajo.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/20 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                ¿Listo para digitalizar tu empresa?
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                Cuéntame qué necesitas y en 24 horas te respondo con una evaluación inicial gratuita de tu proyecto.
                Sin compromisos, sin tecnicismos innecesarios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacto"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  Solicitar evaluación gratuita
                </Link>
                <a
                  href="mailto:hector@hleon.dev"
                  className="bg-slate-800/80 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-slate-700"
                >
                  hector@hleon.dev
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                hleon.dev
              </span>
              <p className="text-slate-500 text-sm mt-1">Héctor León — Desarrollo de Sistemas Empresariales</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link href="#servicios" className="hover:text-white transition-colors">Servicios</Link>
              <Link href="/portafolio" className="hover:text-white transition-colors">Portafolio</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="#proceso" className="hover:text-white transition-colors">Proceso</Link>
              <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
            </div>
            <div className="text-slate-600 text-sm">
              © {new Date().getFullYear()} Héctor León. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
