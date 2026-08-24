import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Perfil } from "@/types/api";
import type { PerfilFormValues } from "@/features/perfil/perfil-schema";

/** `{data: null}` hasta que se guarde por primera vez - no es un error, es el estado esperado de un perfil nuevo. */
export function usePerfil() {
  return useQuery({
    queryKey: ["perfil"],
    queryFn: () => api.get<{ data: Perfil | null }>("/api/admin/perfil"),
    select: (res) => res.data,
  });
}

export function useGuardarPerfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: PerfilFormValues) => api.put<{ data: Perfil }>("/api/admin/perfil", datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["perfil"] }),
  });
}
