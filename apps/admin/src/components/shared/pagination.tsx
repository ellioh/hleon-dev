import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  paginaActual: number;
  ultimaPagina: number;
  total: number;
  onCambiarPagina: (pagina: number) => void;
}

/** Paginación reutilizable - consume la forma `meta` estándar de Laravel (current_page/last_page/total). */
export function Pagination({ paginaActual, ultimaPagina, total, onCambiarPagina }: PaginationProps) {
  if (ultimaPagina <= 1) return null;

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row"
      aria-label="Paginación"
    >
      <p className="text-sm text-muted-foreground">
        Página {paginaActual} de {ultimaPagina} · {total} en total
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual >= ultimaPagina}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
