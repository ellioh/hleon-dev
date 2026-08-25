<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCertificacionRequest;
use App\Http\Requests\UpdateCertificacionRequest;
use App\Http\Resources\CertificacionResource;
use App\Models\Certificacion;
use App\Services\CertificacionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/** CRUD completo de administración - sin publicar/despublicar, mismo patrón que Admin\ServicioController (ver ADR 0009). */
class CertificacionController extends Controller
{
    private const RELACIONES = ['imagenInsignia'];

    public function __construct(private readonly CertificacionService $certificaciones) {}

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Certificacion::class);

        $filtros = [
            'busqueda' => $request->query('busqueda'),
            'visible' => $request->has('visible') ? $request->boolean('visible') : null,
            'solo_eliminados' => $request->boolean('papelera'),
        ];

        return CertificacionResource::collection($this->certificaciones->listar($filtros));
    }

    public function show(Certificacion $certificacion)
    {
        Gate::authorize('view', $certificacion);

        return CertificacionResource::make($certificacion->load(self::RELACIONES));
    }

    public function store(StoreCertificacionRequest $request)
    {
        $certificacion = $this->certificaciones->crear($request->validated());

        return CertificacionResource::make($certificacion->load(self::RELACIONES))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCertificacionRequest $request, Certificacion $certificacion)
    {
        $certificacion = $this->certificaciones->actualizar($certificacion, $request->validated());

        return CertificacionResource::make($certificacion->load(self::RELACIONES));
    }

    public function destroy(Certificacion $certificacion)
    {
        Gate::authorize('delete', $certificacion);

        $this->certificaciones->eliminar($certificacion);

        return response()->json(['ok' => true]);
    }

    public function restore(int $id)
    {
        $certificacion = Certificacion::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $certificacion);

        return CertificacionResource::make($this->certificaciones->restaurar($id)->load(self::RELACIONES));
    }
}
