<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostSummaryResource;
use App\Services\PostService;
use Illuminate\Http\Request;

/** Lectura pública - solo posts publicados (con fecha_publicacion ya cumplida, ver Post::scopePublicados). */
class PostController extends Controller
{
    public function __construct(private readonly PostService $posts) {}

    public function index(Request $request)
    {
        $filtros = [
            'solo_publicados' => true,
            'busqueda' => $request->query('busqueda'),
            'categoria_id' => $request->query('categoria_id'),
            'tipo_audiencia' => $request->query('tipo_audiencia'),
            'orden_por' => $request->query('orden_por', 'fecha_publicacion'),
            'orden_direccion' => $request->query('orden_direccion', 'desc'),
        ];

        $porPagina = min((int) $request->query('por_pagina', 12), 50);

        return PostSummaryResource::collection($this->posts->paginar($filtros, $porPagina));
    }

    public function show(string $slug)
    {
        $post = $this->posts->buscarPorSlugPublico($slug);

        abort_if(! $post, 404, 'Artículo no encontrado.');

        return PostResource::make($post);
    }
}
