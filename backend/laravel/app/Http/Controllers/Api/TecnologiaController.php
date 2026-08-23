<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TecnologiaResource;
use App\Models\Tecnologia;

/**
 * Listado simple, público - alimenta el filtro por tecnología en
 * /portafolio y el multi-select de tecnologías en el admin.
 */
class TecnologiaController extends Controller
{
    public function index()
    {
        return TecnologiaResource::collection(Tecnologia::query()->orderBy('orden')->get());
    }
}
