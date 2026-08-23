import * as React from "react";
import { api, ApiError, resetCsrf } from "@/lib/api";
import type { Usuario } from "@/types/api";

interface AuthContextValue {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = React.useState<Usuario | null>(null);
  const [cargando, setCargando] = React.useState(true);

  React.useEffect(() => {
    // AuthController devuelve el modelo User plano (sin envoltorio
    // {data:...} - no usa un JsonResource, ver backend/laravel Fase 1).
    api
      .get<Usuario>("/api/auth/me")
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post<Usuario>("/api/auth/login", { email, password });
      setUsuario(data);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("No se pudo conectar con el servidor.", 0);
    }
  }, []);

  const logout = React.useCallback(async () => {
    await api.post("/api/auth/logout").catch(() => undefined);
    resetCsrf();
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
