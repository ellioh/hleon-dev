<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PerfilRequest;
use App\Http\Resources\PerfilResource;
use App\Services\PerfilService;

/**
 * Solo admin, sin equivalente público todavía: nada consume Perfil desde
 * el sitio (Post.autor_id se resuelve internamente al publicar, no vía
 * una página "Acerca de" - eso es un módulo futuro, no parte de Blog).
 */
class PerfilController extends Controller
{
    public function __construct(private readonly PerfilService $perfil) {}

    public function show()
    {
        $perfil = $this->perfil->obtener();

        return $perfil ? PerfilResource::make($perfil->load('foto')) : response()->json(['data' => null]);
    }

    public function update(PerfilRequest $request)
    {
        $perfil = $this->perfil->guardar($request->validated());

        return PerfilResource::make($perfil->load('foto'));
    }
}
