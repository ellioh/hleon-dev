<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Forma "tarjeta" para listados - sin `contenido` (pesado) ni `seo`. Ver ADR 0006 para el patrón. */
class PostSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'slug' => $this->slug,
            'resumen' => $this->resumen,
            'categoria' => CategoriaResource::make($this->whenLoaded('categoria')),
            'autor' => AutorResource::make($this->whenLoaded('autor')),
            'tipoAudiencia' => $this->tipo_audiencia,
            'tags' => $this->tags ?? [],
            'imagenDestacada' => MediaResource::make($this->whenLoaded('imagenDestacada')),
            'publicado' => $this->publicado,
            'fechaPublicacion' => $this->fecha_publicacion?->toIso8601String(),
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
