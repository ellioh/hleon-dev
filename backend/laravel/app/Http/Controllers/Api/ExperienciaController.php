<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienciaResource;
use App\Services\ExperienciaService;

/**
 * Lectura pública - solo experiencias publicadas y visibles. Sin
 * `show(slug)`: a diferencia de Proyecto, no hay página propia por
 * entrada (ver ADR 0006/0007) - el consumidor (`/trayectoria`) siempre
 * pide la lista completa.
 */
class ExperienciaController extends Controller
{
    public function __construct(private readonly ExperienciaService $experiencias) {}

    public function index()
    {
        return ExperienciaResource::collection($this->experiencias->listarPublicas());
    }
}
