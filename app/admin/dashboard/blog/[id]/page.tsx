"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
  const [loading, setLoading] = useState(true);
  const [slugManual, setSlugManual] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((post) => {
        if (!post) { router.push("/admin/dashboard/blog"); return; }
        setForm({
          titulo: post.titulo,
          slug: post.slug,
          resumen: post.resumen,
          contenido: post.contenido,
          categoria: post.categoria,
          tags: (post.tags as string[]).join(", "),
          metaDescripcion: post.metaDescripcion,
          fechaPublicacion: post.fechaPublicacion.split("T")[0],
          publicado: post.publicado,
        });
        setLoading(false);
      });
  }, [id, router]);

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
      id,
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      metaDescripcion: form.metaDescripcion || form.resumen,
      fechaPublicacion: new Date(form.fechaPublicacion).toISOString(),
    };
    const res = await fetch("/api/admin/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setMsg("Guardado correctamente.");
      setTimeout(() => router.push("/admin/dashboard/blog"), 800);
    } else {
      setMsg("Error al guardar.");
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-slate-400 text-sm">Cargando artículo...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard/blog" className="text-slate-500 hover:text-white text-sm transition-colors">
          ← Blog
        </Link>
        <h1 className="text-2xl font-bold text-white">Editar artículo</h1>
        {form.publicado ? (
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            Publicado
          </span>
        ) : (
          <span className="text-xs bg-slate-700 text-slate-400 border border-slate-600 px-2.5 py-0.5 rounded-full">
            Borrador
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Slug <span className="text-slate-500 font-normal">(URL amigable)</span>
          </label>
          <div className="flex gap-2 items-center">
            <span className="text-slate-500 text-sm shrink-0">/blog/</span>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={`${inputClass} flex-1`}
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Resumen *</label>
          <textarea
            value={form.resumen}
            onChange={(e) => setForm((f) => ({ ...f, resumen: e.target.value }))}
            required
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Contenido * <span className="text-slate-500 font-normal">(Markdown)</span>
          </label>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-3 mb-2 text-xs text-slate-500 font-mono">
            ## H2 &nbsp;&nbsp; ### H3 &nbsp;&nbsp; **negrita** &nbsp;&nbsp; *cursiva* &nbsp;&nbsp; - lista &nbsp;&nbsp; `código`
          </div>
          <textarea
            value={form.contenido}
            onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
            required
            rows={20}
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
          />
        </div>

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

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Tags <span className="text-slate-500 font-normal">(separados por coma)</span>
          </label>
          <input
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Meta descripción SEO <span className="text-slate-500 font-normal">(máx. 160 caracteres)</span>
          </label>
          <textarea
            value={form.metaDescripcion}
            onChange={(e) => setForm((f) => ({ ...f, metaDescripcion: e.target.value }))}
            rows={2}
            maxLength={160}
            className={`${inputClass} resize-none`}
          />
          <p className="text-slate-600 text-xs mt-1">{form.metaDescripcion.length}/160 caracteres</p>
        </div>

        <div className="flex items-center gap-3 py-3 border-t border-slate-800">
          <input
            type="checkbox"
            id="publicado"
            checked={form.publicado}
            onChange={(e) => setForm((f) => ({ ...f, publicado: e.target.checked }))}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500"
          />
          <label htmlFor="publicado" className="text-slate-300 text-sm">Publicado</label>
        </div>

        {msg && (
          <div className={`border rounded-xl px-4 py-3 text-sm ${
            msg.includes("Error")
              ? "bg-red-500/10 border-red-500/20 text-red-300"
              : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
          }`}>
            {msg}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-all text-sm"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          {form.slug && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm transition-all flex items-center"
            >
              Ver ↗
            </a>
          )}
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
