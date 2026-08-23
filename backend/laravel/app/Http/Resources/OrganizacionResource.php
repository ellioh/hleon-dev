<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expone `nombreVisible` (nombre_publico si existe, si no nombre real) -
 * el consumidor público nunca necesita saber cuál de los dos se usó.
 * El admin, en cambio, siempre ve `nombre` real (ver AdminOrganizacionResource
 * si se necesita distinguir en el futuro).
 */
class OrganizacionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre_visible,
            'logo' => MediaResource::make($this->whenLoaded('logo')),
            'url' => $this->url,
        ];
    }
}
