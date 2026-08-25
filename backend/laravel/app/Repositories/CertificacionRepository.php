<?php

namespace App\Repositories;

use App\Models\Certificacion;
use Illuminate\Database\Eloquent\Collection;

/** Sin paginación, mismo criterio que ExperienciaRepository - el volumen real de certificaciones no la justifica. */
class CertificacionRepository
{
    private const RELACIONES = ['imagenInsignia'];

    public function listar(array $filtros = []): Collection
    {
        $query = Certificacion::query()->with(self::RELACIONES);

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
                    ->orWhere('emisor', 'like', "%{$termino}%");
            });
        }

        return $query->orderBy('fecha_obtencion', 'desc')->orderBy('orden')->get();
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Certificacion
    {
        $query = Certificacion::query()->with(self::RELACIONES);

        if ($incluirEliminados) {
            $query->withTrashed();
        }

        return $query->find($id);
    }

    public function crear(array $datos): Certificacion
    {
        return Certificacion::create($datos);
    }

    public function actualizar(Certificacion $certificacion, array $datos): Certificacion
    {
        $certificacion->update($datos);

        return $certificacion->fresh(self::RELACIONES);
    }

    public function eliminar(Certificacion $certificacion): void
    {
        $certificacion->delete();
    }

    public function restaurar(int $id): Certificacion
    {
        $certificacion = Certificacion::withTrashed()->findOrFail($id);
        $certificacion->restore();

        return $certificacion->fresh(self::RELACIONES);
    }
}
