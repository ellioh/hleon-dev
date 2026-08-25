<?php

namespace App\Services;

use App\Models\Educacion;
use App\Repositories\EducacionRepository;
use Illuminate\Validation\ValidationException;

/**
 * Regla de negocio: si `en_curso=true`, `fecha_fin` debe quedar vacía -
 * mismo patrón que `actual`/`fecha_fin` en ExperienciaService. Sin
 * publicar()/despublicar() - solo `visible`.
 */
class EducacionService
{
    public function __construct(private readonly EducacionRepository $repositorio) {}

    public function listar(array $filtros = [])
    {
        return $this->repositorio->listar($filtros);
    }

    public function listarPublicas()
    {
        return $this->repositorio->listar(['solo_visibles' => true]);
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Educacion
    {
        return $this->repositorio->buscarPorId($id, $incluirEliminados);
    }

    public function crear(array $datos): Educacion
    {
        $this->validarFechas($datos);

        $datos['visible'] ??= true;
        $datos['orden'] ??= 0;

        return $this->repositorio->crear($datos);
    }

    public function actualizar(Educacion $educacion, array $datos): Educacion
    {
        $combinado = [
            'en_curso' => array_key_exists('en_curso', $datos) ? $datos['en_curso'] : $educacion->en_curso,
            'fecha_fin' => array_key_exists('fecha_fin', $datos) ? $datos['fecha_fin'] : $educacion->fecha_fin,
        ];
        $this->validarFechas($combinado);

        return $this->repositorio->actualizar($educacion, $datos);
    }

    public function eliminar(Educacion $educacion): void
    {
        $this->repositorio->eliminar($educacion);
    }

    public function restaurar(int $id): Educacion
    {
        return $this->repositorio->restaurar($id);
    }

    private function validarFechas(array $datos): void
    {
        $enCurso = (bool) ($datos['en_curso'] ?? false);
        $fechaFin = $datos['fecha_fin'] ?? null;

        if ($enCurso && $fechaFin) {
            throw ValidationException::withMessages([
                'fecha_fin' => ['Un estudio marcado como "en curso" no puede tener fecha de fin.'],
            ]);
        }
    }
}
