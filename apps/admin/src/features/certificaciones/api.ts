import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Certificacion } from "@/types/api";
import type { CertificacionFormValues } from "@/features/certificaciones/certificacion-schema";

export interface CertificacionFiltros {
  busqueda?: string;
  visible?: boolean;
  papelera?: boolean;
}

function construirQuery(filtros: CertificacionFiltros): string {
  const params = new URLSearchParams();
  if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
  if (filtros.visible !== undefined) params.set("visible", String(filtros.visible));
  if (filtros.papelera) params.set("papelera", "1");
  return params.toString();
}

/** Sin paginación (ver CertificacionRepository) - mismo criterio que Experiencia. */
export function useCertificaciones(filtros: CertificacionFiltros) {
  return useQuery({
    queryKey: ["certificaciones", filtros],
    queryFn: () => api.get<{ data: Certificacion[] }>(`/api/admin/certificaciones?${construirQuery(filtros)}`),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
  });
}

export function useCertificacion(id: number | undefined) {
  return useQuery({
    queryKey: ["certificacion", id],
    queryFn: () => api.get<{ data: Certificacion }>(`/api/admin/certificaciones/${id}`),
    select: (res) => res.data,
    enabled: id !== undefined,
  });
}

function useInvalidarCertificaciones() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["certificaciones"] });
}

export function useCrearCertificacion() {
  const invalidar = useInvalidarCertificaciones();
  return useMutation({
    mutationFn: (datos: CertificacionFormValues) => api.post<{ data: Certificacion }>("/api/admin/certificaciones", datos),
    onSuccess: invalidar,
  });
}

export function useActualizarCertificacion(id: number) {
  const invalidar = useInvalidarCertificaciones();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CertificacionFormValues) => api.put<{ data: Certificacion }>(`/api/admin/certificaciones/${id}`, datos),
    onSuccess: () => {
      invalidar();
      queryClient.invalidateQueries({ queryKey: ["certificacion", id] });
    },
  });
}

/** Sin endpoint dedicado de visibilidad (igual que Servicio) - `visible` se cambia con un PUT parcial normal. */
export function useCambiarVisibilidadCertificacion() {
  const invalidar = useInvalidarCertificaciones();
  return useMutation({
    mutationFn: ({ id, visible }: { id: number; visible: boolean }) =>
      api.put<{ data: Certificacion }>(`/api/admin/certificaciones/${id}`, { visible }),
    onSuccess: invalidar,
  });
}

export function useEliminarCertificacion() {
  const invalidar = useInvalidarCertificaciones();
  return useMutation({
    mutationFn: (id: number) => api.del(`/api/admin/certificaciones/${id}`),
    onSuccess: invalidar,
  });
}

export function useRestaurarCertificacion() {
  const invalidar = useInvalidarCertificaciones();
  return useMutation({
    mutationFn: (id: number) => api.post(`/api/admin/certificaciones/${id}/restaurar`),
    onSuccess: invalidar,
  });
}
