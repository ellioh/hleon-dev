<?php

namespace App\Services;

use App\Models\Proyecto;
use App\Repositories\ProyectoRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Reglas de negocio de Proyecto: slug único (autogenerado desde `nombre`
 * si no se especifica), validación de publicación, sincronización de
 * tecnologías/galería, y enmascarado de confidencialidad para lectura
 * pública. El repositorio persiste; este service decide.
 */
class ProyectoService
{
    public function __construct(private readonly ProyectoRepository $repositorio) {}

    public function paginar(array $filtros, int $porPagina = 15)
    {
        return $this->repositorio->paginar($filtros, $porPagina);
    }

    public function buscarPorSlugPublico(string $slug): ?Proyecto
    {
        $proyecto = $this->repositorio->buscarPorSlug($slug, incluirNoPublicados: false);

        return $proyecto ? $this->enmascarar($proyecto) : null;
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Proyecto
    {
        return $this->repositorio->buscarPorId($id, $incluirEliminados);
    }

    public function crear(array $datos): Proyecto
    {
        $datos['slug'] = $this->resolverSlugUnico($datos['slug'] ?? $datos['nombre']);

        $tecnologiaIds = $datos['tecnologia_ids'] ?? [];
        unset($datos['tecnologia_ids']);

        if (empty($tecnologiaIds)) {
            throw ValidationException::withMessages([
                'tecnologia_ids' => ['Un proyecto debe tener al menos una tecnología asociada.'],
            ]);
        }

        $proyecto = $this->repositorio->crear($datos);
        $proyecto->tecnologias()->sync($tecnologiaIds);

        return $this->repositorio->buscarPorId($proyecto->id);
    }

    public function actualizar(Proyecto $proyecto, array $datos): Proyecto
    {
        if (isset($datos['slug']) || isset($datos['nombre'])) {
            $datos['slug'] = $this->resolverSlugUnico($datos['slug'] ?? $datos['nombre'] ?? $proyecto->nombre, $proyecto->id);
        }

        $tecnologiaIds = $datos['tecnologia_ids'] ?? null;
        unset($datos['tecnologia_ids']);

        $proyecto = $this->repositorio->actualizar($proyecto, $datos);

        if ($tecnologiaIds !== null) {
            $proyecto->tecnologias()->sync($tecnologiaIds);
        }

        return $proyecto->fresh(['categoria', 'organizacion', 'imagenPrincipal', 'tecnologias', 'resultados', 'galeria', 'videos', 'seo']);
    }

    public function publicar(Proyecto $proyecto): Proyecto
    {
        if (! $proyecto->el_desafio || ! $proyecto->la_solucion || ! $proyecto->mi_rol) {
            throw ValidationException::withMessages([
                'estado_publicacion' => ['No se puede publicar un proyecto sin desafío, solución y rol descritos.'],
            ]);
        }

        return $this->repositorio->actualizar($proyecto, ['estado_publicacion' => 'publicado']);
    }

    public function despublicar(Proyecto $proyecto): Proyecto
    {
        return $this->repositorio->actualizar($proyecto, ['estado_publicacion' => 'borrador']);
    }

    public function eliminar(Proyecto $proyecto): void
    {
        $this->repositorio->eliminar($proyecto);
    }

    public function restaurar(int $id): Proyecto
    {
        return $this->repositorio->restaurar($id);
    }

    public function sincronizarGaleria(Proyecto $proyecto, array $mediaIdsOrdenados): void
    {
        $sync = [];
        foreach (array_values($mediaIdsOrdenados) as $orden => $mediaId) {
            $sync[$mediaId] = ['orden' => $orden];
        }
        $proyecto->galeria()->sync($sync);
    }

    /** Crea o actualiza la fila `seo_metadata` polimórfica del proyecto. */
    public function guardarSeo(Proyecto $proyecto, array $datosSeo): void
    {
        $proyecto->seo()->updateOrCreate([], $datosSeo);
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

    /**
     * Oculta la organización si el proyecto es confidencial. Se usa SOLO
     * en la capa pública; el admin siempre ve el dato completo (el
     * controller admin no llama a este método).
     */
    private function enmascarar(Proyecto $proyecto): Proyecto
    {
        if ($proyecto->es_confidencial) {
            $proyecto->setRelation('organizacion', null);
        }

        return $proyecto;
    }
}
