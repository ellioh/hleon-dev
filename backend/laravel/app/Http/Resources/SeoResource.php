<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'metaTitulo' => $this->meta_titulo,
            'metaDescripcion' => $this->meta_descripcion,
            'canonicalUrl' => $this->canonical_url,
            'robotsIndex' => $this->robots_index,
            'robotsFollow' => $this->robots_follow,
            'ogTitulo' => $this->og_titulo,
            'ogDescripcion' => $this->og_descripcion,
            'ogImagen' => MediaResource::make($this->whenLoaded('ogImagen')),
            'ogTipo' => $this->og_tipo,
            'twitterCard' => $this->twitter_card,
            'twitterTitulo' => $this->twitter_titulo,
            'twitterDescripcion' => $this->twitter_descripcion,
            'twitterImagen' => MediaResource::make($this->whenLoaded('twitterImagen')),
        ];
    }
}
