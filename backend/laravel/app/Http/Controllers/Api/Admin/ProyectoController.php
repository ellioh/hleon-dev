<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProyectoRequest;
use App\Http\Requests\UpdateProyectoRequest;
use App\Http\Resources\ProyectoResource;
use App\Http\Resources\ProyectoSummaryResource;
use App\Models\Proyecto;
use App\Services\ProyectoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * CRUD completo de administración - a diferencia del controller público,
 * ve borradores, proyectos confidenciales sin enmascarar, y soporta
 * papelera (soft delete + restore). Patrón de referencia para los
 * futuros Admin\PostController/Admin\ServicioController.
 */
class ProyectoController extends Controller
{
    public function __construct(private readonly ProyectoService $proyectos) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Proyecto::class);

        $filtros = [
            'busqueda' => $request->query('busqueda'),
            'categoria_id' => $request->query('categoria_id'),
            'estado' => $request->query('estado'),
            'estado_publicacion' => $request->query('estado_publicacion'),
            'tecnologia_id' => $request->query('tecnologia_id'),
            'destacado' => $request->has('destacado') ? $request->boolean('destacado') : null,
            'solo_eliminados' => $request->boolean('papelera'),
            'orden_por' => $request->query('orden_por', 'creado_en'),
            'orden_direccion' => $request->query('orden_direccion', 'desc'),
        ];

        $porPagina = min((int) $request->query('por_pagina', 15), 100);

        return ProyectoSummaryResource::collection($this->proyectos->paginar($filtros, $porPagina));
    }

    public function show(Proyecto $proyecto)
    {
        Gate::authorize('view', $proyecto);

        return ProyectoResource::make($proyecto->load([
            'categoria', 'organizacion', 'imagenPrincipal', 'tecnologias',
            'resultados', 'galeria', 'videos', 'seo.ogImagen', 'seo.twitterImagen',
        ]));
    }

    public function store(StoreProyectoRequest $request)
    {
        $datos = $request->safe()->except('seo');
        $proyecto = $this->proyectos->crear($datos);

        if ($request->has('seo')) {
            $this->proyectos->guardarSeo($proyecto, $request->input('seo'));
        }

        return ProyectoResource::make($proyecto->load(['categoria', 'organizacion', 'imagenPrincipal', 'tecnologias', 'seo']))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateProyectoRequest $request, Proyecto $proyecto)
    {
        $datos = $request->safe()->except('seo');
        $proyecto = $this->proyectos->actualizar($proyecto, $datos);

        if ($request->has('seo')) {
            $this->proyectos->guardarSeo($proyecto, $request->input('seo'));
        }

        return ProyectoResource::make($proyecto->load(['categoria', 'organizacion', 'imagenPrincipal', 'tecnologias', 'seo']));
    }

    public function publicar(Proyecto $proyecto)
    {
        Gate::authorize('update', $proyecto);

        return ProyectoResource::make($this->proyectos->publicar($proyecto));
    }

    public function despublicar(Proyecto $proyecto)
    {
        Gate::authorize('update', $proyecto);

        return ProyectoResource::make($this->proyectos->despublicar($proyecto));
    }

    public function destroy(Proyecto $proyecto)
    {
        Gate::authorize('delete', $proyecto);

        $this->proyectos->eliminar($proyecto);

        return response()->json(['ok' => true]);
    }

    public function restore(int $id)
    {
        $proyecto = Proyecto::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $proyecto);

        return ProyectoResource::make($this->proyectos->restaurar($id));
    }

    /** Reemplaza la galería completa, en el orden recibido (ver GalleryUploader del admin). */
    public function actualizarGaleria(Request $request, Proyecto $proyecto)
    {
        Gate::authorize('update', $proyecto);

        $datos = $request->validate([
            'media_ids' => ['present', 'array'],
            'media_ids.*' => ['integer', 'exists:media,id'],
        ]);

        $this->proyectos->sincronizarGaleria($proyecto, $datos['media_ids']);

        return ProyectoResource::make($proyecto->fresh(['galeria']));
    }
}
