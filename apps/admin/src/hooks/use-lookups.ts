import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Categoria, OrganizacionAdmin, Tecnologia, TipoOrganizacion } from "@/types/api";

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

/**
 * Solo admin (ver Admin\OrganizacionController) - a diferencia de
 * categorías/tecnologías, no expone `{data: [...]}` sino un array plano.
 * `tipo` filtra en el servidor (empleador/cliente también trae "ambos").
 */
export function useOrganizaciones(tipo?: TipoOrganizacion) {
  return useQuery({
    queryKey: ["organizaciones", tipo],
    queryFn: () => api.get<OrganizacionAdmin[]>(`/api/admin/organizaciones${tipo ? `?tipo=${tipo}` : ""}`),
    staleTime: 60_000,
  });
}

export function useCrearOrganizacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: { nombre: string; tipo: TipoOrganizacion; url?: string; rubro?: string }) =>
      api.post<OrganizacionAdmin>("/api/admin/organizaciones", datos),
    onSuccess: (nueva, variables) => {
      // Se escribe en caché al instante en vez de solo invalidar: si el
      // llamador selecciona `nueva.id` apenas se crea (ver
      // OrganizacionSelector), sin esto hay una carrera real entre "el
      // formulario ya apunta al id nuevo" y "la lista de opciones todavía
      // no lo incluye", y el <Select> se queda mostrando el placeholder
      // aunque el valor sea correcto. Se actualizan solo las cachés que
      // realmente deben incluirlo (sin filtro, y la del tipo creado) -
      // una lista filtrada por el otro tipo no debe ganarlo.
      const agregar = (old: OrganizacionAdmin[] | undefined) => (old ? [...old, nueva] : old);
      queryClient.setQueriesData<OrganizacionAdmin[]>({ queryKey: ["organizaciones", undefined] }, agregar);
      queryClient.setQueriesData<OrganizacionAdmin[]>({ queryKey: ["organizaciones", variables.tipo] }, agregar);
      queryClient.invalidateQueries({ queryKey: ["organizaciones"] });
    },
  });
}
