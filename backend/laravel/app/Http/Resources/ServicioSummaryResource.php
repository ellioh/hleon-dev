<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Forma "tarjeta" para listados - sin `descripcionCompleta`/`entregables`/`seo`. Ver ADR 0006 para el patrón. */
class ServicioSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'slug' => $this->slug,
            'iconoEmoji' => $this->icono_emoji,
            'resumenBreve' => $this->resumen_breve,
            'categoria' => CategoriaResource::make($this->whenLoaded('categoria')),
            'rangoPrecioMin' => $this->rango_precio_min,
            'rangoPrecioMax' => $this->rango_precio_max,
            'moneda' => $this->moneda,
            'tiempoEstimado' => $this->tiempo_estimado,
            'visible' => $this->visible,
            'destacado' => $this->destacado,
            'orden' => $this->orden,
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
