<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServicioResource;
use App\Http\Resources\ServicioSummaryResource;
use App\Services\ServicioService;
use Illuminate\Http\Request;

/** Lectura pública - solo servicios visibles (sin estado_publicacion, ver Servicio::scopeVisibles). */
class ServicioController extends Controller
{
    public function __construct(private readonly ServicioService $servicios) {}

    public function index(Request $request)
    {
        $filtros = [
            'solo_visibles' => true,
            'busqueda' => $request->query('busqueda'),
            'categoria_id' => $request->query('categoria_id'),
            'orden_por' => $request->query('orden_por', 'orden'),
            'orden_direccion' => $request->query('orden_direccion', 'asc'),
        ];

        $porPagina = min((int) $request->query('por_pagina', 12), 50);

        return ServicioSummaryResource::collection($this->servicios->paginar($filtros, $porPagina));
    }

    public function show(string $slug)
    {
        $servicio = $this->servicios->buscarPorSlugPublico($slug);

        abort_if(! $servicio, 404, 'Servicio no encontrado.');

        return ServicioResource::make($servicio);
    }
}
