import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, RotateCcw, Star, Trash2, Upload } from "lucide-react";
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
  useCambiarPublicacionExperiencia,
  useEliminarExperiencia,
  useExperiencias,
  useRestaurarExperiencia,
  type ExperienciaFiltros,
} from "@/features/experiencia/api";
import type { Experiencia } from "@/types/api";
import { ApiError } from "@/lib/api";

export function ExperienciasListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = React.useState<ExperienciaFiltros>({});
  const [porEliminar, setPorEliminar] = React.useState<Experiencia | null>(null);

  const { data, isLoading, error, refetch } = useExperiencias(filtros);
  const cambiarPublicacion = useCambiarPublicacionExperiencia();
  const eliminar = useEliminarExperiencia();
  const restaurar = useRestaurarExperiencia();

  async function alternarPublicacion(experiencia: Experiencia) {
    const publicar = experiencia.estadoPublicacion === "borrador";
    try {
      await cambiarPublicacion.mutateAsync({ id: experiencia.id, publicar });
      toast.success(publicar ? "Experiencia publicada." : "Experiencia despublicada.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo cambiar la publicación.");
    }
  }

  async function confirmarEliminar() {
    if (!porEliminar) return;
    try {
      await eliminar.mutateAsync(porEliminar.id);
      toast.success(`"${porEliminar.rol}" se movió a la papelera.`);
      setPorEliminar(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar la experiencia.");
    }
  }

  async function restaurarExperiencia(experiencia: Experiencia) {
    try {
      await restaurar.mutateAsync(experiencia.id);
      toast.success(`"${experiencia.rol}" fue restaurada.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo restaurar la experiencia.");
    }
  }

  const columnas: DataTableColumn<Experiencia>[] = [
    {
      key: "rol",
      header: "Experiencia",
      render: (e) => (
        <div>
          <p className="font-medium text-foreground">{e.rol}</p>
          <p className="text-xs text-muted-foreground">{e.organizacion?.nombre ?? "Sin organización"}</p>
        </div>
      ),
    },
    {
      key: "periodo",
      header: "Periodo",
      className: "hidden sm:table-cell",
      render: (e) => (
        <span className="text-sm text-muted-foreground">
          {e.fechaInicio} — {e.actual ? "Actual" : (e.fechaFin ?? "—")}
        </span>
      ),
    },
    {
      key: "modalidad",
      header: "Modalidad",
      className: "hidden lg:table-cell",
      render: (e) => <span className="text-sm text-muted-foreground capitalize">{e.modalidad}</span>,
    },
    {
      key: "destacado",
      header: "Destacado",
      className: "hidden md:table-cell",
      render: (e) => (e.destacado ? <Star className="h-4 w-4 fill-warning text-warning" aria-label="Destacado" /> : null),
    },
    {
      key: "estado",
      header: "Estado",
      render: (e) => <StatusBadge estado={e.eliminadoEn ? "archivado" : e.estadoPublicacion} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Experiencia</h1>
          <p className="text-sm text-muted-foreground">{data?.length ?? 0} en total</p>
        </div>
      </div>

      <DataToolbar
        busqueda={filtros.busqueda ?? ""}
        onBusquedaChange={(v) => setFiltros((prev) => ({ ...prev, busqueda: v || undefined }))}
        placeholderBusqueda="Buscar por rol o resumen..."
        onNuevo={filtros.papelera ? undefined : () => navigate("/experiencia/nuevo")}
        nuevoLabel="Nueva experiencia"
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
        emptyTitle={filtros.papelera ? "La papelera está vacía" : "Aún no hay experiencia registrada"}
        emptyDescription={filtros.papelera ? undefined : "Agrega tu primera experiencia laboral para construir tu trayectoria."}
        actions={(e) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Acciones para ${e.rol}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {e.eliminadoEn ? (
                <DropdownMenuItem onSelect={() => void restaurarExperiencia(e)}>
                  <RotateCcw className="h-4 w-4" />
                  Restaurar
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/experiencia/${e.id}`}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void alternarPublicacion(e)}>
                    <Upload className="h-4 w-4" />
                    {e.estadoPublicacion === "borrador" ? "Publicar" : "Despublicar"}
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
        title="¿Eliminar esta experiencia?"
        description={`"${porEliminar?.rol}" se moverá a la papelera. Podrás restaurarla después.`}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={eliminar.isPending}
        onConfirm={() => void confirmarEliminar()}
      />
    </div>
  );
}
