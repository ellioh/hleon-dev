<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Vista pública, mínima, del Perfil como autor de un Post - a propósito
 * no reutiliza PerfilResource completo (expone email, bio larga,
 * disponibilidad, etc., que no deben salir en una respuesta pública de
 * artículo).
 */
class AutorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'nombre' => $this->nombre_publico ?: $this->nombre_completo,
            'tituloProfesional' => $this->titulo_profesional,
            'foto' => MediaResource::make($this->whenLoaded('foto')),
        ];
    }
}
