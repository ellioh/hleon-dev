<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEducacionRequest;
use App\Http\Requests\UpdateEducacionRequest;
use App\Http\Resources\EducacionResource;
use App\Models\Educacion;
use App\Services\EducacionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/** CRUD completo de administración - sin publicar/despublicar, mismo patrón que Admin\CertificacionController. */
class EducacionController extends Controller
{
    public function __construct(private readonly EducacionService $educaciones) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Educacion::class);

        $filtros = [
            'busqueda' => $request->query('busqueda'),
            'visible' => $request->has('visible') ? $request->boolean('visible') : null,
            'solo_eliminados' => $request->boolean('papelera'),
        ];

        return EducacionResource::collection($this->educaciones->listar($filtros));
    }

    public function show(Educacion $educacion)
    {
        Gate::authorize('view', $educacion);

        return EducacionResource::make($educacion);
    }

    public function store(StoreEducacionRequest $request)
    {
        $educacion = $this->educaciones->crear($request->validated());

        return EducacionResource::make($educacion)
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateEducacionRequest $request, Educacion $educacion)
    {
        $educacion = $this->educaciones->actualizar($educacion, $request->validated());

        return EducacionResource::make($educacion);
    }

    public function destroy(Educacion $educacion)
    {
        Gate::authorize('delete', $educacion);

        $this->educaciones->eliminar($educacion);

        return response()->json(['ok' => true]);
    }

    public function restore(int $id)
    {
        $educacion = Educacion::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $educacion);

        return EducacionResource::make($this->educaciones->restaurar($id));
    }
}
