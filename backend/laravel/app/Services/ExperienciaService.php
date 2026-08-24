<?php

namespace App\Services;

use App\Models\Experiencia;
use App\Repositories\ExperienciaRepository;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

/**
 * Regla de negocio portada tal cual de ExperienciaService (Iteración 1,
 * packages/db/src/services/ExperienciaService.ts): si `actual=true`,
 * `fecha_fin` debe quedar vacía; si no, `fecha_fin` debe ser posterior a
 * `fecha_inicio`. El CHECK de la migración la refuerza a nivel de BD.
 */
class ExperienciaService
{
    public function __construct(private readonly ExperienciaRepository $repositorio) {}

    public function listar(array $filtros = [])
    {
        return $this->repositorio->listar($filtros);
    }

    public function listarPublicas()
    {
        return $this->repositorio->listar(['solo_publicadas' => true]);
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Experiencia
    {
        return $this->repositorio->buscarPorId($id, $incluirEliminados);
    }

    public function crear(array $datos): Experiencia
    {
        $this->validarFechas($datos);

        $tecnologiaIds = $datos['tecnologia_ids'] ?? [];
        $proyectoIds = $datos['proyecto_ids'] ?? [];
        $logros = $datos['logros'] ?? [];
        unset($datos['tecnologia_ids'], $datos['proyecto_ids'], $datos['logros']);

        $experiencia = $this->repositorio->crear($datos);

        if ($tecnologiaIds) {
            $experiencia->tecnologias()->sync($tecnologiaIds);
        }
        if ($proyectoIds) {
            $experiencia->proyectos()->sync($proyectoIds);
        }
        if ($logros) {
            $this->sincronizarLogros($experiencia, $logros);
        }

        return $this->repositorio->buscarPorId($experiencia->id);
    }

    public function actualizar(Experiencia $experiencia, array $datos): Experiencia
    {
        $combinado = [
            'actual' => array_key_exists('actual', $datos) ? $datos['actual'] : $experiencia->actual,
            'fecha_inicio' => $datos['fecha_inicio'] ?? $experiencia->fecha_inicio,
            'fecha_fin' => array_key_exists('fecha_fin', $datos) ? $datos['fecha_fin'] : $experiencia->fecha_fin,
        ];
        $this->validarFechas($combinado);

        $tecnologiaIds = $datos['tecnologia_ids'] ?? null;
        $proyectoIds = $datos['proyecto_ids'] ?? null;
        $logros = $datos['logros'] ?? null;
        unset($datos['tecnologia_ids'], $datos['proyecto_ids'], $datos['logros']);

        $experiencia = $this->repositorio->actualizar($experiencia, $datos);

        if ($tecnologiaIds !== null) {
            $experiencia->tecnologias()->sync($tecnologiaIds);
        }
        if ($proyectoIds !== null) {
            $experiencia->proyectos()->sync($proyectoIds);
        }
        if ($logros !== null) {
            $this->sincronizarLogros($experiencia, $logros);
        }

        return $this->repositorio->buscarPorId($experiencia->id);
    }

    public function publicar(Experiencia $experiencia): Experiencia
    {
        if (! $experiencia->resumen || ! $experiencia->descripcion) {
            throw ValidationException::withMessages([
                'estado_publicacion' => ['No se puede publicar una experiencia sin resumen y descripción.'],
            ]);
        }

        return $this->repositorio->actualizar($experiencia, ['estado_publicacion' => 'publicado']);
    }

    public function despublicar(Experiencia $experiencia): Experiencia
    {
        return $this->repositorio->actualizar($experiencia, ['estado_publicacion' => 'borrador']);
    }

    public function eliminar(Experiencia $experiencia): void
    {
        $this->repositorio->eliminar($experiencia);
    }

    public function restaurar(int $id): Experiencia
    {
        return $this->repositorio->restaurar($id);
    }

    /** Reemplaza los logros en el orden recibido - son texto libre, no un pivot a una entidad existente. */
    private function sincronizarLogros(Experiencia $experiencia, array $logros): void
    {
        $experiencia->logros()->delete();
        foreach (array_values($logros) as $orden => $texto) {
            $experiencia->logros()->create(['texto' => $texto, 'orden' => $orden]);
        }
    }

    private function validarFechas(array $datos): void
    {
        $actual = (bool) $datos['actual'];
        $fechaFin = $datos['fecha_fin'] ?? null;

        if ($actual && $fechaFin) {
            throw ValidationException::withMessages([
                'fecha_fin' => ['Una experiencia marcada como "actual" no puede tener fecha de fin.'],
            ]);
        }

        if (! $actual && $fechaFin && Carbon::parse($fechaFin)->lte(Carbon::parse($datos['fecha_inicio']))) {
            throw ValidationException::withMessages([
                'fecha_fin' => ['La fecha de fin debe ser posterior a la fecha de inicio.'],
            ]);
        }
    }
}
