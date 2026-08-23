<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProyectoResource;
use App\Http\Resources\ProyectoSummaryResource;
use App\Services\ProyectoService;
use Illuminate\Http\Request;

/**
 * Lectura pública - solo proyectos publicados y visibles (ver
 * ProyectoRepository::paginar con `solo_publicados`, y el enmascarado de
 * confidencialidad en ProyectoService::buscarPorSlugPublico).
 */
class ProyectoController extends Controller
{
    public function __construct(private readonly ProyectoService $proyectos) {}

    public function index(Request $request)
    {
        $filtros = [
            'solo_publicados' => true,
            'busqueda' => $request->query('busqueda'),
            'categoria_id' => $request->query('categoria_id'),
            'tecnologia_id' => $request->query('tecnologia_id'),
            'destacado' => $request->has('destacado') ? $request->boolean('destacado') : null,
            'orden_por' => $request->query('orden_por', 'orden'),
            'orden_direccion' => $request->query('orden_direccion', 'asc'),
        ];

        $porPagina = min((int) $request->query('por_pagina', 12), 50);

        return ProyectoSummaryResource::collection($this->proyectos->paginar($filtros, $porPagina));
    }

    public function show(string $slug)
    {
        $proyecto = $this->proyectos->buscarPorSlugPublico($slug);

        abort_if(! $proyecto, 404, 'Proyecto no encontrado.');

        return ProyectoResource::make($proyecto);
    }
}
