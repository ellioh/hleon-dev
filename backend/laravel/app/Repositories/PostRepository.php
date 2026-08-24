<?php

namespace App\Repositories;

use App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/** Mismo patrón que ProyectoRepository (ver ADR 0006) - paginar/buscarPorSlug/buscarPorId/existeSlug. */
class PostRepository
{
    private const RELACIONES_LISTADO = ['categoria', 'autor.foto', 'imagenDestacada'];

    private const RELACIONES_DETALLE = ['categoria', 'autor.foto', 'imagenDestacada', 'seo.ogImagen', 'seo.twitterImagen'];

    public function paginar(array $filtros = [], int $porPagina = 15): LengthAwarePaginator
    {
        $query = Post::query()->with(self::RELACIONES_LISTADO);

        if (! empty($filtros['incluir_eliminados'])) {
            $query->withTrashed();
        }

        if (! empty($filtros['solo_eliminados'])) {
            $query->onlyTrashed();
        }

        if (! empty($filtros['solo_publicados'])) {
            $query->publicados();
        } elseif (array_key_exists('publicado', $filtros) && $filtros['publicado'] !== null) {
            $query->where('publicado', (bool) $filtros['publicado']);
        }

        if (! empty($filtros['busqueda'])) {
            $termino = $filtros['busqueda'];
            $query->where(function ($q) use ($termino) {
                $q->where('titulo', 'like', "%{$termino}%")
                    ->orWhere('resumen', 'like', "%{$termino}%");
            });
        }

        if (! empty($filtros['categoria_id'])) {
            $query->where('categoria_id', $filtros['categoria_id']);
        }

        if (! empty($filtros['tipo_audiencia'])) {
            $query->where('tipo_audiencia', $filtros['tipo_audiencia']);
        }

        $ordenPor = $filtros['orden_por'] ?? 'fecha_publicacion';
        $ordenDireccion = ($filtros['orden_direccion'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $columnasOrdenables = ['fecha_publicacion', 'titulo', 'creado_en'];
        $query->orderBy(in_array($ordenPor, $columnasOrdenables, true) ? $ordenPor : 'fecha_publicacion', $ordenDireccion);

        return $query->paginate($porPagina)->withQueryString();
    }

    public function buscarPorSlug(string $slug, bool $incluirNoPublicados = false): ?Post
    {
        $query = Post::query()->with(self::RELACIONES_DETALLE)->where('slug', $slug);

        if (! $incluirNoPublicados) {
            $query->publicados();
        }

        return $query->first();
    }

    public function buscarPorId(int $id, bool $incluirEliminados = false): ?Post
    {
        $query = Post::query()->with(self::RELACIONES_DETALLE);

        if ($incluirEliminados) {
            $query->withTrashed();
        }

        return $query->find($id);
    }

    public function existeSlug(string $slug, ?int $excluirId = null): bool
    {
        $query = Post::withTrashed()->where('slug', $slug);

        if ($excluirId) {
            $query->where('id', '!=', $excluirId);
        }

        return $query->exists();
    }

    public function crear(array $datos): Post
    {
        return Post::create($datos);
    }

    public function actualizar(Post $post, array $datos): Post
    {
        $post->update($datos);

        return $post->fresh(self::RELACIONES_DETALLE);
    }

    public function eliminar(Post $post): void
    {
        $post->delete();
    }

    public function restaurar(int $id): Post
    {
        $post = Post::withTrashed()->findOrFail($id);
        $post->restore();

        return $post->fresh(self::RELACIONES_DETALLE);
    }
}
