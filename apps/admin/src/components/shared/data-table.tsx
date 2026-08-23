import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableLoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  /** p.ej. "hidden md:table-cell" para ocultar en móvil - progressive disclosure, no scroll infinito de columnas. */
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (item: T) => string | number;
  actions?: (item: T) => ReactNode;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Tabla genérica reutilizable por cualquier módulo con listado paginado
 * (Experience, Blog, Servicios...) - el módulo solo define columnas y
 * acciones por fila, nunca reimplementa carga/error/vacío/scroll.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  actions,
  loading,
  error,
  onRetry,
  emptyTitle = "Sin resultados",
  emptyDescription,
}: DataTableProps<T>) {
  if (loading) return <TableLoadingState columnas={columns.length + (actions ? 1 : 0)} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (data.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.header}
            </TableHead>
          ))}
          {actions && (
            <TableHead className="text-right">
              <span className="sr-only">Acciones</span>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={getRowId(item)}>
            {columns.map((col) => (
              <TableCell key={col.key} className={cn(col.className)}>
                {col.render(item)}
              </TableCell>
            ))}
            {actions && <TableCell className="text-right">{actions(item)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
