<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Forma "tarjeta" para listados - deliberadamente sin los campos de
 * narrativa (el_desafio/la_solucion/mi_rol), que solo pesan en el
 * detalle. Ver ProyectoResource para el patrón completo.
 */
class ProyectoSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'slug' => $this->slug,
            'resumenEjecutivo' => $this->resumen_ejecutivo,
            'categoria' => CategoriaResource::make($this->whenLoaded('categoria')),
            'organizacion' => OrganizacionResource::make($this->whenLoaded('organizacion')),
            'imagenPrincipal' => MediaResource::make($this->whenLoaded('imagenPrincipal')),
            'urlPublica' => $this->url_publica,
            'tecnologias' => TecnologiaResource::collection($this->whenLoaded('tecnologias')),
            'estado' => $this->estado,
            'modalidad' => $this->modalidad,
            'destacado' => $this->destacado,
            'visible' => $this->visible,
            'estadoPublicacion' => $this->estado_publicacion,
            'esConfidencial' => $this->es_confidencial,
            'fechaInicio' => $this->fecha_inicio?->toDateString(),
            'orden' => $this->orden,
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
