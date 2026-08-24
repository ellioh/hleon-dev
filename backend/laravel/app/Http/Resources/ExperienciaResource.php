<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Forma única, sin split lista/detalle: a diferencia de Proyecto, una
 * experiencia no tiene narrativa pesada por entrada ni página propia, así
 * que la distinción no aporta (ver ADR 0006/0007).
 */
class ExperienciaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organizacion' => OrganizacionResource::make($this->whenLoaded('organizacion')),
            'rol' => $this->rol,
            'modalidad' => $this->modalidad,
            'fechaInicio' => $this->fecha_inicio?->toDateString(),
            'fechaFin' => $this->fecha_fin?->toDateString(),
            'actual' => $this->actual,
            'resumen' => $this->resumen,
            'descripcion' => $this->descripcion,
            'ubicacion' => $this->ubicacion,
            'logros' => $this->whenLoaded('logros', fn () => $this->logros->map(fn ($l) => [
                'id' => $l->id,
                'texto' => $l->texto,
                'orden' => $l->orden,
            ])),
            'tecnologias' => TecnologiaResource::collection($this->whenLoaded('tecnologias')),
            'proyectos' => ProyectoSummaryResource::collection($this->whenLoaded('proyectos')),
            'destacado' => $this->destacado,
            'orden' => $this->orden,
            'visible' => $this->visible,
            'estadoPublicacion' => $this->estado_publicacion,
            'creadoEn' => $this->creado_en?->toIso8601String(),
            'actualizadoEn' => $this->actualizado_en?->toIso8601String(),
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
