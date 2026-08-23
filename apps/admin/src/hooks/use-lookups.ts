import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Categoria, Tecnologia } from "@/types/api";

/**
 * Datos maestro compartidos (Categoria, Tecnologia) - consumidos hoy por
 * el formulario de Proyectos y, sin cambios, por Experience/Blog/
 * Servicios cuando existan (misma tabla, mismo endpoint).
 */
export function useCategorias(tipo?: "proyecto" | "blog" | "servicio") {
  return useQuery({
    queryKey: ["categorias", tipo],
    queryFn: () => api.get<{ data: Categoria[] }>(`/api/categorias${tipo ? `?tipo=${tipo}` : ""}`),
    select: (res) => res.data,
    staleTime: 5 * 60_000,
  });
}

export function useTecnologias() {
  return useQuery({
    queryKey: ["tecnologias"],
    queryFn: () => api.get<{ data: Tecnologia[] }>("/api/tecnologias"),
    select: (res) => res.data,
    staleTime: 5 * 60_000,
  });
}
