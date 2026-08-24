<?php

namespace App\Repositories;

use App\Models\Experiencia;
use Illuminate\Database\Eloquent\Collection;

/**
 * A diferencia de ProyectoRepository, sin paginación: el volumen real de
 * una línea de tiempo laboral (unas pocas decenas de entradas en el
 * escenario más grande) no lo justifica - paginar aquí sería complejidad
 * sin beneficio. Si esto deja de ser cierto, se agrega igual que en
 * Proyecto (ver ADR 0006).
 */
class ExperienciaRepository
{
    private const RELACIONES = ['organizacion', 'logros', 'tecnologias', 'proyectos'];

    public function listar(array $filtros = []): Collection
    {
        $query = Experiencia::query()->with(self::RELACIONES);

        if (! empty($filtros['incluir_eliminados'])) {
            $query->withTrashed();
        }

        if (! empty($filtros['solo_eliminados'])) {
            $query->onlyTrashed();
        }

        if (! empty($filtros['solo_publicadas'])) {
            $query->publicadas();
        } elseif (! empty($filtros['estado_publicacion'])) {
            $query->where('estado_publicacion', $filtros['estado_publicacion']);
        }

        if (! empty($filtros['busqueda'])) {
            $termino = $filtros['busqueda'];
            $query->where(function ($q) use ($termino) {
                $q->where('rol', 'like', "%{$termino}%")
                    ->orWhere('resumen', 'like', "%{$termino}%");
            });
        }

        if (array_key_exists('destacado', $filtros) && $filtros['destacado'] !== null) {
            $query->where('destacado', (bool) $filtros['destacado']);
        }

        return $query->orderBy('fecha_inicio', 'desc')->orderBy('orden')->get();
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Experiencia
    {
        $query = Experiencia::query()->with(self::RELACIONES);

        if ($incluirEliminados) {
            $query->withTrashed();
        }

        return $query->find($id);
    }

    public function crear(array $datos): Experiencia
    {
        return Experiencia::create($datos);
    }

    public function actualizar(Experiencia $experiencia, array $datos): Experiencia
    {
        $experiencia->update($datos);

        return $experiencia->fresh(self::RELACIONES);
    }

    public function eliminar(Experiencia $experiencia): void
    {
        $experiencia->delete();
    }

    public function restaurar(int $id): Experiencia
    {
        $experiencia = Experiencia::withTrashed()->findOrFail($id);
        $experiencia->restore();

        return $experiencia->fresh(self::RELACIONES);
    }
}
