import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { DataToolbar } from "@/components/shared/data-toolbar";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCambiarVisibilidadEducacion,
  useEducaciones,
  useEliminarEducacion,
  useRestaurarEducacion,
  type EducacionFiltros,
} from "@/features/educacion/api";
import type { Educacion } from "@/types/api";
import { ApiError } from "@/lib/api";

export function EducacionesListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = React.useState<EducacionFiltros>({});
  const [porEliminar, setPorEliminar] = React.useState<Educacion | null>(null);

  const { data, isLoading, error, refetch } = useEducaciones(filtros);
  const cambiarVisibilidad = useCambiarVisibilidadEducacion();
  const eliminar = useEliminarEducacion();
  const restaurar = useRestaurarEducacion();

  async function alternarVisibilidad(educacion: Educacion) {
    try {
      await cambiarVisibilidad.mutateAsync({ id: educacion.id, visible: !educacion.visible });
      toast.success(educacion.visible ? "Educación oculta." : "Educación visible.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo cambiar la visibilidad.");
    }
  }

  async function confirmarEliminar() {
    if (!porEliminar) return;
    try {
      await eliminar.mutateAsync(porEliminar.id);
      toast.success(`"${porEliminar.titulo}" se movió a la papelera.`);
      setPorEliminar(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar el registro.");
    }
  }

  async function restaurarEducacion(educacion: Educacion) {
    try {
      await restaurar.mutateAsync(educacion.id);
      toast.success(`"${educacion.titulo}" fue restaurada.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo restaurar el registro.");
    }
  }

  const columnas: DataTableColumn<Educacion>[] = [
    {
      key: "titulo",
      header: "Estudio",
      render: (e) => (
        <div>
          <p className="font-medium text-foreground">{e.titulo}</p>
          <p className="text-xs text-muted-foreground">{e.institucion}</p>
        </div>
      ),
    },
    {
      key: "fechas",
      header: "Periodo",
      className: "hidden sm:table-cell",
      render: (e) => (
        <span className="text-sm text-muted-foreground">
          {e.fechaInicio} {e.enCurso ? "· En curso" : e.fechaFin ? `— ${e.fechaFin}` : ""}
        </span>
      ),
    },
    {
      key: "estado",
      header: "Estado",
      render: (e) => <StatusBadge estado={e.eliminadoEn ? "archivado" : e.visible ? "publicado" : "borrador"} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Educación</h1>
          <p className="text-sm text-muted-foreground">{data?.length ?? 0} en total</p>
        </div>
      </div>

      <DataToolbar
        busqueda={filtros.busqueda ?? ""}
        onBusquedaChange={(v) => setFiltros((prev) => ({ ...prev, busqueda: v || undefined }))}
        placeholderBusqueda="Buscar por institución o título..."
        onNuevo={filtros.papelera ? undefined : () => navigate("/educacion/nuevo")}
        nuevoLabel="Nuevo estudio"
        filtros={
          <Button
            variant={filtros.papelera ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFiltros((prev) => ({ ...prev, papelera: !prev.papelera }))}
          >
            {filtros.papelera ? "Viendo papelera" : "Ver papelera"}
          </Button>
        }
      />

      <DataTable
        columns={columnas}
        data={data ?? []}
        getRowId={(e) => e.id}
        loading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        emptyTitle={filtros.papelera ? "La papelera está vacía" : "Aún no hay estudios"}
        emptyDescription={filtros.papelera ? undefined : "Agrega el primero para mostrarlo en tu trayectoria."}
        actions={(e) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Acciones para ${e.titulo}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {e.eliminadoEn ? (
                <DropdownMenuItem onSelect={() => void restaurarEducacion(e)}>
                  <RotateCcw className="h-4 w-4" />
                  Restaurar
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/educacion/${e.id}`}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void alternarVisibilidad(e)}>
                    {e.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {e.visible ? "Ocultar" : "Mostrar"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => setPorEliminar(e)}>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <ConfirmDialog
        open={porEliminar !== null}
        onOpenChange={(open) => !open && setPorEliminar(null)}
        title="¿Eliminar este estudio?"
        description={`"${porEliminar?.titulo}" se moverá a la papelera. Podrás restaurarlo después.`}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={eliminar.isPending}
        onConfirm={() => void confirmarEliminar()}
      />
    </div>
  );
}
