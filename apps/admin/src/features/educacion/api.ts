import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Educacion } from "@/types/api";
import type { EducacionFormValues } from "@/features/educacion/educacion-schema";

export interface EducacionFiltros {
  busqueda?: string;
  visible?: boolean;
  papelera?: boolean;
}

function construirQuery(filtros: EducacionFiltros): string {
  const params = new URLSearchParams();
  if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
  if (filtros.visible !== undefined) params.set("visible", String(filtros.visible));
  if (filtros.papelera) params.set("papelera", "1");
  return params.toString();
}

/** Sin paginación (ver EducacionRepository) - mismo criterio que Certificacion/Experiencia. */
export function useEducaciones(filtros: EducacionFiltros) {
  return useQuery({
    queryKey: ["educaciones", filtros],
    queryFn: () => api.get<{ data: Educacion[] }>(`/api/admin/educaciones?${construirQuery(filtros)}`),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
  });
}

export function useEducacion(id: number | undefined) {
  return useQuery({
    queryKey: ["educacion", id],
    queryFn: () => api.get<{ data: Educacion }>(`/api/admin/educaciones/${id}`),
    select: (res) => res.data,
    enabled: id !== undefined,
  });
}

function useInvalidarEducaciones() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["educaciones"] });
}

export function useCrearEducacion() {
  const invalidar = useInvalidarEducaciones();
  return useMutation({
    mutationFn: (datos: EducacionFormValues) => api.post<{ data: Educacion }>("/api/admin/educaciones", datos),
    onSuccess: invalidar,
  });
}

export function useActualizarEducacion(id: number) {
  const invalidar = useInvalidarEducaciones();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EducacionFormValues) => api.put<{ data: Educacion }>(`/api/admin/educaciones/${id}`, datos),
    onSuccess: () => {
      invalidar();
      queryClient.invalidateQueries({ queryKey: ["educacion", id] });
    },
  });
}

/** Sin endpoint dedicado de visibilidad (igual que Certificacion) - `visible` se cambia con un PUT parcial normal. */
export function useCambiarVisibilidadEducacion() {
  const invalidar = useInvalidarEducaciones();
  return useMutation({
    mutationFn: ({ id, visible }: { id: number; visible: boolean }) =>
      api.put<{ data: Educacion }>(`/api/admin/educaciones/${id}`, { visible }),
    onSuccess: invalidar,
  });
}

export function useEliminarEducacion() {
  const invalidar = useInvalidarEducaciones();
  return useMutation({
    mutationFn: (id: number) => api.del(`/api/admin/educaciones/${id}`),
    onSuccess: invalidar,
  });
}

export function useRestaurarEducacion() {
  const invalidar = useInvalidarEducaciones();
  return useMutation({
    mutationFn: (id: number) => api.post(`/api/admin/educaciones/${id}/restaurar`),
    onSuccess: invalidar,
  });
}
