import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, MoreHorizontal, Pencil, RotateCcw, Star, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { DataToolbar } from "@/components/shared/data-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategorias } from "@/hooks/use-lookups";
import {
  useCambiarVisibilidadServicio,
  useEliminarServicio,
  useServicios,
  useRestaurarServicio,
  type ServicioFiltros,
} from "@/features/servicios/api";
import type { ServicioSummary } from "@/types/api";
import { ApiError } from "@/lib/api";

export function ServiciosListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = React.useState<ServicioFiltros>({ pagina: 1 });
  const [porEliminar, setPorEliminar] = React.useState<ServicioSummary | null>(null);

  const { data, isLoading, error, refetch } = useServicios(filtros);
  const { data: categorias } = useCategorias();
  const cambiarVisibilidad = useCambiarVisibilidadServicio();
  const eliminar = useEliminarServicio();
  const restaurar = useRestaurarServicio();

  function actualizarFiltro<K extends keyof ServicioFiltros>(clave: K, valor: ServicioFiltros[K]) {
    setFiltros((prev) => ({ ...prev, [clave]: valor, pagina: 1 }));
  }

  async function alternarVisibilidad(servicio: ServicioSummary) {
    try {
      await cambiarVisibilidad.mutateAsync({ id: servicio.id, visible: !servicio.visible });
      toast.success(servicio.visible ? "Servicio oculto." : "Servicio visible.");
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
      toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar el servicio.");
    }
  }

  async function restaurarServicio(servicio: ServicioSummary) {
    try {
      await restaurar.mutateAsync(servicio.id);
      toast.success(`"${servicio.nombre}" fue restaurado.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo restaurar el servicio.");
    }
  }

  const columnas: DataTableColumn<ServicioSummary>[] = [
    {
      key: "nombre",
      header: "Servicio",
      render: (s) => (
        <div className="flex items-center gap-2">
          {s.iconoEmoji && <span className="text-lg">{s.iconoEmoji}</span>}
          <div>
            <p className="font-medium text-foreground">{s.nombre}</p>
            <p className="text-xs text-muted-foreground">/{s.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "categoria",
      header: "Categoría",
      className: "hidden sm:table-cell",
      render: (s) => s.categoria?.nombre ?? "—",
    },
    {
      key: "precio",
      header: "Precio",
      className: "hidden lg:table-cell",
      render: (s) =>
        s.rangoPrecioMin ? (
          <span className="text-sm text-muted-foreground">
            {s.moneda} {s.rangoPrecioMin}
            {s.rangoPrecioMax ? ` – ${s.rangoPrecioMax}` : "+"}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "destacado",
      header: "Destacado",
      className: "hidden md:table-cell",
      render: (s) => (s.destacado ? <Star className="h-4 w-4 fill-warning text-warning" aria-label="Destacado" /> : null),
    },
    {
      key: "estado",
      header: "Estado",
      render: (s) => <StatusBadge estado={s.eliminadoEn ? "archivado" : s.visible ? "publicado" : "borrador"} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Servicios</h1>
          <p className="text-sm text-muted-foreground">{data?.meta.total ?? 0} en total</p>
        </div>
      </div>

      <DataToolbar
        busqueda={filtros.busqueda ?? ""}
        onBusquedaChange={(v) => actualizarFiltro("busqueda", v || undefined)}
        placeholderBusqueda="Buscar por nombre..."
        onNuevo={filtros.papelera ? undefined : () => navigate("/servicios/nuevo")}
        nuevoLabel="Nuevo servicio"
        filtros={
          <>
            <Select
              value={filtros.categoria_id ? String(filtros.categoria_id) : "todas"}
              onValueChange={(v) => actualizarFiltro("categoria_id", v === "todas" ? undefined : Number(v))}
            >
              <SelectTrigger className="w-40" aria-label="Filtrar por categoría">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                {categorias?.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={filtros.papelera ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFiltros((prev) => ({ ...prev, papelera: !prev.papelera, pagina: 1 }))}
            >
              {filtros.papelera ? "Viendo papelera" : "Ver papelera"}
            </Button>
          </>
        }
      />

      <DataTable
        columns={columnas}
        data={data?.data ?? []}
        getRowId={(s) => s.id}
        loading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        emptyTitle={filtros.papelera ? "La papelera está vacía" : "Aún no hay servicios"}
        emptyDescription={filtros.papelera ? undefined : "Crea el primero para empezar a mostrar tu oferta."}
        actions={(s) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Acciones para ${s.nombre}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {s.eliminadoEn ? (
                <DropdownMenuItem onSelect={() => void restaurarServicio(s)}>
                  <RotateCcw className="h-4 w-4" />
                  Restaurar
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/servicios/${s.id}`}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void alternarVisibilidad(s)}>
                    {s.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {s.visible ? "Ocultar" : "Mostrar"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => setPorEliminar(s)}>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {data && (
        <Pagination
          paginaActual={data.meta.current_page}
          ultimaPagina={data.meta.last_page}
          total={data.meta.total}
          onCambiarPagina={(pagina) => setFiltros((prev) => ({ ...prev, pagina }))}
        />
      )}

      <ConfirmDialog
        open={porEliminar !== null}
        onOpenChange={(open) => !open && setPorEliminar(null)}
        title="¿Eliminar este servicio?"
        description={`"${porEliminar?.nombre}" se moverá a la papelera. Podrás restaurarlo después.`}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={eliminar.isPending}
        onConfirm={() => void confirmarEliminar()}
      />
    </div>
  );
}
