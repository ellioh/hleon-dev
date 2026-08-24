import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Experiencia } from "@/types/api";
import type { ExperienciaFormValues } from "@/features/experiencia/experiencia-schema";

export interface ExperienciaFiltros {
  busqueda?: string;
  estado_publicacion?: string;
  destacado?: boolean;
  papelera?: boolean;
}

function construirQuery(filtros: ExperienciaFiltros): string {
  const params = new URLSearchParams();
  if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
  if (filtros.estado_publicacion) params.set("estado_publicacion", filtros.estado_publicacion);
  if (filtros.destacado !== undefined) params.set("destacado", String(filtros.destacado));
  if (filtros.papelera) params.set("papelera", "1");
  return params.toString();
}

/** Sin paginación (ver ExperienciaRepository) - `useProyectos` pagina, este no. */
export function useExperiencias(filtros: ExperienciaFiltros) {
  return useQuery({
    queryKey: ["experiencias", filtros],
    queryFn: () => api.get<{ data: Experiencia[] }>(`/api/admin/experiencias?${construirQuery(filtros)}`),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
  });
}

export function useExperiencia(id: number | undefined) {
  return useQuery({
    queryKey: ["experiencia", id],
    queryFn: () => api.get<{ data: Experiencia }>(`/api/admin/experiencias/${id}`),
    select: (res) => res.data,
    enabled: id !== undefined,
  });
}

function useInvalidarExperiencias() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["experiencias"] });
}

export function useCrearExperiencia() {
  const invalidar = useInvalidarExperiencias();
  return useMutation({
    mutationFn: (datos: ExperienciaFormValues) => api.post<{ data: Experiencia }>("/api/admin/experiencias", datos),
    onSuccess: invalidar,
  });
}

export function useActualizarExperiencia(id: number) {
  const invalidar = useInvalidarExperiencias();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: ExperienciaFormValues) => api.put<{ data: Experiencia }>(`/api/admin/experiencias/${id}`, datos),
    onSuccess: () => {
      invalidar();
      queryClient.invalidateQueries({ queryKey: ["experiencia", id] });
    },
  });
}

export function useEliminarExperiencia() {
  const invalidar = useInvalidarExperiencias();
  return useMutation({
    mutationFn: (id: number) => api.del(`/api/admin/experiencias/${id}`),
    onSuccess: invalidar,
  });
}

export function useRestaurarExperiencia() {
  const invalidar = useInvalidarExperiencias();
  return useMutation({
    mutationFn: (id: number) => api.post(`/api/admin/experiencias/${id}/restaurar`),
    onSuccess: invalidar,
  });
}

export function useCambiarPublicacionExperiencia() {
  const invalidar = useInvalidarExperiencias();
  return useMutation({
    mutationFn: ({ id, publicar }: { id: number; publicar: boolean }) =>
      api.post(`/api/admin/experiencias/${id}/${publicar ? "publicar" : "despublicar"}`),
    onSuccess: invalidar,
  });
}
