"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    empresa: "",
    tipo: "",
    descripcion: "",
    presupuesto: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.msg ?? "Error al enviar el formulario.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Inténtalo de nuevo.");
    }
  }

  const inputClass =
    "w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all";

  if (status === "success") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">¡Mensaje enviado!</h1>
          <p className="text-slate-400 mb-8">
            Gracias por contactarme. Te responderé en menos de 24 horas con una evaluación inicial de tu proyecto.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              hleon.dev
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              ← Volver
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">
              Cuéntame tu{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                proyecto
              </span>
            </h1>
            <p className="text-slate-400 text-lg">
              Completa el formulario y te respondo en menos de 24 horas con una evaluación gratuita. Sin compromiso.
            </p>
          </div>

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="text-white text-sm font-medium">Respuesta en 24h</div>
                <div className="text-slate-400 text-xs">Evaluación inicial gratuita de tu proyecto</div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <div className="text-white text-sm font-medium">Confidencialidad garantizada</div>
                <div className="text-xs text-slate-400">Tu información está segura y protegida</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Nombre completo <span className="text-indigo-400">*</span>
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Carlos Mendoza"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Correo electrónico <span className="text-indigo-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@empresa.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Empresa <span className="text-slate-500">(opcional)</span>
              </label>
              <input
                name="empresa"
                value={form.empresa}
                onChange={handleChange}
                placeholder="Nombre de tu empresa"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Tipo de sistema <span className="text-indigo-400">*</span>
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="" disabled>Selecciona el tipo de sistema...</option>
                <option value="ERP">ERP / Gestión empresarial</option>
                <option value="CRM">CRM / Gestión de clientes</option>
                <option value="E-commerce">E-commerce / Tienda online</option>
                <option value="API/Integración">API / Integración de sistemas</option>
                <option value="Plataforma web">Plataforma web</option>
                <option value="Automatización">Automatización de procesos</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Descripción del proyecto <span className="text-indigo-400">*</span>
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Cuéntame qué necesitas: qué procesos quieres mejorar, qué problema quieres resolver, qué funcionalidades son importantes..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Presupuesto aproximado
              </label>
              <select
                name="presupuesto"
                value={form.presupuesto}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Prefiero no especificar</option>
                <option value="Menos de $2,000">Menos de $2,000</option>
                <option value="$2,000 - $5,000">$2,000 — $5,000</option>
                <option value="$5,000 - $10,000">$5,000 — $10,000</option>
                <option value="$10,000 - $25,000">$10,000 — $25,000</option>
                <option value="Más de $25,000">Más de $25,000</option>
              </select>
              <p className="text-slate-500 text-xs mt-1.5">
                El presupuesto es orientativo. Lo discutiremos en detalle según el alcance real del proyecto.
              </p>
            </div>

            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-base transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              {status === "loading" ? "Enviando..." : "Enviar solicitud"}
            </button>

            <p className="text-slate-500 text-xs text-center">
              Al enviar aceptas que me contacte para evaluar tu proyecto. Sin spam, sin newsletters.
            </p>
          </form>

          {/* Alternative contact */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              ¿Prefieres escribirme directo?{" "}
              <a href="mailto:hector@hleon.dev" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                hector@hleon.dev
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
