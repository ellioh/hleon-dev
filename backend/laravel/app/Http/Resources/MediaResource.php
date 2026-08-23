<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => $this->url,
            'tipo' => $this->tipo,
            'altText' => $this->alt_text,
            'ancho' => $this->ancho,
            'alto' => $this->alto,
        ];
    }
}
