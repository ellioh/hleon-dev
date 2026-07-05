"use client";

import { useEffect, useState } from "react";

interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  tecnologias: string[];
  categoria: string;
  imagen: string | null;
  url: string | null;
  destacado: boolean;
  orden: number;
}

const emptyForm = (): Omit<Proyecto, "id"> => ({
  titulo: "",
  descripcion: "",
  tecnologias: [],
  categoria: "ERP",
  imagen: null,
  url: null,
  destacado: false,
  orden: 99,
});

export default function ProyectosAdminPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Proyecto | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [tecInput, setTecInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/proyectos");
    const data = await res.json();
    setProyectos(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm());
    setTecInput("");
    setMsg("");
    setShowForm(true);
  }

  function openEdit(p: Proyecto) {
    setEditing(p);
    setForm({ ...p });
    setTecInput(p.tecnologias.join(", "));
    setMsg("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setMsg("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tecnologias: tecInput.split(",").map((t) => t.trim()).filter(Boolean) };
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...payload, id: editing.id } : payload;
    const res = await fetch("/api/admin/proyectos", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg("Guardado correctamente.");
      await load();
      setTimeout(() => closeForm(), 1000);
    } else {
      setMsg("Error al guardar.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await fetch("/api/admin/proyectos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function toggleDestacado(p: Proyecto) {
    await fetch("/api/admin/proyectos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, destacado: !p.destacado }),
    });
    await load();
  }

  const inputClass =
    "w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
          <p className="text-slate-400 text-sm mt-1">Gestiona tu portafolio</p>
        </div>
        <button
          onClick={openNew}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          + Nuevo proyecto
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-white font-semibold">{editing ? "Editar proyecto" : "Nuevo proyecto"}</h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Título *</label>
                <input
                  value={form.titulo}
                  onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                  required
                  className={inputClass}
                  placeholder="Nombre del proyecto"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Descripción *</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  required
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Breve descripción del proyecto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Categoría *</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="ERP">ERP</option>
                    <option value="CRM">CRM</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="API">API</option>
                    <option value="Plataforma web">Plataforma web</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Orden</label>
                  <input
                    type="number"
                    value={form.orden}
                    onChange={(e) => setForm((f) => ({ ...f, orden: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Tecnologías <span className="text-slate-500">(separadas por coma)</span>
                </label>
                <input
                  value={tecInput}
                  onChange={(e) => setTecInput(e.target.value)}
                  className={inputClass}
                  placeholder="Laravel, MySQL, Vue.js"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">URL del proyecto (opcional)</label>
                <input
                  value={form.url ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value || null }))}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="destacado"
                  checked={form.destacado}
                  onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500"
                />
                <label htmlFor="destacado" className="text-slate-300 text-sm">Mostrar como proyecto destacado</label>
              </div>
              {msg && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl px-4 py-3 text-sm">
                  {msg}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-all text-sm"
                >
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear proyecto"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="text-slate-400 text-sm">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {proyectos
            .sort((a, b) => a.orden - b.orden)
            .map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="text-2xl">
                  {p.categoria === "ERP" ? "🏭" : p.categoria === "CRM" ? "🤝" : p.categoria === "E-commerce" ? "🛒" : "💻"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-medium text-sm">{p.titulo}</span>
                    {p.destacado && (
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-xs flex items-center gap-2">
                    <span>{p.categoria}</span>
                    <span>·</span>
                    <span>{p.tecnologias.join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleDestacado(p)}
                    className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                    title={p.destacado ? "Quitar de destacados" : "Marcar como destacado"}
                  >
                    {p.destacado ? "★ Quitar" : "☆ Destacar"}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="text-xs px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
