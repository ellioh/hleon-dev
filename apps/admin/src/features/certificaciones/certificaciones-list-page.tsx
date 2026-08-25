import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, MoreHorizontal, Pencil, RotateCcw, Star, Trash2 } from "lucide-react";
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
  useCambiarVisibilidadCertificacion,
  useCertificaciones,
  useEliminarCertificacion,
  useRestaurarCertificacion,
  type CertificacionFiltros,
} from "@/features/certificaciones/api";
import type { Certificacion } from "@/types/api";
import { ApiError } from "@/lib/api";

export function CertificacionesListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = React.useState<CertificacionFiltros>({});
  const [porEliminar, setPorEliminar] = React.useState<Certificacion | null>(null);

  const { data, isLoading, error, refetch } = useCertificaciones(filtros);
  const cambiarVisibilidad = useCambiarVisibilidadCertificacion();
  const eliminar = useEliminarCertificacion();
  const restaurar = useRestaurarCertificacion();

  async function alternarVisibilidad(certificacion: Certificacion) {
    try {
      await cambiarVisibilidad.mutateAsync({ id: certificacion.id, visible: !certificacion.visible });
      toast.success(certificacion.visible ? "Certificación oculta." : "Certificación visible.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo cambiar la visibilidad.");
    }
  }

  async function confirmarEliminar() {
    if (!porEliminar) return;
    try {
      await eliminar.mutateAsync(porEliminar.id);
      toast.success(`"${porEliminar.nombre}" se movió a la papelera.`);
      setPorEliminar(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar la certificación.");
    }
  }

  async function restaurarCertificacion(certificacion: Certificacion) {
    try {
      await restaurar.mutateAsync(certificacion.id);
      toast.success(`"${certificacion.nombre}" fue restaurada.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo restaurar la certificación.");
    }
  }

  const columnas: DataTableColumn<Certificacion>[] = [
    {
      key: "nombre",
      header: "Certificación",
      render: (c) => (
        <div>
          <p className="font-medium text-foreground">{c.nombre}</p>
          <p className="text-xs text-muted-foreground">{c.emisor}</p>
        </div>
      ),
    },
    {
      key: "fechas",
      header: "Vigencia",
      className: "hidden sm:table-cell",
      render: (c) => (
        <span className="text-sm text-muted-foreground">
          {c.fechaObtencion} {c.fechaExpiracion ? `— ${c.fechaExpiracion}` : "· No expira"}
        </span>
      ),
    },
    {
      key: "destacado",
      header: "Destacado",
      className: "hidden md:table-cell",
      render: (c) => (c.destacado ? <Star className="h-4 w-4 fill-warning text-warning" aria-label="Destacado" /> : null),
    },
    {
      key: "estado",
      header: "Estado",
      render: (c) => <StatusBadge estado={c.eliminadoEn ? "archivado" : c.visible ? "publicado" : "borrador"} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certificaciones</h1>
          <p className="text-sm text-muted-foreground">{data?.length ?? 0} en total</p>
        </div>
      </div>

      <DataToolbar
        busqueda={filtros.busqueda ?? ""}
        onBusquedaChange={(v) => setFiltros((prev) => ({ ...prev, busqueda: v || undefined }))}
        placeholderBusqueda="Buscar por nombre o emisor..."
        onNuevo={filtros.papelera ? undefined : () => navigate("/certificaciones/nuevo")}
        nuevoLabel="Nueva certificación"
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
        getRowId={(c) => c.id}
        loading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        emptyTitle={filtros.papelera ? "La papelera está vacía" : "Aún no hay certificaciones"}
        emptyDescription={filtros.papelera ? undefined : "Agrega la primera para mostrarla en tu trayectoria."}
        actions={(c) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Acciones para ${c.nombre}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {c.eliminadoEn ? (
                <DropdownMenuItem onSelect={() => void restaurarCertificacion(c)}>
                  <RotateCcw className="h-4 w-4" />
                  Restaurar
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/certificaciones/${c.id}`}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void alternarVisibilidad(c)}>
                    {c.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {c.visible ? "Ocultar" : "Mostrar"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => setPorEliminar(c)}>
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
        title="¿Eliminar esta certificación?"
        description={`"${porEliminar?.nombre}" se moverá a la papelera. Podrás restaurarla después.`}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={eliminar.isPending}
        onConfirm={() => void confirmarEliminar()}
      />
    </div>
  );
}
