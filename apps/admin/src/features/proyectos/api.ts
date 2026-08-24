import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, Proyecto, ProyectoSummary } from "@/types/api";
import type { ProyectoFormValues } from "@/features/proyectos/proyecto-schema";
import { seoFormToPayload } from "@/lib/seo-payload";

export interface ProyectoFiltros {
  busqueda?: string;
  categoria_id?: number;
  estado?: string;
  estado_publicacion?: string;
  destacado?: boolean;
  papelera?: boolean;
  pagina?: number;
}

function construirQuery(filtros: ProyectoFiltros): string {
  const params = new URLSearchParams();
  if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
  if (filtros.categoria_id) params.set("categoria_id", String(filtros.categoria_id));
  if (filtros.estado) params.set("estado", filtros.estado);
  if (filtros.estado_publicacion) params.set("estado_publicacion", filtros.estado_publicacion);
  if (filtros.destacado !== undefined) params.set("destacado", String(filtros.destacado));
  if (filtros.papelera) params.set("papelera", "1");
  if (filtros.pagina) params.set("page", String(filtros.pagina));
  return params.toString();
}

/** Traduce el formulario (camelCase en `seo`) al payload que espera Laravel (snake_case en `seo`, ver seo-payload.ts). */
function aPayload(datos: ProyectoFormValues) {
  return { ...datos, seo: seoFormToPayload(datos.seo) };
}

export function useProyectos(filtros: ProyectoFiltros) {
  return useQuery({
    queryKey: ["proyectos", filtros],
    queryFn: () => api.get<PaginatedResponse<ProyectoSummary>>(`/api/admin/proyectos?${construirQuery(filtros)}`),
    placeholderData: (prev) => prev,
  });
}

export function useProyecto(id: number | undefined) {
  return useQuery({
    queryKey: ["proyecto", id],
    queryFn: () => api.get<{ data: Proyecto }>(`/api/admin/proyectos/${id}`),
    select: (res) => res.data,
    enabled: id !== undefined,
  });
}

function useInvalidarProyectos() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["proyectos"] });
}

export function useCrearProyecto() {
  const invalidar = useInvalidarProyectos();
  return useMutation({
    mutationFn: (datos: ProyectoFormValues) => api.post<{ data: Proyecto }>("/api/admin/proyectos", aPayload(datos)),
    onSuccess: invalidar,
  });
}

export function useActualizarProyecto(id: number) {
  const invalidar = useInvalidarProyectos();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: ProyectoFormValues) => api.put<{ data: Proyecto }>(`/api/admin/proyectos/${id}`, aPayload(datos)),
    onSuccess: () => {
      invalidar();
      queryClient.invalidateQueries({ queryKey: ["proyecto", id] });
    },
  });
}

export function useEliminarProyecto() {
  const invalidar = useInvalidarProyectos();
  return useMutation({
    mutationFn: (id: number) => api.del(`/api/admin/proyectos/${id}`),
    onSuccess: invalidar,
  });
}

export function useRestaurarProyecto() {
  const invalidar = useInvalidarProyectos();
  return useMutation({
    mutationFn: (id: number) => api.post(`/api/admin/proyectos/${id}/restaurar`),
    onSuccess: invalidar,
  });
}

export function useCambiarPublicacion() {
  const invalidar = useInvalidarProyectos();
  return useMutation({
    mutationFn: ({ id, publicar }: { id: number; publicar: boolean }) =>
      api.post(`/api/admin/proyectos/${id}/${publicar ? "publicar" : "despublicar"}`),
    onSuccess: invalidar,
  });
}

export function useSincronizarGaleria(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaIds: number[]) => api.put<{ data: Proyecto }>(`/api/admin/proyectos/${id}/galeria`, { media_ids: mediaIds }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proyecto", id] }),
  });
}
