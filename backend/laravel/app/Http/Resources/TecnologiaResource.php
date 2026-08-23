<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TecnologiaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'slug' => $this->slug,
            'categoria' => $this->categoria,
            'icono' => $this->icono,
            'logo' => MediaResource::make($this->whenLoaded('logo')),
            'colorAcento' => $this->color_acento,
        ];
    }
}
