<?php

namespace App\Services;

use App\Models\Certificacion;
use App\Repositories\CertificacionRepository;

/** Sin slug, sin publicar()/despublicar() - el más simple de los servicios hasta ahora. */
class CertificacionService
{
    public function __construct(private readonly CertificacionRepository $repositorio) {}

    public function listar(array $filtros = [])
    {
        return $this->repositorio->listar($filtros);
    }

    public function listarPublicas()
    {
        return $this->repositorio->listar(['solo_visibles' => true]);
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Certificacion
    {
        return $this->repositorio->buscarPorId($id, $incluirEliminados);
    }

    public function crear(array $datos): Certificacion
    {
        // Explícito, no confiar en el DEFAULT de columna: Eloquent no
        // refresca atributos que nunca se asignaron en el objeto en
        // memoria tras el INSERT (mismo bug real documentado en el ADR de
        // Blog para `publicado`) - sin esto, la respuesta de creación
        // mostraba `visible`/`orden`/`destacado` como null en vez de sus
        // valores por defecto reales.
        $datos['visible'] ??= true;
        $datos['destacado'] ??= false;
        $datos['orden'] ??= 0;

        return $this->repositorio->crear($datos);
    }

    public function actualizar(Certificacion $certificacion, array $datos): Certificacion
    {
        return $this->repositorio->actualizar($certificacion, $datos);
    }

    public function eliminar(Certificacion $certificacion): void
    {
        $this->repositorio->eliminar($certificacion);
    }

    public function restaurar(int $id): Certificacion
    {
        return $this->repositorio->restaurar($id);
    }
}
