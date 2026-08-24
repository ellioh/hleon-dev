import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse, Post, PostSummary } from "@/types/api";
import type { PostFormValues } from "@/features/blog/post-schema";
import { seoFormToPayload } from "@/lib/seo-payload";

export interface PostFiltros {
  busqueda?: string;
  categoria_id?: number;
  tipo_audiencia?: string;
  publicado?: boolean;
  papelera?: boolean;
  pagina?: number;
}

function construirQuery(filtros: PostFiltros): string {
  const params = new URLSearchParams();
  if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
  if (filtros.categoria_id) params.set("categoria_id", String(filtros.categoria_id));
  if (filtros.tipo_audiencia) params.set("tipo_audiencia", filtros.tipo_audiencia);
  if (filtros.publicado !== undefined) params.set("publicado", String(filtros.publicado));
  if (filtros.papelera) params.set("papelera", "1");
  if (filtros.pagina) params.set("page", String(filtros.pagina));
  return params.toString();
}

/** Traduce el formulario (camelCase en `seo`) al payload que espera Laravel (snake_case en `seo`, ver lib/seo-payload.ts). */
function aPayload(datos: PostFormValues) {
  return { ...datos, seo: seoFormToPayload(datos.seo) };
}

export function usePosts(filtros: PostFiltros) {
  return useQuery({
    queryKey: ["posts", filtros],
    queryFn: () => api.get<PaginatedResponse<PostSummary>>(`/api/admin/posts?${construirQuery(filtros)}`),
    placeholderData: (prev) => prev,
  });
}

export function usePost(id: number | undefined) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => api.get<{ data: Post }>(`/api/admin/posts/${id}`),
    select: (res) => res.data,
    enabled: id !== undefined,
  });
}

function useInvalidarPosts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["posts"] });
}

export function useCrearPost() {
  const invalidar = useInvalidarPosts();
  return useMutation({
    mutationFn: (datos: PostFormValues) => api.post<{ data: Post }>("/api/admin/posts", aPayload(datos)),
    onSuccess: invalidar,
  });
}

export function useActualizarPost(id: number) {
  const invalidar = useInvalidarPosts();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: PostFormValues) => api.put<{ data: Post }>(`/api/admin/posts/${id}`, aPayload(datos)),
    onSuccess: () => {
      invalidar();
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });
}

export function useEliminarPost() {
  const invalidar = useInvalidarPosts();
  return useMutation({
    mutationFn: (id: number) => api.del(`/api/admin/posts/${id}`),
    onSuccess: invalidar,
  });
}

export function useRestaurarPost() {
  const invalidar = useInvalidarPosts();
  return useMutation({
    mutationFn: (id: number) => api.post(`/api/admin/posts/${id}/restaurar`),
    onSuccess: invalidar,
  });
}

export function useCambiarPublicacionPost() {
  const invalidar = useInvalidarPosts();
  return useMutation({
    mutationFn: ({ id, publicar }: { id: number; publicar: boolean }) =>
      api.post(`/api/admin/posts/${id}/${publicar ? "publicar" : "despublicar"}`),
    onSuccess: invalidar,
  });
}
