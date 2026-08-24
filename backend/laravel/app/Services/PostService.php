<?php

namespace App\Services;

use App\Models\Post;
use App\Repositories\PostRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * A diferencia de Proyecto, `publicar()` no exige narrativa adicional:
 * titulo/resumen/contenido/categoria_id ya son obligatorios desde la
 * creación (no hay campos narrativos opcionales-hasta-publicar como
 * el_desafio/la_solucion/mi_rol), así que no hay una regla nueva que
 * validar en este paso - solo cambia el estado y fija fecha_publicacion
 * si todavía no se definió (permite publicación programada: si el admin
 * ya puso una fecha futura, se respeta).
 */
class PostService
{
    public function __construct(
        private readonly PostRepository $repositorio,
        private readonly PerfilService $perfil
    ) {}

    public function paginar(array $filtros, int $porPagina = 15)
    {
        return $this->repositorio->paginar($filtros, $porPagina);
    }

    public function buscarPorSlugPublico(string $slug): ?Post
    {
        return $this->repositorio->buscarPorSlug($slug, incluirNoPublicados: false);
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Post
    {
        return $this->repositorio->buscarPorId($id, $incluirEliminados);
    }

    public function crear(array $datos): Post
    {
        $perfil = $this->perfil->obtener();
        if (! $perfil) {
            throw ValidationException::withMessages([
                'autor_id' => ['Completa tu perfil ("Mi perfil") antes de crear artículos - un post siempre necesita un autor.'],
            ]);
        }

        $datos['autor_id'] = $perfil->id;
        $datos['slug'] = $this->resolverSlugUnico($datos['slug'] ?? $datos['titulo']);
        $datos['fecha_publicacion'] ??= now();
        // Explícito, no confiar en el DEFAULT de la columna: Eloquent no
        // refresca atributos que nunca se asignaron en el objeto en
        // memoria tras el INSERT, así que sin esto la respuesta de la API
        // mostraba `publicado: null` en vez de `false` justo después de
        // crear (bug real, confirmado comparando con una relectura de BD).
        $datos['publicado'] ??= false;

        return $this->repositorio->crear($datos);
    }

    public function actualizar(Post $post, array $datos): Post
    {
        if (isset($datos['slug']) || isset($datos['titulo'])) {
            $datos['slug'] = $this->resolverSlugUnico($datos['slug'] ?? $datos['titulo'] ?? $post->titulo, $post->id);
        }

        return $this->repositorio->actualizar($post, $datos);
    }

    public function publicar(Post $post): Post
    {
        return $this->repositorio->actualizar($post, [
            'publicado' => true,
            'fecha_publicacion' => $post->fecha_publicacion ?? now(),
        ]);
    }

    public function despublicar(Post $post): Post
    {
        return $this->repositorio->actualizar($post, ['publicado' => false]);
    }

    public function eliminar(Post $post): void
    {
        $this->repositorio->eliminar($post);
    }

    public function restaurar(int $id): Post
    {
        return $this->repositorio->restaurar($id);
    }

    /** Crea o actualiza la fila `seo_metadata` polimórfica del post (mismo patrón que ProyectoService::guardarSeo). */
    public function guardarSeo(Post $post, array $datosSeo): void
    {
        $post->seo()->updateOrCreate([], $datosSeo);
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
