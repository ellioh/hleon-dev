"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/admin/dashboard");
      } else {
        setStatus("error");
        setErrorMsg(data.msg ?? "Contraseña incorrecta.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            hleon.dev
          </span>
          <h1 className="text-xl font-semibold text-white mt-2">Panel de administración</h1>
          <p className="text-slate-400 text-sm mt-1">Ingresa tu contraseña para acceder</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>
            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-all"
            >
              {status === "loading" ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
