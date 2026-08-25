<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EducacionResource;
use App\Services\EducacionService;

/** Lectura pública - solo educación visible. Sin `show`: sin slug, insumo de /trayectoria y /hire-me. */
class EducacionController extends Controller
{
    public function __construct(private readonly EducacionService $educaciones) {}

    public function index()
    {
        return EducacionResource::collection($this->educaciones->listarPublicas());
    }
}
