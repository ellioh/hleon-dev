<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostSummaryResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/** CRUD completo de administración - mismo patrón que Admin\ProyectoController (ver ADR 0006). */
class PostController extends Controller
{
    private const RELACIONES = ['categoria', 'autor.foto', 'imagenDestacada', 'seo'];

    public function __construct(private readonly PostService $posts) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Post::class);

        $filtros = [
            'busqueda' => $request->query('busqueda'),
            'categoria_id' => $request->query('categoria_id'),
            'tipo_audiencia' => $request->query('tipo_audiencia'),
            'publicado' => $request->has('publicado') ? $request->boolean('publicado') : null,
            'solo_eliminados' => $request->boolean('papelera'),
            'orden_por' => $request->query('orden_por', 'creado_en'),
            'orden_direccion' => $request->query('orden_direccion', 'desc'),
        ];

        $porPagina = min((int) $request->query('por_pagina', 15), 100);

        return PostSummaryResource::collection($this->posts->paginar($filtros, $porPagina));
    }

    public function show(Post $post)
    {
        Gate::authorize('view', $post);

        return PostResource::make($post->load(self::RELACIONES));
    }

    public function store(StorePostRequest $request)
    {
        $datos = $request->safe()->except('seo');
        $post = $this->posts->crear($datos);

        if ($request->has('seo')) {
            $this->posts->guardarSeo($post, $request->input('seo'));
        }

        return PostResource::make($post->load(self::RELACIONES))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $datos = $request->safe()->except('seo');
        $post = $this->posts->actualizar($post, $datos);

        if ($request->has('seo')) {
            $this->posts->guardarSeo($post, $request->input('seo'));
        }

        return PostResource::make($post->load(self::RELACIONES));
    }

    public function publicar(Post $post)
    {
        Gate::authorize('update', $post);

        return PostResource::make($this->posts->publicar($post)->load(self::RELACIONES));
    }

    public function despublicar(Post $post)
    {
        Gate::authorize('update', $post);

        return PostResource::make($this->posts->despublicar($post)->load(self::RELACIONES));
    }

    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);

        $this->posts->eliminar($post);

        return response()->json(['ok' => true]);
    }

    public function restore(int $id)
    {
        $post = Post::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $post);

        return PostResource::make($this->posts->restaurar($id)->load(self::RELACIONES));
    }
}
