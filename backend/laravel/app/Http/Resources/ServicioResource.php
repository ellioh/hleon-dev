<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Forma "detalle" completa - agrega `descripcionCompleta`/`entregables`/`proyectoEjemplo`/`seo` sobre ServicioSummaryResource. */
class ServicioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'slug' => $this->slug,
            'iconoEmoji' => $this->icono_emoji,
            'resumenBreve' => $this->resumen_breve,
            'descripcionCompleta' => $this->descripcion_completa,
            'categoria' => CategoriaResource::make($this->whenLoaded('categoria')),
            'rangoPrecioMin' => $this->rango_precio_min,
            'rangoPrecioMax' => $this->rango_precio_max,
            'moneda' => $this->moneda,
            'tiempoEstimado' => $this->tiempo_estimado,
            'proyectoEjemplo' => ProyectoSummaryResource::make($this->whenLoaded('proyectoEjemplo')),
            'entregables' => $this->whenLoaded('entregables', fn () => $this->entregables->map(fn ($e) => [
                'id' => $e->id,
                'texto' => $e->texto,
                'orden' => $e->orden,
            ])),
            'seo' => SeoResource::make($this->whenLoaded('seo')),
            'visible' => $this->visible,
            'destacado' => $this->destacado,
            'orden' => $this->orden,
            'creadoEn' => $this->creado_en?->toIso8601String(),
            'actualizadoEn' => $this->actualizado_en?->toIso8601String(),
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
