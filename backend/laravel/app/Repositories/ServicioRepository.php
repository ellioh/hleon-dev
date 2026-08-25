<?php

namespace App\Repositories;

use App\Models\Servicio;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/** Mismo patrón que ProyectoRepository/PostRepository (ver ADR 0006). */
class ServicioRepository
{
    private const RELACIONES_LISTADO = ['categoria'];

    private const RELACIONES_DETALLE = ['categoria', 'proyectoEjemplo', 'entregables', 'seo.ogImagen', 'seo.twitterImagen'];

    public function paginar(array $filtros = [], int $porPagina = 15): LengthAwarePaginator
    {
        $query = Servicio::query()->with(self::RELACIONES_LISTADO);

        if (! empty($filtros['incluir_eliminados'])) {
            $query->withTrashed();
        }

        if (! empty($filtros['solo_eliminados'])) {
            $query->onlyTrashed();
        }

        if (! empty($filtros['solo_visibles'])) {
            $query->visibles();
        } elseif (array_key_exists('visible', $filtros) && $filtros['visible'] !== null) {
            $query->where('visible', (bool) $filtros['visible']);
        }

        if (! empty($filtros['busqueda'])) {
            $termino = $filtros['busqueda'];
            $query->where(function ($q) use ($termino) {
                $q->where('nombre', 'like', "%{$termino}%")
                    ->orWhere('resumen_breve', 'like', "%{$termino}%");
            });
        }

        if (! empty($filtros['categoria_id'])) {
            $query->where('categoria_id', $filtros['categoria_id']);
        }

        $ordenPor = $filtros['orden_por'] ?? 'orden';
        $ordenDireccion = ($filtros['orden_direccion'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $columnasOrdenables = ['orden', 'nombre', 'creado_en'];
        $query->orderBy(in_array($ordenPor, $columnasOrdenables, true) ? $ordenPor : 'orden', $ordenDireccion);

        return $query->paginate($porPagina)->withQueryString();
    }

    public function buscarPorSlug(string $slug, bool $incluirNoVisibles = false): ?Servicio
    {
        $query = Servicio::query()->with(self::RELACIONES_DETALLE)->where('slug', $slug);

        if (! $incluirNoVisibles) {
            $query->visibles();
        }

        return $query->first();
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Servicio
    {
        $query = Servicio::query()->with(self::RELACIONES_DETALLE);

        if ($incluirEliminados) {
            $query->withTrashed();
        }

        return $query->find($id);
    }

    public function existeSlug(string $slug, ?int $excluirId = null): bool
    {
        $query = Servicio::withTrashed()->where('slug', $slug);

        if ($excluirId) {
            $query->where('id', '!=', $excluirId);
        }

        return $query->exists();
    }

    public function crear(array $datos): Servicio
    {
        return Servicio::create($datos);
    }

    public function actualizar(Servicio $servicio, array $datos): Servicio
    {
        $servicio->update($datos);

        return $servicio->fresh(self::RELACIONES_DETALLE);
    }

    public function eliminar(Servicio $servicio): void
    {
        $servicio->delete();
    }

    public function restaurar(int $id): Servicio
    {
        $servicio = Servicio::withTrashed()->findOrFail($id);
        $servicio->restore();

        return $servicio->fresh(self::RELACIONES_DETALLE);
    }
}
