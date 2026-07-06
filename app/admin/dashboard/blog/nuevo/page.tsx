"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const CATEGORIAS = ["ERP", "CRM", "APIs", "E-commerce", "Consultoría", "Automatización", "Desarrollo Web", "General"];

const inputClass =
  "w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all";

export default function NuevoPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    resumen: "",
    contenido: "",
    categoria: "General",
    tags: "",
    metaDescripcion: "",
    fechaPublicacion: new Date().toISOString().split("T")[0],
    publicado: false,
  });
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function handleTitulo(titulo: string) {
    setForm((f) => ({
      ...f,
      titulo,
      slug: slugManual ? f.slug : slugify(titulo),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo || !form.contenido || !form.resumen) {
      setMsg("Completa los campos obligatorios.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      metaDescripcion: form.metaDescripcion || form.resumen,
      fechaPublicacion: new Date(form.fechaPublicacion).toISOString(),
    };
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/admin/dashboard/blog");
    } else {
      setMsg("Error al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard/blog" className="text-slate-500 hover:text-white text-sm transition-colors">
          ← Blog
        </Link>
        <h1 className="text-2xl font-bold text-white">Nuevo artículo</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Título *</label>
          <input
            value={form.titulo}
            onChange={(e) => handleTitulo(e.target.value)}
            required
            className={inputClass}
            placeholder="Título del artículo"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Slug{" "}
            <span className="text-slate-500 font-normal">(URL amigable)</span>
          </label>
          <div className="flex gap-2 items-center">
            <span className="text-slate-500 text-sm shrink-0">/blog/</span>
            <input
              value={form.slug}
              onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
              className={`${inputClass} flex-1`}
              placeholder="slug-del-articulo"
            />
          </div>
        </div>

        {/* Resumen */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Resumen *</label>
          <textarea
            value={form.resumen}
            onChange={(e) => setForm((f) => ({ ...f, resumen: e.target.value }))}
            required
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Breve descripción del artículo (aparece en la lista y como meta description)"
          />
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Contenido * <span className="text-slate-500 font-normal">(Markdown)</span>
          </label>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-3 mb-2 text-xs text-slate-500 font-mono">
            ## Título H2 &nbsp;&nbsp; ### Título H3 &nbsp;&nbsp; **negrita** &nbsp;&nbsp; *cursiva* &nbsp;&nbsp; - lista &nbsp;&nbsp; `código`
          </div>
          <textarea
            value={form.contenido}
            onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
            required
            rows={20}
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
            placeholder={"## Introducción\n\nEscribe aquí el contenido del artículo en Markdown.\n\n## Segundo apartado\n\n- Item de lista\n- Otro item"}
          />
        </div>

        {/* Categoría y Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
              className={inputClass}
            >
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Fecha de publicación</label>
            <input
              type="date"
              value={form.fechaPublicacion}
              onChange={(e) => setForm((f) => ({ ...f, fechaPublicacion: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Tags <span className="text-slate-500 font-normal">(separados por coma)</span>
          </label>
          <input
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            className={inputClass}
            placeholder="erp, pyme, sistemas, digitalización"
          />
        </div>

        {/* Meta descripción */}
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Meta descripción SEO <span className="text-slate-500 font-normal">(opcional, máx. 160 caracteres)</span>
          </label>
          <textarea
            value={form.metaDescripcion}
            onChange={(e) => setForm((f) => ({ ...f, metaDescripcion: e.target.value }))}
            rows={2}
            maxLength={160}
            className={`${inputClass} resize-none`}
            placeholder="Descripción para Google. Si está vacía, se usa el resumen."
          />
          <p className="text-slate-600 text-xs mt-1">{form.metaDescripcion.length}/160 caracteres</p>
        </div>

        {/* Publicado */}
        <div className="flex items-center gap-3 py-3 border-t border-slate-800">
          <input
            type="checkbox"
            id="publicado"
            checked={form.publicado}
            onChange={(e) => setForm((f) => ({ ...f, publicado: e.target.checked }))}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500"
          />
          <label htmlFor="publicado" className="text-slate-300 text-sm">
            Publicar inmediatamente
            <span className="text-slate-500 ml-2">(si no, se guarda como borrador)</span>
          </label>
        </div>

        {msg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-3 text-sm">
            {msg}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-all text-sm"
          >
            {saving ? "Guardando..." : "Crear artículo"}
          </button>
          <Link
            href="/admin/dashboard/blog"
            className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm transition-all flex items-center"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
