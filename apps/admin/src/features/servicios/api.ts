import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, Servicio, ServicioSummary } from "@/types/api";
import type { ServicioFormValues } from "@/features/servicios/servicio-schema";
import { seoFormToPayload } from "@/lib/seo-payload";

export interface ServicioFiltros {
  busqueda?: string;
  categoria_id?: number;
  visible?: boolean;
  papelera?: boolean;
  pagina?: number;
}

function construirQuery(filtros: ServicioFiltros): string {
  const params = new URLSearchParams();
  if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
  if (filtros.categoria_id) params.set("categoria_id", String(filtros.categoria_id));
  if (filtros.visible !== undefined) params.set("visible", String(filtros.visible));
  if (filtros.papelera) params.set("papelera", "1");
  if (filtros.pagina) params.set("page", String(filtros.pagina));
  return params.toString();
}

function aPayload(datos: ServicioFormValues) {
  return { ...datos, seo: seoFormToPayload(datos.seo) };
}

export function useServicios(filtros: ServicioFiltros) {
  return useQuery({
    queryKey: ["servicios", filtros],
    queryFn: () => api.get<PaginatedResponse<ServicioSummary>>(`/api/admin/servicios?${construirQuery(filtros)}`),
    placeholderData: (prev) => prev,
  });
}

export function useServicio(id: number | undefined) {
  return useQuery({
    queryKey: ["servicio", id],
    queryFn: () => api.get<{ data: Servicio }>(`/api/admin/servicios/${id}`),
    select: (res) => res.data,
    enabled: id !== undefined,
  });
}

function useInvalidarServicios() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["servicios"] });
}

export function useCrearServicio() {
  const invalidar = useInvalidarServicios();
  return useMutation({
    mutationFn: (datos: ServicioFormValues) => api.post<{ data: Servicio }>("/api/admin/servicios", aPayload(datos)),
    onSuccess: invalidar,
  });
}

export function useActualizarServicio(id: number) {
  const invalidar = useInvalidarServicios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: ServicioFormValues) => api.put<{ data: Servicio }>(`/api/admin/servicios/${id}`, aPayload(datos)),
    onSuccess: () => {
      invalidar();
      queryClient.invalidateQueries({ queryKey: ["servicio", id] });
    },
  });
}

/** Sin endpoint de publicar/despublicar (Servicio no tiene ese flujo, ver ADR) - `visible` se cambia con un PUT parcial normal. */
export function useCambiarVisibilidadServicio() {
  const invalidar = useInvalidarServicios();
  return useMutation({
    mutationFn: ({ id, visible }: { id: number; visible: boolean }) =>
      api.put<{ data: Servicio }>(`/api/admin/servicios/${id}`, { visible }),
    onSuccess: invalidar,
  });
}

export function useEliminarServicio() {
  const invalidar = useInvalidarServicios();
  return useMutation({
    mutationFn: (id: number) => api.del(`/api/admin/servicios/${id}`),
    onSuccess: invalidar,
  });
}

export function useRestaurarServicio() {
  const invalidar = useInvalidarServicios();
  return useMutation({
    mutationFn: (id: number) => api.post(`/api/admin/servicios/${id}/restaurar`),
    onSuccess: invalidar,
  });
}
