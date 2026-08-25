<?php

namespace App\Repositories;

use App\Models\Educacion;
use Illuminate\Database\Eloquent\Collection;

/** Sin paginación, mismo criterio que CertificacionRepository/ExperienciaRepository. */
class EducacionRepository
{
    public function listar(array $filtros = []): Collection
    {
        $query = Educacion::query();

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
                $q->where('institucion', 'like', "%{$termino}%")
                    ->orWhere('titulo', 'like', "%{$termino}%");
            });
        }

        return $query->orderBy('fecha_inicio', 'desc')->orderBy('orden')->get();
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Educacion
    {
        $query = Educacion::query();

        if ($incluirEliminados) {
            $query->withTrashed();
        }

        return $query->find($id);
    }

    public function crear(array $datos): Educacion
    {
        return Educacion::create($datos);
    }

    public function actualizar(Educacion $educacion, array $datos): Educacion
    {
        $educacion->update($datos);

        return $educacion->fresh();
    }

    public function eliminar(Educacion $educacion): void
    {
        $educacion->delete();
    }

    public function restaurar(int $id): Educacion
    {
        $educacion = Educacion::withTrashed()->findOrFail($id);
        $educacion->restore();

        return $educacion->fresh();
    }
}
