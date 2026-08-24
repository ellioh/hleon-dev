<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExperienciaRequest;
use App\Http\Requests\UpdateExperienciaRequest;
use App\Http\Resources\ExperienciaResource;
use App\Models\Experiencia;
use App\Services\ExperienciaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * CRUD completo de administración. A diferencia de Admin\ProyectoController,
 * `index` no pagina (ver ExperienciaRepository) y no hay endpoint de
 * galería (Experiencia no tiene Media asociada, ver ADR 0006/0007).
 */
class ExperienciaController extends Controller
{
    private const RELACIONES = ['organizacion', 'logros', 'tecnologias', 'proyectos'];

    public function __construct(private readonly ExperienciaService $experiencias) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Experiencia::class);

        $filtros = [
            'busqueda' => $request->query('busqueda'),
            'estado_publicacion' => $request->query('estado_publicacion'),
            'destacado' => $request->has('destacado') ? $request->boolean('destacado') : null,
            'solo_eliminados' => $request->boolean('papelera'),
        ];

        return ExperienciaResource::collection($this->experiencias->listar($filtros));
    }

    public function show(Experiencia $experiencia)
    {
        Gate::authorize('view', $experiencia);

        return ExperienciaResource::make($experiencia->load(self::RELACIONES));
    }

    public function store(StoreExperienciaRequest $request)
    {
        $experiencia = $this->experiencias->crear($request->validated());

        return ExperienciaResource::make($experiencia->load(self::RELACIONES))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateExperienciaRequest $request, Experiencia $experiencia)
    {
        $experiencia = $this->experiencias->actualizar($experiencia, $request->validated());

        return ExperienciaResource::make($experiencia->load(self::RELACIONES));
    }

    public function publicar(Experiencia $experiencia)
    {
        Gate::authorize('update', $experiencia);

        return ExperienciaResource::make($this->experiencias->publicar($experiencia)->load(self::RELACIONES));
    }

    public function despublicar(Experiencia $experiencia)
    {
        Gate::authorize('update', $experiencia);

        return ExperienciaResource::make($this->experiencias->despublicar($experiencia)->load(self::RELACIONES));
    }

    public function destroy(Experiencia $experiencia)
    {
        Gate::authorize('delete', $experiencia);

        $this->experiencias->eliminar($experiencia);

        return response()->json(['ok' => true]);
    }

    public function restore(int $id)
    {
        $experiencia = Experiencia::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $experiencia);

        return ExperienciaResource::make($this->experiencias->restaurar($id)->load(self::RELACIONES));
    }
}
