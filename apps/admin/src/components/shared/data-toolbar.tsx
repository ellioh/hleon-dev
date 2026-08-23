import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";

interface DataToolbarProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  placeholderBusqueda?: string;
  filtros?: ReactNode;
  onNuevo?: () => void;
  nuevoLabel?: string;
}

/**
 * Barra de listado reutilizable - búsqueda + slot de filtros + acción
 * "nuevo". El slot de filtros deja que cada módulo agregue sus propios
 * <Select> sin reimplementar el layout responsive.
 */
export function DataToolbar({
  busqueda,
  onBusquedaChange,
  placeholderBusqueda = "Buscar...",
  filtros,
  onNuevo,
  nuevoLabel = "Nuevo",
}: DataToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={busqueda} onChange={onBusquedaChange} placeholder={placeholderBusqueda} className="sm:max-w-xs" />
        {filtros && <div className="flex flex-wrap gap-2">{filtros}</div>}
      </div>
      {onNuevo && (
        <Button onClick={onNuevo} className="shrink-0">
          <Plus className="h-4 w-4" />
          {nuevoLabel}
        </Button>
      )}
    </div>
  );
}
