<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PerfilResource;
use App\Services\PerfilService;

/** Público, sin auth: insumo de /hire-me (ver ADR de Educación/hire-me). */
class PerfilController extends Controller
{
    public function __construct(private readonly PerfilService $perfil) {}

    public function show()
    {
        $perfil = $this->perfil->obtener();

        return $perfil ? PerfilResource::make($perfil->load('foto')) : response()->json(['data' => null]);
    }
}
