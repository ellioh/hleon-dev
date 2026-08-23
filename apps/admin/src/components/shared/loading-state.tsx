import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton de filas de tabla - reutilizable por cualquier listado mientras carga. */
export function TableLoadingState({ filas = 5, columnas = 5 }: { filas?: number; columnas?: number }) {
  return (
    <div className="space-y-2 p-4" role="status" aria-label="Cargando datos">
      {Array.from({ length: filas }).map((_, fila) => (
        <div key={fila} className="flex gap-4">
          {Array.from({ length: columnas }).map((_, col) => (
            <Skeleton key={col} className="h-8 flex-1" />
          ))}
        </div>
      ))}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

/** Skeleton genérico de bloque - formularios, tarjetas, detalle. */
export function BlockLoadingState({ lineas = 4 }: { lineas?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Cargando">
      {Array.from({ length: lineas }).map((_, i) => (
        <Skeleton key={i} className={i === 0 ? "h-6 w-1/3" : "h-4 w-full"} />
      ))}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
