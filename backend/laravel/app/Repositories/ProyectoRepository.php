<?php

namespace App\Repositories;

use App\Models\Proyecto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Eloquent ya resuelve el CRUD básico (save/find/where); este repositorio
 * existe para centralizar la construcción de la consulta compleja de
 * listado (búsqueda + múltiples filtros + orden + paginación), que de
 * otro modo se repetiría entre el controller público y el de admin.
 *
 * Patrón de referencia: los futuros repositorios de Post/Servicio siguen
 * esta misma forma (paginar/buscarPorSlug/buscarPorId/existeSlug).
 */
class ProyectoRepository
{
    private const RELACIONES_LISTADO = ['categoria', 'organizacion', 'imagenPrincipal', 'tecnologias'];

    private const RELACIONES_DETALLE = [
        'categoria', 'organizacion', 'imagenPrincipal', 'tecnologias',
        'resultados', 'galeria', 'videos', 'seo.ogImagen', 'seo.twitterImagen',
    ];

    public function paginar(array $filtros = [], int $porPagina = 15): LengthAwarePaginator
    {
        $query = Proyecto::query()->with(self::RELACIONES_LISTADO);

        if (! empty($filtros['incluir_eliminados'])) {
            $query->withTrashed();
        }

        if (! empty($filtros['solo_eliminados'])) {
            $query->onlyTrashed();
        }

        if (! empty($filtros['solo_publicados'])) {
            $query->publicados();
        } elseif (! empty($filtros['estado_publicacion'])) {
            $query->where('estado_publicacion', $filtros['estado_publicacion']);
        }

        if (! empty($filtros['busqueda'])) {
            $termino = $filtros['busqueda'];
            $query->where(function ($q) use ($termino) {
                $q->where('nombre', 'like', "%{$termino}%")
                    ->orWhere('resumen_ejecutivo', 'like', "%{$termino}%");
            });
        }

        if (! empty($filtros['categoria_id'])) {
            $query->where('categoria_id', $filtros['categoria_id']);
        }

        if (! empty($filtros['estado'])) {
            $query->where('estado', $filtros['estado']);
        }

        if (array_key_exists('destacado', $filtros) && $filtros['destacado'] !== null) {
            $query->where('destacado', (bool) $filtros['destacado']);
        }

        if (! empty($filtros['tecnologia_id'])) {
            $query->whereHas('tecnologias', fn ($q) => $q->where('tecnologias.id', $filtros['tecnologia_id']));
        }

        $ordenPor = $filtros['orden_por'] ?? 'orden';
        $ordenDireccion = ($filtros['orden_direccion'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $columnasOrdenables = ['orden', 'nombre', 'fecha_inicio', 'creado_en'];
        $query->orderBy(in_array($ordenPor, $columnasOrdenables, true) ? $ordenPor : 'orden', $ordenDireccion);

        return $query->paginate($porPagina)->withQueryString();
    }

    public function buscarPorSlug(string $slug, bool $incluirNoPublicados = false): ?Proyecto
    {
        $query = Proyecto::query()->with(self::RELACIONES_DETALLE)->where('slug', $slug);

        if (! $incluirNoPublicados) {
            $query->publicados();
        }

        return $query->first();
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Proyecto
    {
        $query = Proyecto::query()->with(self::RELACIONES_DETALLE);

        if ($incluirEliminados) {
            $query->withTrashed();
        }

        return $query->find($id);
    }

    public function existeSlug(string $slug, ?int $excluirId = null): bool
    {
        $query = Proyecto::withTrashed()->where('slug', $slug);

        if ($excluirId) {
            $query->where('id', '!=', $excluirId);
        }

        return $query->exists();
    }

    public function crear(array $datos): Proyecto
    {
        return Proyecto::create($datos);
    }

    public function actualizar(Proyecto $proyecto, array $datos): Proyecto
    {
        $proyecto->update($datos);

        return $proyecto->fresh(self::RELACIONES_DETALLE);
    }

    public function eliminar(Proyecto $proyecto): void
    {
        $proyecto->delete(); // soft delete (SoftDeletes + eliminado_en)
    }

    public function restaurar(int $id): Proyecto
    {
        $proyecto = Proyecto::withTrashed()->findOrFail($id);
        $proyecto->restore();

        return $proyecto->fresh(self::RELACIONES_DETALLE);
    }
}
