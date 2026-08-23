import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, RotateCcw, Star, Trash2, Upload } from "lucide-react";
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
  useCambiarPublicacion,
  useEliminarProyecto,
  useProyectos,
  useRestaurarProyecto,
  type ProyectoFiltros,
} from "@/features/proyectos/api";
import type { ProyectoSummary } from "@/types/api";
import { ApiError } from "@/lib/api";

export function ProyectosListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = React.useState<ProyectoFiltros>({ pagina: 1 });
  const [porEliminar, setPorEliminar] = React.useState<ProyectoSummary | null>(null);

  const { data, isLoading, error, refetch } = useProyectos(filtros);
  const { data: categorias } = useCategorias();
  const cambiarPublicacion = useCambiarPublicacion();
  const eliminar = useEliminarProyecto();
  const restaurar = useRestaurarProyecto();

  function actualizarFiltro<K extends keyof ProyectoFiltros>(clave: K, valor: ProyectoFiltros[K]) {
    setFiltros((prev) => ({ ...prev, [clave]: valor, pagina: 1 }));
  }

  async function alternarPublicacion(proyecto: ProyectoSummary) {
    const publicar = proyecto.estadoPublicacion === "borrador";
    try {
      await cambiarPublicacion.mutateAsync({ id: proyecto.id, publicar });
      toast.success(publicar ? "Proyecto publicado." : "Proyecto despublicado.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo cambiar la publicación.");
    }
  }

  async function confirmarEliminar() {
    if (!porEliminar) return;
    try {
      await eliminar.mutateAsync(porEliminar.id);
      toast.success(`"${porEliminar.nombre}" se movió a la papelera.`);
      setPorEliminar(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar el proyecto.");
    }
  }

  async function restaurarProyecto(proyecto: ProyectoSummary) {
    try {
      await restaurar.mutateAsync(proyecto.id);
      toast.success(`"${proyecto.nombre}" fue restaurado.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo restaurar el proyecto.");
    }
  }

  const columnas: DataTableColumn<ProyectoSummary>[] = [
    {
      key: "nombre",
      header: "Proyecto",
      render: (p) => (
        <div>
          <p className="font-medium text-foreground">{p.nombre}</p>
          <p className="text-xs text-muted-foreground">/{p.slug}</p>
        </div>
      ),
    },
    {
      key: "categoria",
      header: "Categoría",
      className: "hidden sm:table-cell",
      render: (p) => p.categoria?.nombre ?? "—",
    },
    {
      key: "tecnologias",
      header: "Tecnologías",
      className: "hidden lg:table-cell",
      render: (p) => <span className="text-sm text-muted-foreground">{p.tecnologias.map((t) => t.nombre).join(", ")}</span>,
    },
    {
      key: "destacado",
      header: "Destacado",
      className: "hidden md:table-cell",
      render: (p) => (p.destacado ? <Star className="h-4 w-4 fill-warning text-warning" aria-label="Destacado" /> : null),
    },
    {
      key: "estado",
      header: "Estado",
      render: (p) => <StatusBadge estado={p.eliminadoEn ? "archivado" : p.estadoPublicacion} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proyectos</h1>
          <p className="text-sm text-muted-foreground">{data?.meta.total ?? 0} en total</p>
        </div>
      </div>

      <DataToolbar
        busqueda={filtros.busqueda ?? ""}
        onBusquedaChange={(v) => actualizarFiltro("busqueda", v || undefined)}
        placeholderBusqueda="Buscar por nombre..."
        onNuevo={filtros.papelera ? undefined : () => navigate("/proyectos/nuevo")}
        nuevoLabel="Nuevo proyecto"
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
        getRowId={(p) => p.id}
        loading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        emptyTitle={filtros.papelera ? "La papelera está vacía" : "Aún no hay proyectos"}
        emptyDescription={filtros.papelera ? undefined : "Crea el primero para empezar a construir tu portafolio."}
        actions={(p) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Acciones para ${p.nombre}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {p.eliminadoEn ? (
                <DropdownMenuItem onSelect={() => void restaurarProyecto(p)}>
                  <RotateCcw className="h-4 w-4" />
                  Restaurar
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/proyectos/${p.id}`}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void alternarPublicacion(p)}>
                    <Upload className="h-4 w-4" />
                    {p.estadoPublicacion === "borrador" ? "Publicar" : "Despublicar"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => setPorEliminar(p)}>
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
        title="¿Eliminar este proyecto?"
        description={`"${porEliminar?.nombre}" se moverá a la papelera. Podrás restaurarlo después.`}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={eliminar.isPending}
        onConfirm={() => void confirmarEliminar()}
      />
    </div>
  );
}
