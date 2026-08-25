<?php

namespace App\Services;

use App\Models\Servicio;
use App\Repositories\ServicioRepository;
use Illuminate\Support\Str;

/**
 * Sin publicar()/despublicar(): Servicio no tiene estado_publicacion, solo
 * `visible` (se cambia como cualquier otro campo del formulario vía
 * actualizar(), no hay una acción de publicación separada - ver ADR de
 * Servicios).
 */
class ServicioService
{
    public function __construct(private readonly ServicioRepository $repositorio) {}

    public function paginar(array $filtros, int $porPagina = 15)
    {
        return $this->repositorio->paginar($filtros, $porPagina);
    }

    public function buscarPorSlugPublico(string $slug): ?Servicio
    {
        $servicio = $this->repositorio->buscarPorSlug($slug, incluirNoVisibles: false);

        return $servicio ? $this->enmascarar($servicio) : null;
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Servicio
    {
        return $this->repositorio->buscarPorId($id, $incluirEliminados);
    }

    public function crear(array $datos): Servicio
    {
        $datos['slug'] = $this->resolverSlugUnico($datos['slug'] ?? $datos['nombre']);

        $entregables = $datos['entregables'] ?? [];
        unset($datos['entregables']);

        $servicio = $this->repositorio->crear($datos);

        if ($entregables) {
            $this->sincronizarEntregables($servicio, $entregables);
        }

        return $this->repositorio->buscarPorId($servicio->id);
    }

    public function actualizar(Servicio $servicio, array $datos): Servicio
    {
        if (isset($datos['slug']) || isset($datos['nombre'])) {
            $datos['slug'] = $this->resolverSlugUnico($datos['slug'] ?? $datos['nombre'] ?? $servicio->nombre, $servicio->id);
        }

        $entregables = $datos['entregables'] ?? null;
        unset($datos['entregables']);

        $servicio = $this->repositorio->actualizar($servicio, $datos);

        if ($entregables !== null) {
            $this->sincronizarEntregables($servicio, $entregables);
        }

        return $this->repositorio->buscarPorId($servicio->id);
    }

    public function eliminar(Servicio $servicio): void
    {
        $this->repositorio->eliminar($servicio);
    }

    public function restaurar(int $id): Servicio
    {
        return $this->repositorio->restaurar($id);
    }

    /** Crea o actualiza la fila `seo_metadata` polimórfica del servicio (mismo patrón que ProyectoService::guardarSeo). */
    public function guardarSeo(Servicio $servicio, array $datosSeo): void
    {
        $servicio->seo()->updateOrCreate([], $datosSeo);
    }

    /** Reemplaza los entregables en el orden recibido - texto libre, no un pivot a una entidad existente. */
    private function sincronizarEntregables(Servicio $servicio, array $entregables): void
    {
        $servicio->entregables()->delete();
        foreach (array_values($entregables) as $orden => $texto) {
            $servicio->entregables()->create(['texto' => $texto, 'orden' => $orden]);
        }
    }

    /**
     * Oculta el proyecto de ejemplo si no está publicado (borrador o
     * confidencial) - sin esto, la vista pública de un servicio podría
     * filtrar la existencia y los datos de un proyecto todavía no
     * publicado, solo por estar enlazado como ejemplo. Se usa SOLO en la
     * capa pública; el admin siempre ve el dato completo.
     */
    private function enmascarar(Servicio $servicio): Servicio
    {
        $ejemplo = $servicio->proyectoEjemplo;
        if ($ejemplo && ($ejemplo->estado_publicacion !== 'publicado' || ! $ejemplo->visible || $ejemplo->es_confidencial)) {
            $servicio->setRelation('proyectoEjemplo', null);
        }

        return $servicio;
    }

    private function resolverSlugUnico(string $base, ?int $excluirId = null): string
    {
        $slugBase = Str::slug($base);
        $candidato = $slugBase;
        $sufijo = 2;

        while ($this->repositorio->existeSlug($candidato, $excluirId)) {
            $candidato = "{$slugBase}-{$sufijo}";
            $sufijo++;
        }

        return $candidato;
    }
}
