<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Forma "detalle" completa - agrega `contenido` y `seo` sobre PostSummaryResource. */
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'slug' => $this->slug,
            'resumen' => $this->resumen,
            'contenido' => $this->contenido,
            'categoria' => CategoriaResource::make($this->whenLoaded('categoria')),
            'autor' => AutorResource::make($this->whenLoaded('autor')),
            'tipoAudiencia' => $this->tipo_audiencia,
            'tags' => $this->tags ?? [],
            'imagenDestacada' => MediaResource::make($this->whenLoaded('imagenDestacada')),
            'seo' => SeoResource::make($this->whenLoaded('seo')),
            'publicado' => $this->publicado,
            'fechaPublicacion' => $this->fecha_publicacion?->toIso8601String(),
            'fechaActualizacion' => $this->fecha_actualizacion?->toIso8601String(),
            'creadoEn' => $this->creado_en?->toIso8601String(),
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
