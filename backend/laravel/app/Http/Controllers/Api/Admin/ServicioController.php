<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServicioRequest;
use App\Http\Requests\UpdateServicioRequest;
use App\Http\Resources\ServicioResource;
use App\Http\Resources\ServicioSummaryResource;
use App\Models\Servicio;
use App\Services\ServicioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * CRUD completo de administración - sin publicar/despublicar (a
 * diferencia de Admin\ProyectoController): `visible` se cambia como
 * cualquier otro campo vía update(), ver ADR de Servicios.
 */
class ServicioController extends Controller
{
    private const RELACIONES = ['categoria', 'proyectoEjemplo', 'entregables', 'seo'];

    public function __construct(private readonly ServicioService $servicios) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Servicio::class);

        $filtros = [
            'busqueda' => $request->query('busqueda'),
            'categoria_id' => $request->query('categoria_id'),
            'visible' => $request->has('visible') ? $request->boolean('visible') : null,
            'solo_eliminados' => $request->boolean('papelera'),
            'orden_por' => $request->query('orden_por', 'orden'),
            'orden_direccion' => $request->query('orden_direccion', 'asc'),
        ];

        $porPagina = min((int) $request->query('por_pagina', 15), 100);

        return ServicioSummaryResource::collection($this->servicios->paginar($filtros, $porPagina));
    }

    public function show(Servicio $servicio)
    {
        Gate::authorize('view', $servicio);

        return ServicioResource::make($servicio->load(self::RELACIONES));
    }

    public function store(StoreServicioRequest $request)
    {
        $datos = $request->safe()->except('seo');
        $servicio = $this->servicios->crear($datos);

        if ($request->has('seo')) {
            $this->servicios->guardarSeo($servicio, $request->input('seo'));
        }

        return ServicioResource::make($servicio->load(self::RELACIONES))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateServicioRequest $request, Servicio $servicio)
    {
        $datos = $request->safe()->except('seo');
        $servicio = $this->servicios->actualizar($servicio, $datos);

        if ($request->has('seo')) {
            $this->servicios->guardarSeo($servicio, $request->input('seo'));
        }

        return ServicioResource::make($servicio->load(self::RELACIONES));
    }

    public function destroy(Servicio $servicio)
    {
        Gate::authorize('delete', $servicio);

        $this->servicios->eliminar($servicio);

        return response()->json(['ok' => true]);
    }

    public function restore(int $id)
    {
        $servicio = Servicio::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $servicio);

        return ServicioResource::make($this->servicios->restaurar($id)->load(self::RELACIONES));
    }
}
