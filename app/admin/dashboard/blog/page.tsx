"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  publicado: boolean;
  fechaPublicacion: string;
  resumen: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    setPosts(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function togglePublicado(post: Post) {
    await fetch("/api/admin/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, publicado: !post.publicado }),
    });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-slate-400 text-sm mt-1">
            {posts.length} {posts.length === 1 ? "artículo" : "artículos"} ·{" "}
            {posts.filter((p) => p.publicado).length} publicados
          </p>
        </div>
        <Link
          href="/admin/dashboard/blog/nuevo"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          + Nuevo artículo
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Cargando...</div>
      ) : posts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <p className="text-lg mb-2">Aún no hay artículos.</p>
          <Link
            href="/admin/dashboard/blog/nuevo"
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-white font-medium text-sm">{p.titulo}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      p.publicado
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-700/50 text-slate-400 border-slate-700"
                    }`}
                  >
                    {p.publicado ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <div className="text-slate-400 text-xs flex items-center gap-2 flex-wrap">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    {p.categoria}
                  </span>
                  <span>·</span>
                  <span>
                    {new Date(p.fechaPublicacion).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span className="text-slate-500 font-mono text-xs">/blog/{p.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <a
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                >
                  Ver
                </a>
                <button
                  onClick={() => togglePublicado(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                    p.publicado
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {p.publicado ? "Despublicar" : "Publicar"}
                </button>
                <Link
                  href={`/admin/dashboard/blog/${p.id}`}
                  className="text-xs px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.titulo)}
                  className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
