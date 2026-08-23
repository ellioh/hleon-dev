import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        // 401/403/404/422 nunca se benefician de reintentar - solo errores
        // de red/servidor (5xx o sin status) valen la pena reintentar.
        if (error instanceof ApiError && error.status > 0 && error.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
