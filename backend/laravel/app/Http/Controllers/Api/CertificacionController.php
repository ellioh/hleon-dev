<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificacionResource;
use App\Services\CertificacionService;

/**
 * Lectura pública - solo certificaciones visibles. Sin `show`: sin slug,
 * sin página propia (insumo de /trayectoria, ver ADR 0007/0010).
 */
class CertificacionController extends Controller
{
    public function __construct(private readonly CertificacionService $certificaciones) {}

    public function index()
    {
        return CertificacionResource::collection($this->certificaciones->listarPublicas());
    }
}
